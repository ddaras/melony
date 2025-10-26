/**
 * Schema definition for widget properties
 */
export interface WidgetPropSchema {
  name: string;
  type: "string" | "number" | "boolean" | "url" | "image" | "array";
  required?: boolean;
  description?: string;
  default?: any;
  schema?: WidgetPropSchema[]; // for array
}

/**
 * Widget Template Definition
 */
export interface WidgetTemplate {
  type: string;
  name: string;
  description?: string;
  template: string; // HTML-like template
  props?: WidgetPropSchema[];
  defaultProps?: Record<string, any>;
}

/**
 * Widget Template Processor
 * Handles expansion of widget templates with props
 */
export class WidgetTemplateProcessor {
  private templates: Map<string, WidgetTemplate> = new Map();

  /**
   * Register a widget template
   */
  registerTemplate(template: WidgetTemplate): void {
    this.templates.set(template.type, template);
  }

  /**
   * Get all registered widget types
   */
  getRegisteredWidgets(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Check if a widget type is registered
   */
  hasWidget(type: string): boolean {
    return this.templates.has(type);
  }
}
