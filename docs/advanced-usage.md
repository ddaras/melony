# Advanced Usage

Go beyond the basics with persistence, human-in-the-loop workflows, and complex orchestration.

## Human-in-the-Loop (HITL)

Melony makes it easy to pause agent execution and wait for human approval before proceeding with sensitive actions (like making a payment or sending an email).

You can implement this by adding an event handler for `action:before`.

```typescript
const agent = melony()
  .action("placeOrder", placeOrderAction)
  .on("action:before", async function* (event, context) {
    if (event.data.action === "placeOrder" && !event.meta?.approved) {
      // Suspend the execution and yield an approval request
      context.suspend({
        type: "approval-required",
        data: {
          action: "placeOrder",
          params: event.data.params
        }
      });
    }
  });
```

When an action requires approval:
1. The handler calls `context.suspend()`.
2. Melony **stops** the execution and yields the provided event.
3. The runtime waits for a new event from the client (e.g., the user clicking "Approve").
4. Once approved (detected by `meta.approved` in this example), the action can proceed.

## Persistence

By default, Melony runtimes are stateless. To build long-running agents, use an event handler to persist events.

```typescript
const agent = melony()
  .on("text", async function* (event, context) {
    // Log user messages to a database
    await db.messages.create({ 
      ...event.data, 
      runId: context.runId 
    });
  });
```

## Custom UI Events

Since Melony is unopinionated, you can define your own event types to trigger specific UI components on your frontend.

### Server-side

```typescript
yield {
  type: "show-chart",
  data: {
    chartType: "bar",
    points: [10, 20, 30],
  },
};
```

### Client-side (React)

```tsx
const { events } = useMelony();

return (
  <div>
    {events.map(event => {
      if (event.type === "show-chart") {
        return <MyChart key={event.meta?.id} type={event.data.chartType} points={event.data.points} />;
      }
      // ...
    })}
  </div>
);
```

## Multi-step Orchestration

Since actions are generators, you can yield events and then chain to other actions using `context.runtime.execute()`.

```typescript
export const researchAction = async function* ({ query }, { runtime }) {
  yield { type: "text", data: { content: "Researching..." } };
  const data = await myInternalSearch(query);

  yield { type: "text", data: { content: "Synthesizing results..." } };

  yield* runtime.execute("summarize", { data });
};
```

## LLM Routing

A common pattern is to use an LLM to decide which action to call. Implement this as an event handler:

```typescript
const agent = melony()
  .on("text", async function* (event, { runtime, actions }) {
    if (event.meta?.role === "user") {
      const toolCall = await callLLM(event.data.content, Object.keys(actions));
      if (toolCall) {
        yield* runtime.execute(toolCall.name, toolCall.params);
      }
    }
  });
```
