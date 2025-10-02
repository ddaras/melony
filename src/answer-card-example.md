# AnswerCard Component Prompts - Usage Examples

## Basic Usage

Import the prompts into your AI system configuration:

```typescript
import { 
  ALL_COMPONENTS_PROMPT, 
  COMPACT_COMPONENTS_PROMPT,
  getComponentPrompt,
  generateCustomPrompt
} from 'melony';

// Use the full prompt with all components
const systemPrompt = `You are a helpful assistant.

${ALL_COMPONENTS_PROMPT}

Please format your responses appropriately based on the user's question.`;
```

## Individual Component Prompts

```typescript
import { 
  OVERVIEW_PROMPT,
  DETAILS_PROMPT,
  CHART_PROMPT,
  FORM_PROMPT,
  LIST_PROMPT,
  CARD_PROMPT
} from 'melony';

// Use only specific components
const systemPrompt = `You are a data analyst assistant.

${CHART_PROMPT}

${OVERVIEW_PROMPT}`;
```

## Dynamic Prompt Generation

```typescript
import { getComponentPrompts, generateCustomPrompt } from 'melony';

// Get specific components
const prompt1 = getComponentPrompts(['chart', 'overview']);

// Or use the config-based approach
const prompt2 = generateCustomPrompt({
  chart: true,
  overview: true,
  list: true,
  form: false,
  details: false,
  card: false
});
```

## Compact Version (Token-Efficient)

For token-conscious applications:

```typescript
import { COMPACT_COMPONENTS_PROMPT } from 'melony';

const systemPrompt = `Assistant that uses structured components.
${COMPACT_COMPONENTS_PROMPT}`;
```

## Real-World Example with OpenAI

```typescript
import OpenAI from 'openai';
import { ALL_COMPONENTS_PROMPT } from 'melony';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: `You are a helpful assistant that formats responses using structured components.
      
${ALL_COMPONENTS_PROMPT}

Choose the appropriate component based on what the user is asking for.`
    },
    {
      role: 'user',
      content: 'Show me sales data for Q1-Q4'
    }
  ]
});

// The AI will respond with chart JSON that AnswerCard can render
```

## Component Response Examples

### Overview Response
```
Here's the user profile:

{
  "type": "overview",
  "title": "User Profile",
  "description": "Active member since 2023",
  "items": [
    { "label": "Username", "value": "john_doe" },
    { "label": "Email", "value": "john@example.com" },
    { "label": "Role", "value": "Premium Member" }
  ]
}
```

### Chart Response
```
Here's the sales data you requested:

{
  "type": "chart",
  "title": "Quarterly Sales 2024",
  "chartType": "bar",
  "data": [
    { "label": "Q1", "value": 45000 },
    { "label": "Q2", "value": 52000 },
    { "label": "Q3", "value": 48000 },
    { "label": "Q4", "value": 61000 }
  ]
}
```

### Form Response
```
Please fill out this registration form:

{
  "type": "form",
  "title": "User Registration",
  "fields": [
    { "name": "fullName", "label": "Full Name", "type": "text", "required": true },
    { "name": "email", "label": "Email", "type": "email", "required": true },
    { "name": "phone", "label": "Phone Number", "type": "tel", "required": false }
  ]
}
```

## Rendering with AnswerCard

```tsx
import { AnswerCard } from 'melony';

function ChatMessage({ message }) {
  return <AnswerCard answer={message.content} />;
}
```

The AnswerCard component will automatically:
- Detect JSON structures in the response
- Parse partial/streaming JSON
- Render the appropriate component
- Fall back to markdown for plain text

