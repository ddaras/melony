import { Event, RuntimeContext } from "melony";

/**
 * A message aggregated from multiple events.
 */
export interface AggregatedMessage {
  /** The role of the sender (user, assistant, or system) */
  role: string;
  /** The text content of the message, aggregated from text events */
  content: string;
  /** The unique ID for the run that produced this message */
  runId?: string;
  /** The ID of the thread this message belongs to */
  threadId?: string;
  /** UI events (e.g. SDUI components) associated with this message */
  uiEvents: Event[];
}

/**
 * Options for configuring how events are aggregated into messages.
 */
export interface AggregateOptions<TEvent extends Event = Event> {
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
   * Custom logic to extract the threadId from an event.
   * Defaults to event.meta.threadId.
   */
  getThreadId?: (event: TEvent) => string | undefined;

  /**
   * Custom logic to determine if a new message should be started.
   * By default, starts a new message if:
   * 1. There is no current message.
   * 2. The role of the event is different from the current message.
   * 3. The runId of the event is different from the current message's runId.
   */
  shouldStartNewMessage?: (
    event: TEvent,
    currentMessage: AggregatedMessage | null,
    options: { getRole: (e: TEvent) => string; getRunId: (e: TEvent) => string | undefined }
  ) => boolean;

  /**
   * Custom logic to process an event and update the current message.
   * By default:
   * - 'text-delta' events append their delta to the message content.
   * - 'text' events append their content or text to the message content.
   * - All other events are added to the message's uiEvents array.
   */
  processEvent?: (
    event: TEvent,
    currentMessage: AggregatedMessage,
  ) => void;
}

/**
 * Default implementation for extracting role from an event.
 */
export const defaultGetRole = <T extends Event>(e: T): string => e.type === "user:text" ? "user" : "assistant";

/**
 * Default implementation for extracting runId from an event.
 */
export const defaultGetRunId = <T extends Event>(e: T, context?: RuntimeContext<any, T>): string | undefined => {
  return context?.runId;
};

/**
 * Default implementation for extracting threadId from an event.
 */
export const defaultGetThreadId = <T extends Event>(e: T): string | undefined => e.data?.threadId;

/**
 * Default logic for determining if a new message should start.
 */
export const defaultShouldStartNewMessage = <T extends Event>(
  event: T,
  current: AggregatedMessage | null,
  utils: { getRole: (e: T) => string; getRunId: (e: T) => string | undefined; getThreadId: (e: T) => string | undefined }
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
export const defaultProcessEvent = <T extends Event>(event: T, current: AggregatedMessage): void => {
  if (event.type === "assistant:text-delta" && (event.data as any)?.delta) {
    current.content += (event.data as any).delta;
  } else if (event.type === "user:text") {
    current.content += (event.data as any)?.content || (event.data as any)?.text || "";
  } else {
    current.uiEvents.push(event);
  }
};

/**
 * Helper to aggregate a list of events into a list of messages.
 * This is useful for rendering a chat-like interface from a raw event stream.
 * 
 * @param events The list of events to aggregate.
 * @param options Configuration for aggregation logic.
 * @returns An array of aggregated messages.
 */
export function convertEventsToAggregatedMessages<TEvent extends Event = Event>(
  events: TEvent[],
  options: AggregateOptions<TEvent> = {}
): AggregatedMessage[] {
  const getRole = options.getRole || defaultGetRole;
  const getRunId = options.getRunId || defaultGetRunId;
  const getThreadId = options.getThreadId || defaultGetThreadId;
  const shouldStartNewMessage = options.shouldStartNewMessage || defaultShouldStartNewMessage;
  const processEvent = options.processEvent || defaultProcessEvent;

  if (events.length === 0) return [];

  const messages: AggregatedMessage[] = [];
  let currentMessage: AggregatedMessage | null = null;

  for (const event of events) {
    if (shouldStartNewMessage(event, currentMessage, { getRole, getRunId, getThreadId })) {
      currentMessage = {
        role: getRole(event),
        content: "",
        runId: getRunId(event),
        threadId: getThreadId(event),
        uiEvents: [],
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

      // If current message didn't have a threadId but this event does, update it
      if (!currentMessage.threadId) {
        const threadId = getThreadId(event);
        if (threadId) {
          currentMessage.threadId = threadId;
        }
      }
    }
  }

  return messages;
}
