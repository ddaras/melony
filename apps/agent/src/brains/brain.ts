import { Event } from "@melony/core";

export const brain = async function* (event: Event) {
  if (event.role === "user" && event.type === "text") {
    const text = event.data?.content;

    if (text?.toLowerCase().includes("weather")) {
      return {
        action: "checkWeather",
        params: { location: "San Francisco" },
      };
    }

    yield {
      type: "text-delta",
      data: {
        delta: "Hello! I am your Melony assistant. Ask me about the weather!",
      },
    };
    return;
  }

  if (event.type === "action-result") {
    if (event.data?.action === "checkWeather") {
      yield {
        type: "text-delta",
        data: {
          delta: `The weather in ${event.data.params.location} is looking great! (Received: ${JSON.stringify(event.data.result)})`,
        },
      };
      return;
    }
  }
};
