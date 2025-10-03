export const CUSTOM_COMPONENT_PROMPT = `To use custom components, define them in the components prop and reference them by type:
{
  "type": "your-custom-type",
  "customProp1": "value1",
  "customProp2": "value2",
  ...
}

Custom components allow you to:
- Extend the default component library
- Create domain-specific visualizations
- Implement custom business logic
- Override built-in component rendering

Pass your custom component renderers to the MelonyCard components prop:
<MelonyCard 
  text={text} 
  components={{
    "your-custom-type": YourCustomComponent,
    "another-type": AnotherComponent
  }}
/>

Each custom component will receive all properties from the JSON object as React props.`;

/**
 * Helper to get a specific component prompt
 */
export const getComponentPrompt = (componentType: "custom"): string => {
  const prompts = {
    custom: CUSTOM_COMPONENT_PROMPT,
  };
  return prompts[componentType];
};

/**
 * Helper to get multiple component prompts
 */
export const getComponentPrompts = (
  componentTypes: Array<"custom">
): string => {
  return componentTypes
    .map(
      (type, index) =>
        `${index + 1}. ${type.toUpperCase()} Component:\n${getComponentPrompt(
          type
        )}`
    )
    .join("\n\n");
};

/**
 * TypeScript type definitions for component data structures
 * (can be used for type-safe prompt generation)
 */
export interface ComponentPromptConfig {
  overview?: boolean;
  details?: boolean;
  chart?: boolean;
  form?: boolean;
  list?: boolean;
  card?: boolean;
  custom?: boolean;
}

/**
 * Generate a custom prompt based on enabled components
 */
export const generateCustomPrompt = (config: ComponentPromptConfig): string => {
  const enabledComponents = Object.entries(config)
    .filter(([_, enabled]) => enabled)
    .map(([type]) => type as "custom");

  if (enabledComponents.length === 0) {
    return "";
  }

  return `You can use the following JSON components in your responses:\n\n${getComponentPrompts(
    enabledComponents
  )}`;
};
