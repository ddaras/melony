import { WidgetDefinition } from "./types";

export class WidgetRegistry {
  private widgets: Map<string, WidgetDefinition> = new Map();

  /**
   * Register a widget
   */
  register(widget: WidgetDefinition): void {
    // Normalize tag to lowercase for case-insensitive lookup
    this.widgets.set(widget.tag.toLowerCase(), widget);
  }

  /**
   * Register multiple widgets
   */
  registerMany(widgets: WidgetDefinition[]): void {
    widgets.forEach((widget) => this.register(widget));
  }

  /**
   * Get a widget by tag name
   */
  get(tag: string): WidgetDefinition | undefined {
    return this.widgets.get(tag.toLowerCase());
  }

  /**
   * Get all widgets as a record
   */
  getAll(): Record<string, WidgetDefinition> {
    const record: Record<string, WidgetDefinition> = {};
    this.widgets.forEach((widget, tag) => {
      record[tag] = widget;
    });
    return record;
  }

  /**
   * Check if a widget exists
   */
  has(tag: string): boolean {
    return this.widgets.has(tag.toLowerCase());
  }

  /**
   * Remove a widget
   */
  remove(tag: string): boolean {
    return this.widgets.delete(tag.toLowerCase());
  }

  /**
   * Clear all widgets
   */
  clear(): void {
    this.widgets.clear();
  }

  /**
   * Get the number of registered widgets
   */
  get size(): number {
    return this.widgets.size;
  }
}

