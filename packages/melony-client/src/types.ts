// Widget types
export interface WidgetDefinition {
  tag: string;
  template: string;
  description?: string;
  propsSchema?: any;
  [key: string]: any;
}
