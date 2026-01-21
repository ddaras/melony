# Advanced Usage

Go beyond the basics with persistence, human-in-the-loop workflows, and complex orchestration.

## Human-in-the-Loop (HITL)

Melony makes it easy to pause agent execution and wait for human approval before proceeding with sensitive actions (like making a payment or sending an email).

The `requireApproval` plugin handles this automatically using SDUI.

```typescript
import { melony } from "melony";
import { requireApproval } from "melony/plugins/require-approval";

const assistant = melony({
  actions: { ... },
  plugins: [
    requireApproval({
      // Only require approval for these actions
      actions: ["sendEmail", "placeOrder"],
      // Optional: dynamic condition
      shouldApprove: (action, params) => params.amount > 100,
    })
  ]
});
```

When an action requires approval:
1. Melony **suspends** the execution.
2. It yields a special event containing an **approval card** (SDUI).
3. The runtime waits for a new event from the client (e.g., the user clicking "Approve").
4. Once approved, Melony resumes the execution from where it left off.

## Persistence

By default, Melony runtimes are stateless. To build long-running agents, you can use the `persistEvents` plugin (or write your own) to save the event history to a database.

```typescript
import { melony } from "melony";
import { persistPlugin } from "./my-persist-plugin";

const assistant = melony({
  actions: { ... },
  plugins: [
    persistPlugin({
      save: async (event, context) => {
        await db.events.create({ ...event, threadId: context.id });
      }
    })
  ]
});
```

## Custom UI Elements

While Melony ships with standard elements like `card` and `button`, you can define your own data structures for UI components and render them on the frontend.

### 1. Server-side
```typescript
yield {
  type: "ui",
  ui: {
    type: "my-custom-chart",
    props: {
      data: [10, 20, 30],
      labels: ["A", "B", "C"]
    }
  }
};
```

### 2. Client-side (React)
```tsx
<MelonyProvider 
  components={{
    "my-custom-chart": ({ data, labels }) => (
      <MyChartLib data={data} labels={labels} />
    )
  }}
>
  ...
</MelonyProvider>
```

## Multi-step Orchestration

Since actions are generators, you can yield events and then call other functions or wait for other data before returning a `NextAction`.

```typescript
execute: async function* ({ query }) {
  yield { type: "text", data: { content: "Researching..." } };
  const data = await myInternalSearch(query);
  
  yield { type: "text", data: { content: "Synthesizing results..." } };
  
  return {
    action: "summarize",
    params: { data }
  };
}
```
