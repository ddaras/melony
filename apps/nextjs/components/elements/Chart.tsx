import React, { useState } from "react";
import { UIContract } from "../../ui-contract";
import { cn } from "@/lib/utils";

export const Chart: React.FC<UIContract["chart"]> = ({
  data,
  chartType = "bar",
  title,
  height = 250,
  showValues = false,
  showGrid = false,
  showTooltips = true,
}) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    value: number;
  } | null>(null);

  if (!Array.isArray(data)) {
    return (
      <div className="p-4 text-destructive border border-destructive/20 rounded-md bg-destructive/5 text-sm">
        Error: Chart data must be an array
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const padding = { top: 40, right: 20, bottom: 40, left: 20 };

  // Use container width or default
  const chartHeight = height;
  const chartWidth = 600; // Will be responsive via viewBox

  const defaultColors = [
    "hsl(var(--primary))",
    "hsl(var(--chart-1, 217 91% 60%))",
    "hsl(var(--chart-2, 142 71% 45%))",
    "hsl(var(--chart-3, 31 92% 55%))",
    "hsl(var(--chart-4, 346 84% 61%))",
    "hsl(var(--chart-5, 271 81% 56%))",
  ];

  const getColor = (index: number, color?: string) => {
    if (color) return color;
    return defaultColors[index % defaultColors.length];
  };

  const renderGrid = () => {
    if (!showGrid) return null;
    return [0, 0.25, 0.5, 0.75, 1].map((fraction, i) => (
      <line
        key={i}
        x1={padding.left}
        y1={padding.top + chartHeight * (1 - fraction)}
        x2={chartWidth - padding.right}
        y2={padding.top + chartHeight * (1 - fraction)}
        stroke="currentColor"
        className="text-border"
        strokeDasharray="4,4"
        strokeOpacity={0.5}
      />
    ));
  };

  const renderTooltip = () => {
    if (!tooltip || !tooltip.visible) return null;

    return (
      <g className="pointer-events-none">
        <rect
          x={tooltip.x - 40}
          y={tooltip.y - 45}
          width={80}
          height={40}
          fill="hsl(var(--popover))"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          rx={6}
          className="shadow-md"
        />
        <text
          x={tooltip.x}
          y={tooltip.y - 28}
          textAnchor="middle"
          className="fill-popover-foreground text-[10px] font-semibold"
        >
          {tooltip.value}
        </text>
        <text
          x={tooltip.x}
          y={tooltip.y - 14}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          {tooltip.label}
        </text>
      </g>
    );
  };

  const renderBarChart = () => {
    const totalBarSpace = chartWidth - padding.left - padding.right;
    const barSpacing =
      data.length > 1 ? (totalBarSpace * 0.1) / data.length : 0;
    const actualBarWidth =
      (totalBarSpace - barSpacing * (data.length + 1)) / data.length;

    return (
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + padding.bottom}`}
        className="w-full h-auto overflow-visible"
      >
        {renderGrid()}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x =
            padding.left + barSpacing + index * (actualBarWidth + barSpacing);
          const y = padding.top + chartHeight - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={actualBarWidth}
                height={barHeight}
                fill={getColor(index, item.color)}
                rx={4}
                onMouseEnter={() =>
                  showTooltips &&
                  setTooltip({
                    visible: true,
                    x: x + actualBarWidth / 2,
                    y: y - 5,
                    label: item.label,
                    value: item.value,
                  })
                }
                onMouseLeave={() =>
                  setTooltip({
                    visible: false,
                    x: 0,
                    y: 0,
                    label: "",
                    value: 0,
                  })
                }
                className="transition-all hover:opacity-80 cursor-pointer"
              />
              <text
                x={x + actualBarWidth / 2}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {item.label}
              </text>
            </g>
          );
        })}
        {showTooltips && renderTooltip()}
      </svg>
    );
  };

  const renderLineChart = () => {
    const points = data.map((item, index) => ({
      x:
        padding.left +
        (index / Math.max(data.length - 1, 1)) *
          (chartWidth - padding.left - padding.right),
      y: padding.top + chartHeight - (item.value / maxValue) * chartHeight,
      ...item,
    }));

    const pathData = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    return (
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + padding.bottom}`}
        className="w-full h-auto overflow-visible"
      >
        {renderGrid()}
        <path
          d={pathData}
          fill="none"
          stroke={getColor(0)}
          strokeWidth={3}
          className="transition-all"
        />
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={5}
              fill={getColor(index, point.color)}
              stroke="hsl(var(--background))"
              strokeWidth={2}
              onMouseEnter={() =>
                showTooltips &&
                setTooltip({
                  visible: true,
                  x: point.x,
                  y: point.y - 5,
                  label: point.label,
                  value: point.value,
                })
              }
              onMouseLeave={() =>
                setTooltip({ visible: false, x: 0, y: 0, label: "", value: 0 })
              }
              className="hover:r-6 transition-all cursor-pointer"
            />
            <text
              x={point.x}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {point.label}
            </text>
          </g>
        ))}
        {showTooltips && renderTooltip()}
      </svg>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return renderLineChart();
      case "bar":
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="py-4 w-full">
      {title && (
        <div className="text-sm font-semibold mb-4 text-center">{title}</div>
      )}
      {renderChart()}
    </div>
  );
};
