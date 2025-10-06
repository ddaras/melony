"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
} from "recharts";
import { chartSchema } from "./chart-card.schema";

// 3. Use for type-safe components
type ChartCardProps = z.infer<typeof chartSchema>;

const getChartIcon = (chartType: string) => {
  switch (chartType) {
    case "bar":
      return <BarChart3 className="w-5 h-5" />;
    case "line":
    case "area":
      return <Activity className="w-5 h-5" />;
    default:
      return <BarChart3 className="w-5 h-5" />;
  }
};

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const getTrendArrow = (trend?: string) => {
  switch (trend) {
    case "up":
      return <ArrowUpRight className="w-3 h-3 text-green-500" />;
    case "down":
      return <ArrowDownRight className="w-3 h-3 text-red-500" />;
    default:
      return null;
  }
};

const formatValue = (value: number, unit?: string) => {
  if (unit === "$") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (unit === "%") {
    return `${value.toFixed(1)}%`;
  }
  return new Intl.NumberFormat("en-US").format(value);
};

// Chart visualization component using shadcn charts
const ChartVisualization: React.FC<{
  data: { label: string; value: number; color?: string }[];
  type: string;
  title: string;
}> = ({ data, type, title }) => {
  // Transform data for recharts format
  const chartData = data.map((item, index) => ({
    label: item.label,
    value: item.value,
    [title.toLowerCase().replace(/\s+/g, "_")]: item.value,
    fill: item.color || `var(--chart-${(index % 5) + 1})`,
  }));

  const chartConfig = {
    [title.toLowerCase().replace(/\s+/g, "_")]: {
      label: title,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Create config for pie charts with individual data points
  const pieChartConfig = data.reduce((config, item, index) => {
    config[item.label?.toLowerCase().replace(/\s+/g, "_")] = {
      label: item.label,
      color: item.color || `var(--chart-${(index % 5) + 1})`,
    };
    return config;
  }, {} as ChartConfig);

  if (type === "pie") {
    return (
      <ChartContainer config={pieChartConfig} className="h-32 w-32 mx-auto">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={50}
            innerRadius={0}
          />
        </PieChart>
      </ChartContainer>
    );
  }

  if (type === "area") {
    return (
      <ChartContainer config={chartConfig} className="h-24 w-full">
        <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
          <defs>
            <linearGradient
              id={`area-fill-${title}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--color-chart-1)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-chart-1)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="w-32"
                formatter={(value) => [value, title]}
              />
            }
          />
          <Area
            dataKey={title.toLowerCase().replace(/\s+/g, "_")}
            type="natural"
            fill={`url(#area-fill-${title})`}
            stroke="var(--color-chart-1)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    );
  }

  if (type === "bar") {
    return (
      <ChartContainer config={chartConfig} className="h-24 w-full">
        <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-32"
                formatter={(value) => [value, title]}
              />
            }
          />
          <Bar
            dataKey={title.toLowerCase().replace(/\s+/g, "_")}
            fill="var(--color-chart-1)"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    );
  }

  // Default to line chart
  return (
    <ChartContainer config={chartConfig} className="h-24 w-full">
      <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-32"
              formatter={(value) => [value, title]}
            />
          }
        />
        <Line
          dataKey={title.toLowerCase().replace(/\s+/g, "_")}
          type="monotone"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export const ChartCard: React.FC<ChartCardProps> = (props) => {
  const {
    title,
    value = 0,
    previousValue,
    unit,
    chartType = "line",
    data = [],
    trend,
    trendPercentage,
    timeFrame,
    description,
    showDownload = true,
  } = props;

  const hasTrend = trendPercentage !== undefined && trendPercentage !== 0;
  const isPositiveTrend = trend === "up";

  return (
    <Card className="py-0 group overflow-hidden transition-all duration-200 border-gray-100 bg-white w-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              {getChartIcon(chartType)}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
              {timeFrame && (
                <p className="text-xs text-gray-500">{timeFrame}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {showDownload && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 w-full">
        {/* Main Value */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatValue(value, unit)}
          </span>
          {hasTrend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositiveTrend
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {getTrendArrow(trend)}
              {Math.abs(trendPercentage).toFixed(1)}%
            </div>
          )}
        </div>

        {/* Previous Value Comparison */}
        {previousValue !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">
              Previous: {formatValue(previousValue, unit)}
            </span>
            {getTrendIcon(trend)}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}

        {/* Chart Visualization */}
        {data.length > 0 && (
          <div className="mb-3">
            <ChartVisualization data={data} type={chartType} title={title} />
          </div>
        )}

        {/* Data Points */}
        {data.length > 0 && data.length <= 4 && (
          <div className="flex flex-wrap gap-2">
            {data.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-100 text-gray-700 text-xs"
              >
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: item.color || "#3b82f6" }}
                />
                {item.label}: {formatValue(item.value || 0, unit)}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
