import { MelonyPlugin, Event } from "melony";

export interface PersistenceAdapter {
  /**
   * Saves an event to the persistent store.
   */
  saveEvent: (runId: string, event: Event) => Promise<void>;
  
  /**
   * Retrieves the history of events for a given runId.
   */
  getHistory: (runId: string) => Promise<Event[]>;
}

export interface PersistencePluginOptions {
  adapter: PersistenceAdapter;
  /**
   * Optional filter to decide which events to persist.
   * By default, all events are persisted.
   */
  filter?: (event: Event) => boolean;
}

/**
 * Persistence Plugin for Melony.
 * Automatically saves every event that flows through the system to a persistent store.
 */
export const persistencePlugin = (options: PersistencePluginOptions): MelonyPlugin<any, any> => (builder) => {
  const { adapter, filter = () => true } = options;

  // Listen to all events using the "*" wildcard
  builder.on("*", async function* (event, context) {
    const runId = context.runId;
    
    if (runId && filter(event)) {
      try {
        await adapter.saveEvent(runId, event);
      } catch (error) {
        console.error(`[PersistencePlugin] Failed to save event ${event.type} for run ${runId}:`, error);
      }
    }
  });
};
