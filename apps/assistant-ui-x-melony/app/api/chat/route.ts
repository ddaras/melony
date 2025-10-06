import { chartCardUIComponentPrompt } from "@/components/cards/chart-card.schema";
import { weatherCardUIComponentPrompt } from "@/components/cards/weather-card.schema";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import z from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5-nano"),
    system: `You are a helpful assistant. You can use the following components to display information: \n\n\
    ${weatherCardUIComponentPrompt} \n\n\
    ${chartCardUIComponentPrompt} \n\n\
    `,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    tools: {
      getSalesData: tool({
        description: "Generate realistic sales data with trends and patterns",
        inputSchema: z.object({
          period: z.string().describe("The period to generate sales data for"),
          numberOfRecords: z
            .number()
            .describe("The number of records to generate"),
        }),
        execute: async ({ period, numberOfRecords }) => {
          const data = await new Promise((resolve) =>
            setTimeout(() => {
              // Generate more realistic sales data with trends
              const baseValue = 50000;
              const trend = 0.02; // 2% growth per period
              const seasonality = 0.1; // 10% seasonal variation

              const salesData = Array.from(
                { length: numberOfRecords },
                (_, index) => {
                  const date = new Date(
                    Date.now() + index * 24 * 60 * 60 * 1000,
                  );
                  const month = date.getMonth();
                  const seasonalFactor =
                    1 + seasonality * Math.sin((month / 12) * 2 * Math.PI);
                  const trendFactor = 1 + trend * index;
                  const randomFactor = 0.8 + Math.random() * 0.4; // ±20% random variation

                  const sales = Math.floor(
                    baseValue * trendFactor * seasonalFactor * randomFactor,
                  );

                  return {
                    id: index,
                    date,
                    sales,
                    region: ["North", "South", "East", "West"][index % 4],
                    product: ["Product A", "Product B", "Product C"][index % 3],
                  };
                },
              );

              resolve({
                period,
                numberOfRecords,
                data: salesData,
                totalSales: salesData.reduce(
                  (sum, item) => sum + item.sales,
                  0,
                ),
                averageSales: Math.floor(
                  salesData.reduce((sum, item) => sum + item.sales, 0) /
                    numberOfRecords,
                ),
              });
            }, 1000),
          );

          return data;
        },
      }),

      getWeatherData: tool({
        description: "Generate weather data for any location",
        inputSchema: z.object({
          location: z.string().describe("The location to get weather for"),
        }),
        execute: async ({ location }) => {
          const data = await new Promise((resolve) =>
            setTimeout(() => {
              // Generate realistic weather data based on location
              const conditions = [
                "Sunny",
                "Partly Cloudy",
                "Cloudy",
                "Rainy",
                "Snowy",
              ];
              const icons = ["sunny", "cloudy", "cloudy", "rainy", "snowy"];

              // Simulate different weather patterns based on location
              const isColdLocation =
                location.toLowerCase().includes("alaska") ||
                location.toLowerCase().includes("canada") ||
                location.toLowerCase().includes("russia");
              const isWarmLocation =
                location.toLowerCase().includes("florida") ||
                location.toLowerCase().includes("california") ||
                location.toLowerCase().includes("texas");

              let baseTemp = 70; // Default temperature
              if (isColdLocation) baseTemp = 30;
              if (isWarmLocation) baseTemp = 85;

              const tempVariation = Math.random() * 20 - 10; // ±10 degrees
              const temperature = Math.round(baseTemp + tempVariation);

              const conditionIndex = Math.floor(
                Math.random() * conditions.length,
              );
              const condition = conditions[conditionIndex];
              const icon = icons[conditionIndex];

              resolve({
                location,
                temperature,
                condition,
                humidity: Math.floor(Math.random() * 40 + 30), // 30-70%
                windSpeed: Math.floor(Math.random() * 15 + 5), // 5-20 mph
                description: `Current conditions in ${location}`,
                icon,
                feelsLike: Math.round(temperature + (Math.random() * 4 - 2)), // ±2 degrees
                uvIndex: Math.floor(Math.random() * 8 + 1), // 1-8
              });
            }, 800),
          );

          return data;
        },
      }),

      getAnalyticsData: tool({
        description: "Generate website analytics and user engagement data",
        inputSchema: z.object({
          metric: z
            .string()
            .describe("The analytics metric to generate data for"),
          timeFrame: z.string().describe("The time frame for the data"),
        }),
        execute: async ({ metric, timeFrame }) => {
          const data = await new Promise((resolve) =>
            setTimeout(() => {
              const metrics = {
                "page-views": {
                  baseValue: 10000,
                  data: Array.from({ length: 7 }, (_, i) => ({
                    label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
                    value: Math.floor(10000 + Math.random() * 5000),
                    color: "#3b82f6",
                  })),
                },
                "user-engagement": {
                  baseValue: 75,
                  data: [
                    { label: "Page Views", value: 89.2, color: "#10b981" },
                    { label: "Time on Site", value: 76.8, color: "#10b981" },
                    { label: "Bounce Rate", value: 23.4, color: "#ef4444" },
                  ],
                },
                "traffic-sources": {
                  baseValue: 100,
                  data: [
                    { label: "Organic", value: 45, color: "#3b82f6" },
                    { label: "Direct", value: 25, color: "#10b981" },
                    { label: "Social", value: 15, color: "#f59e0b" },
                    { label: "Email", value: 10, color: "#8b5cf6" },
                    { label: "Paid", value: 5, color: "#ef4444" },
                  ],
                },
              };

              const selectedMetric =
                metrics[metric as keyof typeof metrics] ||
                metrics["page-views"];

              resolve({
                metric,
                timeFrame,
                value: selectedMetric.baseValue,
                data: selectedMetric.data,
                trend: Math.random() > 0.5 ? "up" : "down",
                trendPercentage: Math.floor(Math.random() * 20 + 1), // 1-20%
              });
            }, 200),
          );

          return data;
        },
      }),

      getUserData: tool({
        description: "Generate user demographics and behavior data",
        inputSchema: z.object({
          dataType: z.string().describe("The type of user data to generate"),
        }),
        execute: async ({ dataType }) => {
          const data = await new Promise((resolve) =>
            setTimeout(() => {
              const userDataTypes = {
                demographics: {
                  data: [
                    { label: "18-24", value: 25, color: "#3b82f6" },
                    { label: "25-34", value: 35, color: "#10b981" },
                    { label: "35-44", value: 20, color: "#f59e0b" },
                    { label: "45-54", value: 15, color: "#8b5cf6" },
                    { label: "55+", value: 5, color: "#ef4444" },
                  ],
                },
                devices: {
                  data: [
                    { label: "Mobile", value: 60, color: "#3b82f6" },
                    { label: "Desktop", value: 30, color: "#10b981" },
                    { label: "Tablet", value: 10, color: "#f59e0b" },
                  ],
                },
                locations: {
                  data: [
                    { label: "North America", value: 40, color: "#3b82f6" },
                    { label: "Europe", value: 30, color: "#10b981" },
                    { label: "Asia", value: 20, color: "#f59e0b" },
                    { label: "Other", value: 10, color: "#8b5cf6" },
                  ],
                },
              };

              const selectedData =
                userDataTypes[dataType as keyof typeof userDataTypes] ||
                userDataTypes["demographics"];

              resolve({
                dataType,
                data: selectedData.data,
                totalUsers: Math.floor(Math.random() * 100000 + 50000), // 50k-150k users
                activeUsers: Math.floor(Math.random() * 50000 + 25000), // 25k-75k active
              });
            }, 200),
          );

          return data;
        },
      }),
    },
    onFinish: ({ usage }) => {
      console.log("usage", usage);
    },
  });

  return result.toUIMessageStreamResponse();
}
