# @melony/client

Framework-agnostic client for Melony. Core logic that works with any UI framework.

## Installation

```bash
npm install @melony/client
```

## Overview

Provides the foundation for building Melony applications in any framework:

- **Widget System**: Define and register reusable UI widgets
- **Template Engine**: Handlebars-style templating with array support
- **Parser**: Parse HTML-like templates into component trees
- **Transport**: HTTP and custom transport for runtime communication
- **Runtime Client**: Client for streaming events from runtime

## Usage

### Widgets

```typescript
import { defineWidget } from "@melony/client";

const weatherWidget = defineWidget({
  tag: "weather",
  template: `
    <card title="Weather in {{city}}">
      <text value="{{temperature}}°F" />
    </card>
  `,
});
```

### Runtime Client

```typescript
import { MelonyRuntimeClient, createHttpTransport } from "@melony/client";

const client = new MelonyRuntimeClient({
  transport: createHttpTransport("/api/chat"),
});

for await (const event of client.sendMessage({
  role: "user",
  content: [{ type: "text", data: { content: "Hello" } }],
})) {
  console.log(event);
}
```

### Template & Parser

```typescript
import { renderTemplate, parseContent } from "@melony/client";

const html = renderTemplate("<text value=\"{{name}}\" />", { name: "John" });
const blocks = parseContent(html);
```

## API

- **`defineWidget(widget)`** - Define a widget
- **`WidgetRegistry`** - Register and manage widgets
- **`MelonyRuntimeClient`** - Client for runtime communication
- **`createHttpTransport(api)`** - Create HTTP transport
- **`renderTemplate(template, data)`** - Render template with data
- **`parseContent(html)`** - Parse HTML into component blocks

## Development

```bash
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
pnpm clean      # Clean dist
```
