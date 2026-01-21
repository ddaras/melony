# Advanced Usage

Go beyond the basics with persistence, human-in-the-loop workflows, and complex orchestration.

## Human-in-the-Loop (HITL)

Melony makes it easy to pause agent execution and wait for human approval before proceeding with sensitive actions (like making a payment or sending an email).

You can implement this by adding an event handler for `action:before`.

```typescript
const agent = melony()
  .action(placeOrder)
  .on("action:before", async function* (event, context) {
    if (event.data.action === "placeOrder" && !event.meta?.approved) {
      // Suspend the execution and yield an approval UI
      context.suspend({
        type: "ui",
        data: {
          type: "card",
          title: "Approval Required",
          children: [
            { type: "text", value: "Do you want to place this order?" },
            { 
              type: "button", 
              label: "Approve", 
              onClickAction: { 
                type: "call-action", 
                data: { action: "placeOrder", params: event.data.params },
                meta: { approved: true } 
              } 
            }
          ]
        }
      });
    }
  })
  .build();
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
  })
  .build();
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

Since actions are generators, you can yield events and then chain to other actions using `context.runtime.execute()`.

```typescript
execute: async function* ({ query }, { runtime }) {
  yield { type: "text", data: { content: "Researching..." } };
  const data = await myInternalSearch(query);

  yield { type: "text", data: { content: "Synthesizing results..." } };

  yield* runtime.execute("summarize", { data });
}
```

## LLM Routing

A common pattern is to use an LLM to decide which action to call. Implement this as an event handler:

```typescript
const agent = melony()
  .on("text", async function* (event, { runtime, actions }) {
    if (event.role === "user") {
      const toolCall = await callLLM(event.data.content, Object.keys(actions));
      if (toolCall) {
        yield* runtime.execute(toolCall.name, toolCall.params);
      }
    }
  })
  .build();
```
