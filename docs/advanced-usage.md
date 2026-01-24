# Advanced Usage

Go beyond the basics with persistence, human-in-the-loop workflows, and complex orchestration.

## Human-in-the-Loop (HITL)

Melony makes it easy to pause agent execution and wait for human approval before proceeding with sensitive operations (like making a payment or sending an email).

You can implement this by intercepting an event and calling `context.suspend()`.

```typescript
const agent = melony()
  .on("place-order", async function* (event, context) {
    if (!event.meta?.approved) {
      // Suspend the execution and yield an approval request
      context.suspend({
        type: "approval-required",
        data: {
          operation: "place-order",
          params: event.data
        }
      });
      return;
    }

    // Logic for placing the order goes here...
    yield { type: "assistant:text", data: { content: "Order placed successfully!" } };
  });
```

When an operation requires approval:
1. The handler calls `context.suspend()`.
2. Melony **stops** the execution and yields the provided event.
3. The runtime waits for a new event from the client (e.g., the user clicking "Approve").
4. Once approved (detected by `meta.approved` in this example), the handler can proceed.

## Persistence

By default, Melony runtimes are stateless. To build long-running agents, use an event handler to persist events to your database.

```typescript
const agent = melony()
  .on("*", async function* (event, context) {
    // Log all events to a database
    await db.events.create({ 
      ...event, 
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
import { useMelony } from "@melony/react";

function Chat() {
  const { messages } = useMelony();

  return (
    <div>
      {messages.map(message => (
        <div key={message.runId}>
          {message.content.map(event => {
            if (event.type === "show-chart") {
              return <MyChart key={event.id} type={event.data.chartType} points={event.data.points} />;
            }
            if (event.type === "assistant:text-delta") {
              return <span key={event.id}>{event.data.delta}</span>;
            }
          })}
        </div>
      ))}
    </div>
  );
}
```

## Recursive Orchestration

When a handler yields an event, it is automatically passed back through the runtime's handlers. This allows for powerful, recursive behaviors.

```typescript
const agent = melony()
  .on("research", async function* (event, { runtime }) {
    yield { type: "assistant:text", data: { content: "Researching..." } };
    const data = await myInternalSearch(event.data.query);

    yield { type: "assistant:text", data: { content: "Synthesizing results..." } };
    yield { type: "summarize", data: { text: data } };
  })
  .on("summarize", async function* (event) {
    const summary = await summarize(event.data.text);
    yield { type: "assistant:text", data: { content: summary } };
  });
```
