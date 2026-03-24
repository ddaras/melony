import { RuntimeContext } from "melony";

/**
 * A message aggregated from multiple events.
 */
export interface AggregatedMessage<TEvent = any> {
  /** The role of the sender (user, assistant, or system) */
  role: string;
  /** The content of the message, containing the events */
  content: TEvent[];
  /** The unique ID for the run that produced this message */
  runId?: string;
  /** The ID of the session this message belongs to */
  sessionId?: string;
}

/**
 * Options for configuring how events are aggregated into messages.
 */
export interface AggregateOptions<TEvent = any> {
  /**
   * Custom logic to extract the role from an event.
   * Defaults to event.meta.role or 'assistant'.
   */
  getRole?: (event: TEvent) => string;

  /**
   * Custom logic to extract the runId from an event.
   * Defaults to event.meta.runId.
   */
  getRunId?: (event: TEvent) => string | undefined;

  /**
   * Custom logic to extract the sessionId from an event.
   * Defaults to event.data.sessionId, with threadId fallback.
   */
  getSessionId?: (event: TEvent) => string | undefined;

  /**
   * Custom logic to determine if a new message should be started.
   * By default, starts a new message if:
   * 1. There is no current message.
   * 2. The role of the event is different from the current message.
   * 3. The runId of the event is different from the current message's runId.
   */
  shouldStartNewMessage?: (
    event: TEvent,
    currentMessage: AggregatedMessage<TEvent> | null,
    options: { getRole: (e: TEvent) => string; getRunId: (e: TEvent) => string | undefined }
  ) => boolean;

  /**
   * Custom logic to process an event and update the current message.
   * By default, events are simply added to the message's content array.
   */
  processEvent?: (
    event: TEvent,
    currentMessage: AggregatedMessage<TEvent>,
  ) => void;
}

/**
 * Default implementation for extracting role from an event.
 */
export const defaultGetRole = <T = any>(e: T): string => (e as any).type === "user:text" ? "user" : "assistant";

/**
 * Default implementation for extracting runId from an event.
 */
export const defaultGetRunId = <T = any>(e: T, context?: RuntimeContext<any, T>): string | undefined => {
  return context?.runId;
};

/**
 * Default implementation for extracting sessionId from an event.
 */
export const defaultGetSessionId = <T = any>(e: T): string | undefined => {
  return (e as any).data?.sessionId || (e as any).data?.threadId;
};

/**
 * Default logic for determining if a new message should start.
 */
export const defaultShouldStartNewMessage = <T = any>(
  event: T,
  current: AggregatedMessage<T> | null,
  utils: { getRole: (e: T) => string; getRunId: (e: T) => string | undefined; getSessionId: (e: T) => string | undefined }
): boolean => {
  if (!current) return true;
  const role = utils.getRole(event);
  const runId = utils.getRunId(event);
  
  // Start new message if role changes
  if (current.role !== role) return true;
  
  // Start new message if runId changes (and both have runIds)
  if (runId && current.runId && runId !== current.runId) return true;
  
  return false;
};

/**
 * Default logic for processing an event into a message.
 */
export const defaultProcessEvent = <T = any>(event: T, current: AggregatedMessage<T>): void => {
  current.content.push(event);
};

/**
 * Helper to aggregate a list of events into a list of messages.
 * This is useful for rendering a chat-like interface from a raw event stream.
 * 
 * @param events The list of events to aggregate.
 * @param options Configuration for aggregation logic.
 * @returns An array of aggregated messages.
 */
export function convertEventsToAggregatedMessages<TEvent = any>(
  events: TEvent[],
  options: AggregateOptions<TEvent> = {}
): AggregatedMessage<TEvent>[] {
  const getRole = options.getRole || defaultGetRole;
  const getRunId = options.getRunId || defaultGetRunId;
  const getSessionId = options.getSessionId || defaultGetSessionId;
  const shouldStartNewMessage = options.shouldStartNewMessage || defaultShouldStartNewMessage;
  const processEvent = options.processEvent || defaultProcessEvent;

  if (events.length === 0) return [];

  const messages: AggregatedMessage<TEvent>[] = [];
  let currentMessage: AggregatedMessage<TEvent> | null = null;

  for (const event of events) {
    if (shouldStartNewMessage(event, currentMessage, { getRole, getRunId, getSessionId })) {
      currentMessage = {
        role: getRole(event),
        content: [],
        runId: getRunId(event),
        sessionId: getSessionId(event),
      };
      messages.push(currentMessage);
    }

    if (currentMessage) {
      processEvent(event, currentMessage);
      
      // If current message didn't have a runId but this event does, update it
      if (!currentMessage.runId) {
        const runId = getRunId(event);
        if (runId) {
          currentMessage.runId = runId;
        }
      }

      // If current message didn't have a sessionId but this event does, update it
      if (!currentMessage.sessionId) {
        const sessionId = getSessionId(event);
        if (sessionId) {
          currentMessage.sessionId = sessionId;
        }
      }
    }
  }

  return messages;
}
