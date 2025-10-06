// 1. Define schema once
import { zodSchemaToPrompt } from "melony/zod";
import { z } from "zod";

export const chartSchema = z.object({
  type: z.literal("chart-card"),
  title: z.string(),
  value: z.number(),
  previousValue: z.number().optional(),
  unit: z.string().optional(),
  chartType: z.enum(["line", "bar", "area", "pie", "donut"]).default("line"),
  data: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        color: z.string().optional(),
      })
    )
    .optional(),
  trend: z.enum(["up", "down", "neutral"]).optional(),
  trendPercentage: z.number().optional(),
  timeFrame: z.string().optional(),
  description: z.string().optional(),
  showDownload: z.boolean().default(true),
});

// 2. Generate AI prompt automatically
export const chartCardUIComponentPrompt = zodSchemaToPrompt({
  type: "chart-card",
  schema: chartSchema,
  description:
    "Use for displaying data visualizations with metrics, trends, and interactive chart elements",
  examples: [
    {
      type: "chart-card",
      title: "Monthly Revenue",
      value: 125000,
      previousValue: 110000,
      unit: "$",
      chartType: "line",
      data: [
        { label: "Jan", value: 95000, color: "#3b82f6" },
        { label: "Feb", value: 110000, color: "#3b82f6" },
        { label: "Mar", value: 125000, color: "#3b82f6" },
        { label: "Apr", value: 118000, color: "#3b82f6" },
        { label: "May", value: 125000, color: "#3b82f6" },
      ],
      trend: "up",
      trendPercentage: 13.6,
      timeFrame: "Last 30 days",
      description: "Steady growth in monthly revenue",
      showDownload: true,
    },
    {
      type: "chart-card",
      title: "User Engagement",
      value: 89.2,
      unit: "%",
      chartType: "bar",
      data: [
        { label: "Page Views", value: 89.2, color: "#10b981" },
        { label: "Time on Site", value: 76.8, color: "#10b981" },
        { label: "Bounce Rate", value: 23.4, color: "#ef4444" },
      ],
      trend: "up",
      trendPercentage: 5.2,
      timeFrame: "This week",
      description: "Strong user engagement metrics",
      showDownload: true,
    },
    {
      type: "chart-card",
      title: "Sales Distribution",
      value: 125000,
      unit: "$",
      chartType: "pie",
      data: [
        { label: "Online", value: 75000, color: "#3b82f6" },
        { label: "Retail", value: 35000, color: "#10b981" },
        { label: "Wholesale", value: 15000, color: "#f59e0b" },
      ],
      timeFrame: "Q1 2024",
      description: "Sales channel breakdown",
      showDownload: true,
    },
    {
      type: "chart-card",
      title: "Website Traffic",
      value: 45230,
      chartType: "area",
      data: [
        { label: "Mon", value: 12000, color: "#8b5cf6" },
        { label: "Tue", value: 15000, color: "#8b5cf6" },
        { label: "Wed", value: 18000, color: "#8b5cf6" },
        { label: "Thu", value: 22000, color: "#8b5cf6" },
        { label: "Fri", value: 25000, color: "#8b5cf6" },
      ],
      trend: "up",
      trendPercentage: 12.5,
      timeFrame: "This week",
      description: "Daily website visitors",
      showDownload: true,
    },
  ],
});
