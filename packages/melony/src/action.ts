import { z } from 'zod'
import { Action } from './types';

/**
 * Helper to define an action with full type inference.
 */
export const action = <T extends z.ZodSchema, TState = any>(
    config: Action<T, TState>,
): Action<T, TState> => config;
