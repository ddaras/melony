import React, { useState } from "react";
import { useTheme } from "../theme";
import { ChartProps } from "./component-types";

export const Chart: React.FC<ChartProps> = ({
  data,
  chartType = "bar",
  size = "md",
  showValues = false,
  showGrid = false,
  showTooltips = true,
}) => {
  const theme = useTheme();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    value: number;
  } | null>(null);

  console.log("Chart component received data:", data);

  // Ensure data is an array
  if (!Array.isArray(data)) {
    return (
      <div style={{ padding: theme.spacing?.md, color: theme.colors?.danger }}>
        Error: Chart data must be an array
      </div>
    );
  }

  // Calculate max value for scaling
  const maxValue = Math.max(...data.map((d) => d.value));
  const padding = { top: 60, right: 20, bottom: 60, left: 20 };
  const chartWidth =
    size === "sm" ? 320 : size === "md" ? 450 : size === "lg" ? 580 : 700;
  const chartHeight =
    size === "sm" ? 120 : size === "md" ? 200 : size === "lg" ? 300 : 400;
  const barWidth = (chartWidth - padding.left - padding.right) / data.length;

  const getColor = (index: number, color?: string) => {
    if (color) {
      return theme.colors?.[color as keyof typeof theme.colors] || color;
    }
    const colors = [
      theme.colors?.primary,
      theme.colors?.success,
      theme.colors?.warning,
      theme.colors?.danger,
      theme.colors?.secondary,
    ];
    return colors[index % colors.length];
  };

  const renderGrid = () => {
    if (!showGrid) return null;
    return [0, 0.2, 0.4, 0.6, 0.8, 1].map((fraction, i) => (
      <line
        key={i}
        x1={padding.left}
        y1={padding.top + chartHeight * (1 - fraction)}
        x2={chartWidth - padding.right}
        y2={padding.top + chartHeight * (1 - fraction)}
        stroke={theme.colors?.border}
        strokeDasharray="3,3"
        strokeOpacity={0.4}
      />
    ));
  };

  const renderAxes = () => {
    return (
      <>
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={chartWidth - padding.right}
          y2={padding.top + chartHeight}
          stroke={theme.colors?.border}
          strokeWidth={2}
        />
      </>
    );
  };

  const renderTooltip = () => {
    if (!tooltip || !tooltip.visible) return null;

    return (
      <g>
        {/* Tooltip background */}
        <rect
          x={tooltip.x - 30}
          y={tooltip.y - 35}
          width={60}
          height={30}
          fill={theme.colors?.background || "#ffffff"}
          stroke={theme.colors?.border || "#e5e5e5"}
          strokeWidth={1}
          rx={4}
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
        />
        {/* Tooltip text */}
        <text
          x={tooltip.x}
          y={tooltip.y - 20}
          textAnchor="middle"
          style={{
            fontSize: theme.typography?.fontSize?.xs || "12px",
            fill: theme.colors?.foreground || "#000000",
            fontWeight: theme.typography?.fontWeight?.medium || "500",
          }}
        >
          {tooltip.value}
        </text>
        <text
          x={tooltip.x}
          y={tooltip.y - 8}
          textAnchor="middle"
          style={{
            fontSize: theme.typography?.fontSize?.xs || "12px",
            fill: theme.colors?.mutedForeground || "#666666",
          }}
        >
          {tooltip.label}
        </text>
      </g>
    );
  };

  const renderBarChart = () => {
    // Calculate bar width with better spacing
    const totalBarSpace = chartWidth - padding.left - padding.right;
    const barSpacing =
      data.length > 1 ? (totalBarSpace * 0.1) / data.length : 0;
    const actualBarWidth =
      (totalBarSpace - barSpacing * (data.length + 1)) / data.length;

    return (
      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ fontFamily: theme.typography?.fontFamily }}
      >
        {renderGrid()}

        {/* Bars */}
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
                rx={theme.radius?.sm}
                onMouseEnter={
                  showTooltips
                    ? (e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          visible: true,
                          x: x + actualBarWidth / 2,
                          y: y - 10,
                          label: item.label,
                          value: item.value,
                        });
                      }
                    : undefined
                }
                onMouseLeave={
                  showTooltips
                    ? () =>
                        setTooltip({
                          visible: false,
                          x: 0,
                          y: 0,
                          label: "",
                          value: 0,
                        })
                    : undefined
                }
                style={{ cursor: showTooltips ? "pointer" : "default" }}
              />

              {/* Value label */}
              {showValues && (
                <text
                  x={x + actualBarWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  style={{
                    fontSize: theme.typography?.fontSize?.sm,
                    fill: theme.colors?.foreground,
                    fontWeight: theme.typography?.fontWeight?.medium,
                  }}
                >
                  {item.value}
                </text>
              )}

              {/* X-axis label */}
              <text
                x={x + actualBarWidth / 2}
                y={padding.top + chartHeight + 25}
                textAnchor="middle"
                style={{
                  fontSize: theme.typography?.fontSize?.sm,
                  fill: theme.colors?.mutedForeground,
                }}
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {renderAxes()}
        {showTooltips && renderTooltip()}
      </svg>
    );
  };

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x =
        padding.left +
        (index / (data.length - 1)) *
          (chartWidth - padding.left - padding.right);
      const y =
        padding.top + chartHeight - (item.value / maxValue) * chartHeight;
      return { x, y, ...item };
    });

    const pathData = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    return (
      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ fontFamily: theme.typography?.fontFamily }}
      >
        {renderGrid()}

        {/* Line */}
        <path d={pathData} fill="none" stroke={getColor(0)} strokeWidth={3} />

        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={5}
              fill={getColor(index, point.color)}
              stroke={theme.colors?.background}
              strokeWidth={2}
              onMouseEnter={
                showTooltips
                  ? () => {
                      setTooltip({
                        visible: true,
                        x: point.x,
                        y: point.y - 10,
                        label: point.label,
                        value: point.value,
                      });
                    }
                  : undefined
              }
              onMouseLeave={
                showTooltips
                  ? () =>
                      setTooltip({
                        visible: false,
                        x: 0,
                        y: 0,
                        label: "",
                        value: 0,
                      })
                  : undefined
              }
              style={{ cursor: showTooltips ? "pointer" : "default" }}
            />
            {showValues && (
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                style={{
                  fontSize: theme.typography?.fontSize?.sm,
                  fill: theme.colors?.foreground,
                  fontWeight: theme.typography?.fontWeight?.medium,
                }}
              >
                {point.value}
              </text>
            )}
            <text
              x={point.x}
              y={padding.top + chartHeight + 25}
              textAnchor="middle"
              style={{
                fontSize: theme.typography?.fontSize?.sm,
                fill: theme.colors?.mutedForeground,
              }}
            >
              {point.label}
            </text>
          </g>
        ))}

        {renderAxes()}
        {showTooltips && renderTooltip()}
      </svg>
    );
  };

  const renderAreaChart = () => {
    const points = data.map((item, index) => {
      const x =
        padding.left +
        (index / (data.length - 1)) *
          (chartWidth - padding.left - padding.right);
      const y =
        padding.top + chartHeight - (item.value / maxValue) * chartHeight;
      return { x, y, ...item };
    });

    const linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    const areaPath =
      linePath +
      ` L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${
        points[0].x
      } ${padding.top + chartHeight} Z`;

    const gradientId = `area-gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ fontFamily: theme.typography?.fontFamily }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getColor(0)} stopOpacity={0.8} />
            <stop offset="95%" stopColor={getColor(0)} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {renderGrid()}

        {/* Area */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={getColor(0)} strokeWidth={3} />

        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={5}
              fill={getColor(index, point.color)}
              stroke={theme.colors?.background}
              strokeWidth={2}
              onMouseEnter={
                showTooltips
                  ? () => {
                      setTooltip({
                        visible: true,
                        x: point.x,
                        y: point.y - 10,
                        label: point.label,
                        value: point.value,
                      });
                    }
                  : undefined
              }
              onMouseLeave={
                showTooltips
                  ? () =>
                      setTooltip({
                        visible: false,
                        x: 0,
                        y: 0,
                        label: "",
                        value: 0,
                      })
                  : undefined
              }
              style={{ cursor: showTooltips ? "pointer" : "default" }}
            />
            {showValues && (
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                style={{
                  fontSize: theme.typography?.fontSize?.sm,
                  fill: theme.colors?.foreground,
                  fontWeight: theme.typography?.fontWeight?.medium,
                }}
              >
                {point.value}
              </text>
            )}
            <text
              x={point.x}
              y={padding.top + chartHeight + 25}
              textAnchor="middle"
              style={{
                fontSize: theme.typography?.fontSize?.sm,
                fill: theme.colors?.mutedForeground,
              }}
            >
              {point.label}
            </text>
          </g>
        ))}

        {renderAxes()}
        {showTooltips && renderTooltip()}
      </svg>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const radius = Math.min(chartWidth, chartHeight - padding.top) / 3;

    let currentAngle = -Math.PI / 2; // Start at top

    const slices = data.map((item, index) => {
      const angle = (item.value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Calculate arc path
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = angle > Math.PI ? 1 : 0;

      const path = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      // Calculate label position (middle of slice)
      const labelAngle = startAngle + angle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);

      currentAngle = endAngle;

      return {
        path,
        labelX,
        labelY,
        ...item,
        percentage: ((item.value / total) * 100).toFixed(1),
        color: getColor(index, item.color),
      };
    });

    return (
      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ fontFamily: theme.typography?.fontFamily }}
      >
        {/* Pie slices */}
        {slices.map((slice, index) => (
          <g key={index}>
            <path
              d={slice.path}
              fill={slice.color}
              onMouseEnter={
                showTooltips
                  ? () => {
                      setTooltip({
                        visible: true,
                        x: slice.labelX,
                        y: slice.labelY - 10,
                        label: slice.label + " " + slice.percentage + "%",
                        value: slice.value,
                      });
                    }
                  : undefined
              }
              onMouseLeave={
                showTooltips
                  ? () =>
                      setTooltip({
                        visible: false,
                        x: 0,
                        y: 0,
                        label: "",
                        value: 0,
                      })
                  : undefined
              }
              style={{ cursor: showTooltips ? "pointer" : "default" }}
            />
          </g>
        ))}

        {/* Legend */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {slices.map((slice, index) => (
            <g key={index} transform={`translate(0, ${index * 20})`}>
              <rect width={12} height={12} fill={slice.color} rx={2} />
              <text
                x={16}
                y={10}
                style={{
                  fontSize: theme.typography?.fontSize?.xs || "11px",
                  fill: theme.colors?.foreground,
                  fontWeight: theme.typography?.fontWeight?.medium,
                }}
              >
                {slice.label}: {slice.value}
              </text>
            </g>
          ))}
        </g>
        {showTooltips && renderTooltip()}
      </svg>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return renderLineChart();
      case "area":
        return renderAreaChart();
      case "pie":
        return renderPieChart();
      case "bar":
      default:
        return renderBarChart();
    }
  };

  return (
    <div style={{ padding: `${theme.spacing?.md} 0px` }}>{renderChart()}</div>
  );
};
