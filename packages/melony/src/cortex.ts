import { Brain, Event, RuntimeContext } from "./types";

/**
 * A Cortex is a collection of Brain Regions (Lobes).
 * It delegates events to the appropriate region and coordinates the agentic loop.
 */
export function cortex<TState = any>(
  regions: Record<string, Brain<TState>>,
): Brain<TState> {
  return async function* (event: Event, context: RuntimeContext<TState>) {
    // We iterate through all regions sequentially.
    for (const [name, region] of Object.entries(regions)) {
      const generator = region(event, context);

      while (true) {
        const { value, done } = await generator.next();

        if (done) {
          // If a region returns a NextAction, that region has "taken control"
          // of the executive function. We return it to the runtime.
          if (value) return value;
          break;
        }

        // Yield events from the region (text, UI, etc.)
        // We tag them with the region name in metadata.
        yield {
          ...value,
          metadata: { ...value.metadata, region: name },
        };
      }
    }

    // If no region returns a NextAction, the brain is "resting."
    return;
  };
}

/**
 * Helper to define a lobe with full type inference.
 * Lobes are just Brain functions but named for clarity in the biological theme.
 */
export const lobe = <TState = any>(brain: Brain<TState>): Brain<TState> => brain;
