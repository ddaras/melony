import { Plugin } from "./types";


/**
 * Helper to define a plugin.
 */
export const plugin = <TState = any>(config: Plugin<TState>): Plugin<TState> =>
    config;
