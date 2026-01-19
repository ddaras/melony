import { Event } from "melony";
import { EventStorage } from "./types";

export interface CloudEventStorageConfig {
  /**
   * API key for authenticating with the cloud storage service.
   * This will be sent as the X-API-Key header.
   */
  apiKey: string;

  /**
   * Base URL of the cloud storage API endpoint
   * Example: "https://api.example.com/v1/events"
   */
  endpoint: string;

  /**
   * Optional: Additional headers to include in requests
   */
  headers?: Record<string, string>;
}

/**
 * Cloud-based event storage implementation
 * Stores events to an external API endpoint using an API key
 */
export class CloudEventStorage implements EventStorage {
  private config: CloudEventStorageConfig;

  constructor(config: CloudEventStorageConfig) {
    if (!config.apiKey) {
      throw new Error("API key is required for CloudEventStorage");
    }

    if (!config.endpoint) {
      throw new Error("Endpoint is required for CloudEventStorage");
    }

    this.config = config;
  }

  async store(event: Event, metadata?: Record<string, any>): Promise<void> {
    try {
      // Use a timeout to avoid hanging the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(this.config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.config.apiKey,
          ...this.config.headers,
        },
        body: JSON.stringify({
          ...event,
          ...metadata,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Just log a warning for non-2xx responses, don't throw
        console.warn(
          `[CloudEventStorage] Warning: Failed to store event (${response.status})`,
        );
      }
    } catch (error) {
      // Silently catch errors to avoid crashing the app
      // We log a minimal message instead of the full stack trace if it's a common network error
      if (error instanceof Error && error.name === "AbortError") {
        console.warn("[CloudEventStorage] Request timed out");
      } else {
        console.warn(
          "[CloudEventStorage] Failed to store event:",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }
  }
}
