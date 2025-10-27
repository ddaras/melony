/**
 * Chart Widget Example
 * Demonstrates data visualization with charts
 */

import { z } from "zod";
import { defineWidget } from "../define-widget";
import { card, text, chart, row, badge } from "../helpers";

// Define the schema
export const chartDataPointSchema = z.object({
  name: z.string(),
  value: z.number(),
});

export const chartWidgetSchema = z.object({
  type: z.literal("chart-card"),
  title: z.string().describe("Chart title"),
  chartType: z.enum(["line", "bar", "pie", "area"]).describe("Type of chart to display"),
  data: z.array(chartDataPointSchema).describe("Chart data points"),
  xKey: z.string().optional().describe("Key for X-axis (default: 'name')"),
  yKeys: z.array(z.string()).optional().describe("Keys for Y-axis values"),
  description: z.string().optional().describe("Chart description"),
  height: z.number().optional().describe("Chart height in pixels"),
});

// Define the widget
export const ChartWidget = defineWidget({
  type: "chart-card",
  name: "Chart Card",
  description: "Display data visualization with various chart types",
  schema: chartWidgetSchema,
  
  builder: (props) => {
    return card(
      { title: props.title, size: "lg" },
      [
        // Header with chart type badge
        row(
          { gap: "sm", align: "center", justify: "between" },
          [
            ...(props.description
              ? [text({ value: props.description, color: "muted", flex: 1 })]
              : []
            ),
            badge({ label: props.chartType.toUpperCase(), variant: "primary" }),
          ]
        ),
        
        // Chart component
        chart({
          type: props.chartType,
          data: props.data,
          xKey: props.xKey || "name",
          yKeys: props.yKeys || ["value"],
          height: props.height || 300,
        }),
        
        // Data summary
        text({
          value: `${props.data.length} data points`,
          size: "sm",
          color: "muted",
          align: "center",
        }),
      ]
    );
  },
  
  examples: [
    {
      type: "chart-card",
      title: "Monthly Revenue",
      chartType: "bar",
      description: "Revenue breakdown by month",
      data: [
        { name: "Jan", value: 12000 },
        { name: "Feb", value: 15000 },
        { name: "Mar", value: 18000 },
        { name: "Apr", value: 16000 },
        { name: "May", value: 22000 },
        { name: "Jun", value: 25000 },
      ],
      height: 350,
    },
    {
      type: "chart-card",
      title: "User Growth",
      chartType: "line",
      description: "New users over time",
      data: [
        { name: "Week 1", value: 120 },
        { name: "Week 2", value: 180 },
        { name: "Week 3", value: 240 },
        { name: "Week 4", value: 310 },
      ],
    },
    {
      type: "chart-card",
      title: "Traffic Sources",
      chartType: "pie",
      data: [
        { name: "Direct", value: 4500 },
        { name: "Search", value: 3200 },
        { name: "Social", value: 2100 },
        { name: "Referral", value: 1800 },
      ],
    },
  ],
});

