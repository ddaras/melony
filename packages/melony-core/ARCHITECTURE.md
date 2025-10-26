# Melony Architecture

This document explains the separation of concerns between Markdown and Widget components in Melony.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Melony Core                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐           ┌──────────────────┐       │
│  │  MelonyMarkdown  │           │   MelonyWidget   │       │
│  │                  │           │                  │       │
│  │  • Markdown text │           │  • Widget only   │       │
│  │  • Embedded      │           │  • No markdown   │       │
│  │    widgets       │           │  • Pure UI       │       │
│  └────────┬─────────┘           └────────┬─────────┘       │
│           │                              │                 │
│           └──────────────┬───────────────┘                 │
│                          │                                 │
│              ┌───────────▼──────────┐                      │
│              │   MelonyParser       │                      │
│              │                      │                      │
│              │ Parses HTML-like     │                      │
│              │ widget tags into     │                      │
│              │ ComponentDef         │                      │
│              └───────────┬──────────┘                      │
│                          │                                 │
│              ┌───────────▼──────────┐                      │
│              │   Widget Renderer    │                      │
│              │                      │                      │
│              │ Renders ComponentDef │                      │
│              │ into React elements  │                      │
│              └───────────┬──────────┘                      │
│                          │                                 │
│              ┌───────────▼──────────┐                      │
│              │  Melony Components   │                      │
│              │                      │                      │
│              │ Card, Button, Text,  │                      │
│              │ Input, Chart, etc.   │                      │
│              └──────────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### MelonyMarkdown
**Purpose**: Render markdown content with optional embedded widgets

**Input**: String containing markdown and/or widget tags
```tsx
<MelonyMarkdown>
  {`
    # Hello World
    
    This is markdown text with a widget:
    
    <card title="Weather">
      <text value="72°F" />
    </card>
  `}
</MelonyMarkdown>
```

**Responsibilities**:
- Parse content into blocks (markdown strings and widget ComponentDef)
- Render markdown blocks using ReactMarkdown
- Delegate widget blocks to MelonyWidget
- Manage shared context (theme, actions, widgets, user context)

### MelonyWidget
**Purpose**: Render widget components only (no markdown)

**Input**: String with widget tags OR ComponentDef object
```tsx
// String input
<MelonyWidget>
  {"<card title='Hello'><text value='World' /></card>"}
</MelonyWidget>

// ComponentDef input
<MelonyWidget>
  {{
    component: "Card",
    props: { title: "Hello" },
    children: [{ component: "Text", props: { value: "World" } }]
  }}
</MelonyWidget>
```

**Responsibilities**:
- Parse widget tags (if string) into ComponentDef
- Render ComponentDef using the widget renderer
- Filter out any non-widget content (text-only blocks)
- Manage widget-specific context

### MelonyParser
**Purpose**: Parse HTML-like widget tags into structured ComponentDef objects

**Input**: String containing widget tags
```tsx
"<card title='Hello'><text value='World' /></card>"
```

**Output**: Array of strings and ComponentDef objects
```tsx
[
  {
    component: "Card",
    props: { title: "Hello" },
    children: [
      { component: "Text", props: { value: "World" } }
    ]
  }
]
```

**Responsibilities**:
- Parse HTML-like tags using node-html-parser
- Convert attributes to typed props
- Handle nested children recursively
- Support both complete and streaming/incomplete tags
- Register custom component tags

### Widget Renderer
**Purpose**: Convert ComponentDef objects into React elements

**Input**: ComponentDef object
```tsx
{
  component: "Card",
  props: { title: "Hello" },
  children: [
    { component: "Text", props: { value: "World" } }
  ]
}
```

**Output**: React element
```tsx
<Card title="Hello">
  <Text value="World" />
</Card>
```

**Responsibilities**:
- Look up components from the Melony component registry
- Recursively render children
- Pass props and children to React components
- Handle unknown components gracefully

## Data Flow

### MelonyMarkdown Flow
```
User Content String
      ↓
MelonyParser.parseContentAsBlocks()
      ↓
[string, ComponentDef, string, ComponentDef, ...]
      ↓
For each block:
  • If string → ReactMarkdown → HTML
  • If ComponentDef → MelonyWidget → React Components
```

### MelonyWidget Flow
```
Widget String or ComponentDef
      ↓
If string:
  MelonyParser.parseContentAsBlocks()
      ↓
  Filter to ComponentDef only
      ↓
renderComponent(componentDef)
      ↓
React Components
```

## Key Design Decisions

### 1. Separation of Concerns
- **MelonyMarkdown**: Handles markdown + widgets (mixed content)
- **MelonyWidget**: Handles widgets only (pure UI)
- Clear separation makes the code easier to understand and maintain

### 2. Reusable Parser
- Both MelonyMarkdown and MelonyWidget use the same parser
- Parser can be customized and extended
- Consistent parsing behavior across use cases

### 3. Dedicated Renderer
- Widget rendering logic is centralized in `renderer.tsx`
- Not tied to markdown or any specific component
- Can be used independently for advanced use cases

### 4. Nested Context
- Theme, actions, widgets, and user context are provided at the top level
- Inner MelonyWidget instances inherit context from parent
- Avoids duplicate context providers

## Usage Examples

### Use Case 1: AI Chat with Mixed Content
Best component: **MelonyMarkdown**
```tsx
<MelonyMarkdown onAction={handleAction} widgets={customWidgets}>
  {aiStreamedResponse}
</MelonyMarkdown>
```

### Use Case 2: Render Pure Widget UI
Best component: **MelonyWidget**
```tsx
<MelonyWidget onAction={handleAction}>
  {widgetDefinition}
</MelonyWidget>
```

### Use Case 3: Dynamic Widget Generation
Best component: **MelonyWidget** with ComponentDef
```tsx
const widgetDef: ComponentDef = {
  component: "Card",
  props: { title: data.title },
  children: data.items.map(item => ({
    component: "Text",
    props: { value: item.text }
  }))
};

<MelonyWidget>{widgetDef}</MelonyWidget>
```

### Use Case 4: Custom Parser
Both components support custom parsers
```tsx
const customParser = new MelonyParser();
customParser.registerComponent("mywidget", "MyWidget");

<MelonyMarkdown parser={customParser}>
  {content}
</MelonyMarkdown>
```

## Extending the System

### Add New Components
1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Register tag name in `MelonyParser` (if using lowercase tags)

### Add Widget Templates
```tsx
const template: WidgetTemplate = {
  type: "weather",
  name: "Weather Widget",
  template: "<card title='Weather'>...</card>",
  props: [...]
};

<MelonyMarkdown widgets={[template]}>
  {content}
</MelonyMarkdown>
```

### Custom Rendering
For advanced use cases, use the renderer directly:
```tsx
import { renderComponent, ComponentDef } from "melony";

const component: ComponentDef = {...};
const reactElement = renderComponent(component);
```

