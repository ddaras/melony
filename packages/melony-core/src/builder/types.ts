import { z } from "zod";
import { WidgetTemplate } from "../widget-template";

/**
 * Widget definition with schema
 */
export interface WidgetDefinition<TSchema extends z.ZodType = z.ZodType> {
  type: string;
  name?: string;
  description?: string;
  schema: TSchema;
  template: string;
  examples?: z.infer<TSchema>[];
  defaultProps?: Partial<z.infer<TSchema>>;
}

/**
 * Compiled widget ready for use
 */
export interface CompiledWidget extends WidgetTemplate {
  prompt: string;
}
