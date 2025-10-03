import { z } from "zod";

/**
 * Configuration for generating a prompt from a Zod schema
 */
export interface ZodSchemaPromptConfig {
  /** The component type name (e.g., "product-card", "user-profile") */
  type: string;
  /** The Zod schema for this component */
  schema: z.ZodType<any>;
  /** Optional description of when to use this component */
  description?: string;
  /** Optional usage examples (will be parsed to ensure they're valid) */
  examples?: any[];
  /** Whether to include detailed field descriptions (default: true) */
  includeFieldDescriptions?: boolean;
  /** Optional custom instructions for the AI */
  customInstructions?: string;
}

/**
 * Generate a formatted prompt from a JSON schema
 */
function formatJsonSchemaPrompt(
  type: string,
  jsonSchema: any,
  description?: string,
  examples?: any[],
  customInstructions?: string
): string {
  let prompt = `To display a ${type}, use this JSON format:\n`;

  // Add a simplified example based on the schema
  const exampleJson =
    examples && examples.length > 0
      ? examples[0]
      : generateExampleFromSchema(jsonSchema, type);

  prompt += `${JSON.stringify(exampleJson, null, 2)}\n\n`;

  // Add JSON schema for AI understanding
  prompt += `JSON Schema:\n${JSON.stringify(jsonSchema, null, 2)}\n`;

  // Add description if provided
  if (description) {
    prompt += `\nUse the ${type} component for:\n${description}\n`;
  }

  // Add custom instructions
  if (customInstructions) {
    prompt += `\n${customInstructions}\n`;
  }

  // Add additional examples if provided
  if (examples && examples.length > 1) {
    prompt += `\nAdditional examples:\n`;
    examples.slice(1).forEach((example, index) => {
      prompt += `Example ${index + 2}:\n${JSON.stringify(
        example,
        null,
        2
      )}\n\n`;
    });
  }

  return prompt;
}

/**
 * Generate a simple example object from a JSON schema
 */
function generateExampleFromSchema(schema: any, typeName: string): any {
  const example: any = { type: typeName };

  if (schema.type === "object" && schema.properties) {
    Object.entries(schema.properties).forEach(([key, prop]: [string, any]) => {
      if (key === "type") return; // Skip the type field

      switch (prop.type) {
        case "string":
          example[key] = prop.description || `Example ${key}`;
          break;
        case "number":
        case "integer":
          example[key] = 42;
          break;
        case "boolean":
          example[key] = true;
          break;
        case "array":
          if (prop.items?.type === "object") {
            example[key] = [generateExampleFromSchema(prop.items, "")];
          } else if (prop.items?.type === "string") {
            example[key] = ["item1", "item2"];
          } else {
            example[key] = [];
          }
          break;
        case "object":
          example[key] = generateExampleFromSchema(prop, "");
          break;
        default:
          example[key] = null;
      }
    });
  }

  return example;
}

/**
 * Generate a prompt from a Zod schema
 */
export function zodSchemaToPrompt(config: ZodSchemaPromptConfig): string {
  const { type, schema, description, examples, customInstructions } = config;

  // Convert Zod schema to JSON schema
  const jsonSchema = z.toJSONSchema(schema);

  // Ensure type field is included in the schema
  if (jsonSchema.type === "object" && !jsonSchema.properties?.type) {
    jsonSchema.properties = {
      type: {
        type: "string",
        const: type,
        description: "Component type identifier",
      },
      ...jsonSchema.properties,
    };

    // Add type to required fields
    if (Array.isArray(jsonSchema.required)) {
      if (!jsonSchema.required.includes("type")) {
        jsonSchema.required.unshift("type");
      }
    } else {
      jsonSchema.required = ["type"];
    }
  }

  return formatJsonSchemaPrompt(
    type,
    jsonSchema,
    description,
    examples,
    customInstructions
  );
}

/**
 * Generate prompts for multiple Zod schemas
 */
export function zodSchemasToPrompt(configs: ZodSchemaPromptConfig[]): string {
  if (configs.length === 0) {
    return "";
  }

  let prompt =
    "You can use the following custom JSON components in your responses:\n\n";

  configs.forEach((config, index) => {
    prompt += `${index + 1}. ${config.type.toUpperCase()} Component:\n`;
    prompt += zodSchemaToPrompt(config);
    prompt += "\n";
  });

  return prompt;
}

/**
 * Create a type-safe component definition helper
 * This ensures the Zod schema matches the component's expected props
 */
export function defineComponentSchema<T extends z.ZodType<any>>(
  config: Omit<ZodSchemaPromptConfig, "schema"> & { schema: T }
): ZodSchemaPromptConfig & {
  schema: T;
  validate: (data: unknown) => z.infer<T>;
} {
  return {
    ...config,
    validate: (data: unknown) => config.schema.parse(data),
  };
}
