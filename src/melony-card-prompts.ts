/**
 * Component prompt definitions for AnswerCard
 * These can be injected into system prompts to guide AI responses
 */

export const OVERVIEW_PROMPT = `To display an overview, use this JSON format:
{
  "type": "overview",
  "title": "Overview Title",
  "description": "A brief description of the overview",
  "items": [
    { "label": "Item Label", "value": "Item Value" },
    { "label": "Another Label", "value": "Another Value" }
  ]
}

Use the overview component for:
- Summaries with key-value pairs
- Status reports
- Quick facts or statistics
- Profile information`;

export const DETAILS_PROMPT = `To display detailed information with sections, use this JSON format:
{
  "type": "details",
  "title": "Details Title",
  "sections": [
    { "heading": "Section Heading", "content": "Detailed content for this section" },
    { "heading": "Another Section", "content": "More detailed information" }
  ]
}

Use the details component for:
- Multi-section explanations
- Documentation or help content
- Step-by-step instructions
- Detailed breakdowns`;

export const CHART_PROMPT = `To display data as a chart, use this JSON format:
{
  "type": "chart",
  "title": "Chart Title",
  "chartType": "bar",
  "data": [
    { "label": "Category 1", "value": 100 },
    { "label": "Category 2", "value": 150 },
    { "label": "Category 3", "value": 75 }
  ]
}

Chart types: "bar", "line", "pie"

Use the chart component for:
- Numerical data visualization
- Comparisons between categories
- Trends and patterns
- Performance metrics`;

export const FORM_PROMPT = `To display a form, use this JSON format:
{
  "type": "form",
  "title": "Form Title",
  "fields": [
    { "name": "fieldName", "label": "Field Label", "type": "text", "required": true },
    { "name": "email", "label": "Email Address", "type": "email", "required": true },
    { "name": "age", "label": "Age", "type": "number", "required": false }
  ]
}

Field types: "text", "email", "password", "number", "date", "tel", etc.

Use the form component for:
- Data collection
- User input requests
- Registration or signup flows
- Settings or preferences`;

export const LIST_PROMPT = `To display a list, use this JSON format:
{
  "type": "list",
  "title": "List Title",
  "items": [
    "First item in the list",
    "Second item in the list",
    "Third item in the list"
  ]
}

Use the list component for:
- Bullet point lists
- Action items or tasks
- Features or benefits
- Sequential steps`;

export const CARD_PROMPT = `To display a card, use this JSON format:
{
  "type": "card",
  "title": "Card Title",
  "content": "Main content of the card goes here",
  "footer": "Optional footer text or metadata"
}

Use the card component for:
- Important announcements
- Highlighted information
- Call-to-action messages
- Standalone content blocks`;

export const CUSTOM_COMPONENT_PROMPT = `To use custom components, define them in the customComponents prop and reference them by type:
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

Pass your custom component renderers to the MelonyCard customComponents prop:
<MelonyCard 
  text={text} 
  customComponents={{
    "your-custom-type": YourCustomComponent,
    "another-type": AnotherComponent
  }}
/>

Each custom component will receive all properties from the JSON object as React props.`;

/**
 * Combined prompt with all component types
 */
export const ALL_COMPONENTS_PROMPT = `You can format your responses using structured JSON components. Available components:

1. OVERVIEW - For summaries and key-value information:
${OVERVIEW_PROMPT}

2. DETAILS - For multi-section detailed content:
${DETAILS_PROMPT}

3. CHART - For data visualization:
${CHART_PROMPT}

4. FORM - For collecting user input:
${FORM_PROMPT}

5. LIST - For bullet point lists:
${LIST_PROMPT}

6. CARD - For highlighted content blocks:
${CARD_PROMPT}

7. CUSTOM COMPONENTS - For custom component types:
${CUSTOM_COMPONENT_PROMPT}

You can embed these JSON structures within your text responses. The JSON will be automatically detected and rendered as the appropriate component.`;

/**
 * Minimal prompt for token-conscious use cases
 */
export const COMPACT_COMPONENTS_PROMPT = `Format responses with JSON components:
- overview: {type:"overview",title,description,items:[{label,value}]}
- details: {type:"details",title,sections:[{heading,content}]}
- chart: {type:"chart",title,chartType:"bar|line|pie",data:[{label,value}]}
- form: {type:"form",title,fields:[{name,label,type,required}]}
- list: {type:"list",title,items:[]}
- card: {type:"card",title,content,footer}`;

/**
 * Helper to get a specific component prompt
 */
export const getComponentPrompt = (componentType: 'overview' | 'details' | 'chart' | 'form' | 'list' | 'card' | 'custom'): string => {
  const prompts = {
    overview: OVERVIEW_PROMPT,
    details: DETAILS_PROMPT,
    chart: CHART_PROMPT,
    form: FORM_PROMPT,
    list: LIST_PROMPT,
    card: CARD_PROMPT,
    custom: CUSTOM_COMPONENT_PROMPT,
  };
  return prompts[componentType];
};

/**
 * Helper to get multiple component prompts
 */
export const getComponentPrompts = (componentTypes: Array<'overview' | 'details' | 'chart' | 'form' | 'list' | 'card' | 'custom'>): string => {
  return componentTypes.map((type, index) => 
    `${index + 1}. ${type.toUpperCase()} Component:\n${getComponentPrompt(type)}`
  ).join('\n\n');
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
    .map(([type]) => type as 'overview' | 'details' | 'chart' | 'form' | 'list' | 'card' | 'custom');

  if (enabledComponents.length === 0) {
    return '';
  }

  return `You can use the following JSON components in your responses:\n\n${getComponentPrompts(enabledComponents)}`;
};

