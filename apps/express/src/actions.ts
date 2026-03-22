import { defineAction } from "@melony/actions";

export const weatherAction = defineAction({
    name: "get_weather",
    description: "Get the current weather for a location",
    parameters: {
        type: "object",
        properties: {
            location: { type: "string" }
        },
        required: ["location"]
    },
    run: ({ input }) => {
        return { temperature: 22, condition: "Sunny", location: input.location };
    }
});