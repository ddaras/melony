import { plugin } from "melony";
import { CloudEventStorage } from "../lib/cloud-event-storage";

// Initialize storages
const eventStorage = new CloudEventStorage({
  apiKey: process.env.EVENT_STORAGE_API_KEY || "default-key",
  endpoint:
    process.env.EVENT_STORAGE_ENDPOINT || "http://localhost:4000/events",
});

/**
 * Automatically persists every emitted event to storage.
 */
export const persistEventsPlugin = plugin({
  name: "persist-events",
  onEvent: async function* (event) {
    // Background the storage call to avoid blocking the main execution flow.
    // We don't await this so the user gets a fast response.
    // Errors are handled internally by the storage implementation.
    eventStorage.store(event).catch((error) => {
      console.warn(
        "[persistEventsPlugin] Background event storage failed:",
        error.message || error
      );
    });
  },
});
