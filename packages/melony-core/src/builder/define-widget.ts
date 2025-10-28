/**
 * Widget Definition API
 * Main API for defining type-safe widgets with schemas
 */

import { z } from "zod";
import { WidgetDefinition, CompiledWidget } from "./types";
import { WidgetPropSchema } from "../widget-template";

/**
 * Define a widget with a template string and schema
 */
export function defineWidget<TSchema extends z.ZodType>(
  definition: WidgetDefinition<TSchema>
): CompiledWidget {
  const { type, name, description, schema, template, examples, defaultProps } =
    definition;

  // Generate props schema from Zod schema
  const props = zodSchemaToProps(schema);

  // Generate AI prompt
  const prompt = zodSchemaToPrompt({
    type,
    schema,
    description: description || name || `${type} widget`,
    examples: examples || [],
  });

  // Create the compiled widget
  const compiledWidget: CompiledWidget = {
    type,
    name: name || type,
    description,
    template,
    props,
    defaultProps,
    prompt,
  };

  return compiledWidget;
}


/**
 * Convert Zod schema to widget prop schema
 */
function zodSchemaToProps(schema: z.ZodType): WidgetPropSchema[] {
  const props: WidgetPropSchema[] = [];

  // Handle ZodObject
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;

    for (const [key, value] of Object.entries(shape)) {
      const zodType = value as z.ZodType;
      const propSchema = zodTypeToPropSchema(key, zodType);
      if (propSchema) {
        props.push(propSchema);
      }
    }
  }

  return props;
}

/**
 * Convert individual Zod type to prop schema
 */
function zodTypeToPropSchema(
  name: string,
  zodType: z.ZodType
): WidgetPropSchema | null {
  // Unwrap optional and default types
  let actualType = zodType;
  let isOptional = false;
  let defaultValue: any = undefined;

  if (actualType instanceof z.ZodOptional) {
    isOptional = true;
    actualType = actualType._def.innerType as z.ZodType;
  }

  if (actualType instanceof z.ZodDefault) {
    isOptional = true;
    defaultValue = (actualType._def as any).defaultValue();
    actualType = (actualType._def as any).innerType as z.ZodType;
  }

  // Determine the type
  let type: WidgetPropSchema["type"] = "string";
  let description: string | undefined;

  if (actualType instanceof z.ZodString) {
    type = "string";
    description = actualType.description;
  } else if (actualType instanceof z.ZodNumber) {
    type = "number";
    description = actualType.description;
  } else if (actualType instanceof z.ZodBoolean) {
    type = "boolean";
    description = actualType.description;
  } else if (actualType instanceof z.ZodArray) {
    type = "array";
    description = actualType.description;
  } else if (actualType instanceof z.ZodEnum) {
    type = "string";
    description = `One of: ${actualType.options.join(", ")}`;
  } else if (actualType instanceof z.ZodLiteral) {
    // Skip literal types (like type: "weather-card")
    return null;
  }

  return {
    name,
    type,
    required: !isOptional,
    description,
    default: defaultValue,
  };
}

/**
 * Generate AI prompt from Zod schema
 */
export interface PromptConfig<TSchema extends z.ZodType = z.ZodType> {
  type: string;
  schema: TSchema;
  description: string;
  examples?: z.infer<TSchema>[];
}

export function zodSchemaToPrompt<TSchema extends z.ZodType>(
  config: PromptConfig<TSchema>
): string {
  const { type, schema, description, examples = [] } = config;

  // Generate props documentation from schema
  const props = zodSchemaToProps(schema);
  const propsTable = generatePropsTable(props);

  // Generate example usage
  const examplesSection =
    examples.length > 0 ? generateExamplesSection(type, examples) : "";

  return `### ${type} Widget

**Description:** ${description}

**Props:**
${propsTable}

${examplesSection}

**Usage:**
\`\`\`
<widget type="${type}" ${props
    .filter((p) => p.required)
    .map((p) => `${p.name}="..."`)
    .join(" ")} />
\`\`\`
`;
}

/**
 * Generate props table for documentation
 */
function generatePropsTable(props: WidgetPropSchema[]): string {
  if (props.length === 0) {
    return "No props";
  }

  const rows = props.map((prop) => {
    const required = prop.required ? "✓" : "";
    const defaultVal =
      prop.default !== undefined ? `\`${JSON.stringify(prop.default)}\`` : "";
    const desc = prop.description || "";

    return `| \`${prop.name}\` | \`${prop.type}\` | ${required} | ${defaultVal} | ${desc} |`;
  });

  return `| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
${rows.join("\n")}`;
}

/**
 * Generate examples section
 */
function generateExamplesSection(type: string, examples: any[]): string {
  const exampleBlocks = examples.map((example, index) => {
    const propsString = Object.entries(example)
      .filter(([key]) => key !== "type")
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}="${value}"`;
        } else if (typeof value === "object") {
          return `${key}='${JSON.stringify(value)}'`;
        }
        return `${key}="${value}"`;
      })
      .join(" ");

    return `**Example ${index + 1}:**
\`\`\`
<widget type="${type}" ${propsString} />
\`\`\``;
  });

  return `**Examples:**

${exampleBlocks.join("\n\n")}`;
}

/**
 * Batch compile multiple widgets
 */
export function compileWidgets(
  definitions: WidgetDefinition[]
): CompiledWidget[] {
  return definitions.map(defineWidget);
}

/**
 * Generate complete widget prompt for all widgets
 */
export function generateWidgetSystemPrompt(widgets: CompiledWidget[]): string {
  if (widgets.length === 0) {
    return "";
  }

  const widgetPrompts = widgets.map((w) => w.prompt).join("\n\n");

  return `## Custom Widgets

The following custom widgets are available for use:

${widgetPrompts}

**Note:** Use the \`<widget>\` component with the \`type\` attribute to render these custom widgets.
`;
}
