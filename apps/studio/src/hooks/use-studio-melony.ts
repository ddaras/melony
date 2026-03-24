import { useCallback, useMemo, useRef, useState } from 'react';
import { generateId } from 'melony';

export interface AggregatedMessage {
  role: string;
  content: any[];
  runId?: string;
}

const getEventRole = (event: any): 'user' | 'assistant' | 'error' => {
  if (event.type?.startsWith('user:')) {
    return 'user';
  }

  if (event.type?.startsWith('error:')) {
    return 'error';
  }

  return 'assistant';
};

const getRunId = (event: any): string | undefined => {
  if (typeof event.runId === 'string') return event.runId;
  if (typeof event.meta?.runId === 'string') return event.meta.runId;
  if (typeof event.data?.runId === 'string') return event.data.runId;
  return undefined;
};

const convertEventsToAggregatedMessages = (events: any[]): AggregatedMessage[] => {
  if (events.length === 0) {
    return [];
  }

  const messages: AggregatedMessage[] = [];
  let current: AggregatedMessage | null = null;

  for (const event of events) {
    const role = getEventRole(event);
    const runId = getRunId(event);
    const shouldStartNewMessage =
      !current ||
      current.role !== role ||
      (runId && current.runId && runId !== current.runId);

    if (shouldStartNewMessage) {
      current = {
        role,
        runId,
        content: [],
      };
      messages.push(current);
    }

    if (!current) {
      continue;
    }

    current.content.push(event);
    if (!current.runId && runId) {
      current.runId = runId;
    }
  }

  return messages;
};

interface SendOptions {
  sessionId?: string;
}

interface UseStudioMelonyOptions {
  url?: string;
}

export const useStudioMelony = ({ url = 'http://localhost:7777' }: UseStudioMelonyOptions = {}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreaming(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setEvents([]);
  }, [stop]);

  const send = useCallback(
    async (event: any, options?: SendOptions) => {
      stop();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const optimisticEvent: any = {
        id: generateId(),
        ...event,
      };

      setStreaming(true);
      setEvents(prev => [...prev, optimisticEvent]);

      try {
        const runResponse = await fetch(`${url}/runs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: optimisticEvent,
            ...options,
          }),
          signal: abortController.signal,
        });

        if (!runResponse.ok) {
          throw new Error(`HTTP error! status: ${runResponse.status}`);
        }

        const runData = (await runResponse.json()) as { runId?: string; threadId?: string };
        const streamUrl = new URL(`${url}/stream`);
        if (runData.runId) streamUrl.searchParams.set('runId', runData.runId);
        if (runData.threadId) streamUrl.searchParams.set('threadId', runData.threadId);

        const streamResponse = await fetch(streamUrl.toString(), {
          headers: {
            Accept: 'text/event-stream',
          },
          signal: abortController.signal,
        });

        if (!streamResponse.ok) {
          throw new Error(`HTTP error! status: ${streamResponse.status}`);
        }

        if (!streamResponse.body) {
          throw new Error('No response body');
        }

        const reader = streamResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            try {
              const incomingEvent = JSON.parse(line.slice(6));
              setEvents(prev => {
                const index = incomingEvent.id
                  ? prev.findIndex(existing => existing.id === incomingEvent.id)
                  : -1;

                if (index === -1) {
                  return [...prev, incomingEvent];
                }

                const next = [...prev];
                next[index] = incomingEvent;
                return next;
              });

              if (incomingEvent.type === 'run:status') {
                const status = incomingEvent.data?.status;
                if (status === 'completed' || status === 'failed') {
                  setStreaming(false);
                  return;
                }
              }
            } catch (error) {
              console.error('Failed to parse event', error);
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        throw error;
      } finally {
        setStreaming(false);
      }
    },
    [stop, url]
  );

  const messages = useMemo(() => convertEventsToAggregatedMessages(events), [events]);

  return {
    send,
    reset,
    stop,
    streaming,
    messages,
    events,
  };
};
