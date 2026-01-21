# Advanced Usage

Go beyond the basics with persistence, human-in-the-loop workflows, and complex orchestration.

## Human-in-the-Loop (HITL)

Melony makes it easy to pause agent execution and wait for human approval before proceeding with sensitive actions (like making a payment or sending an email).

The `requireApproval` plugin handles this automatically using SDUI.

```typescript
import { MelonyRuntime } from "melony";
import { requireApproval } from "melony/plugins/require-approval";

const agent = new MelonyRuntime({
  actions: { sendEmail, placeOrder },
  plugins: [
    requireApproval({
      // Only require approval for these actions
      actions: ["sendEmail", "placeOrder"],
      // Optional: dynamic condition
      shouldApprove: (action, params) => params.amount > 100,
    }),
  ],
});
```

When an action requires approval:
1. Melony **suspends** the execution.
2. It yields a special event containing an **approval card** (SDUI).
3. The runtime waits for a new event from the client (e.g., the user clicking "Approve").
4. Once approved, Melony resumes the execution from where it left off.

## Persistence

By default, Melony runtimes are stateless. To build long-running agents, use the `onEvent` plugin hook to persist events.

```typescript
const agent = new MelonyRuntime({
  actions: { ... },
  plugins: [
    plugin({
      name: "persistence",
      onEvent: async function* (event, context) {
        await db.events.create({ ...event, threadId: context.state.threadId });
      },
    }),
  ],
});
```

## Custom UI Elements

While Melony ships with standard elements like `card` and `button`, you can define your own data structures for UI components and render them on the frontend.

### Server-side

```typescript
yield {
  type: "ui",
  data: {
    type: "my-custom-chart",
    props: {
      data: [10, 20, 30],
      labels: ["A", "B", "C"],
    },
  },
};
```

### Client-side (React)

```tsx
<MelonyProvider
  components={{
    "my-custom-chart": ({ data, labels }) => (
      <MyChartLib data={data} labels={labels} />
    ),
  }}
>
  ...
</MelonyProvider>
```

## Multi-step Orchestration

Since actions are generators, you can yield events and then chain to other actions using `return`.

```typescript
execute: async function* ({ query }) {
  yield { type: "text", data: { content: "Researching..." } };
  const data = await myInternalSearch(query);

  yield { type: "text", data: { content: "Synthesizing results..." } };

  return { action: "summarize", params: { data } };
}
```

## LLM Routing

A common pattern is to use an LLM to decide which action to call. Implement this as a plugin:

```typescript
const llmRouterPlugin = plugin({
  name: "llm-router",
  onBeforeRun: async function* ({ event }, context) {
    if (event.type === "text") {
      const toolCall = await callLLM(event.data.content, context.actions);
      if (toolCall) {
        return { action: toolCall.name, params: toolCall.params };
      }
    }
  },
});
```
