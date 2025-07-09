import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  date: string;
  portfolio: number;
  sp500: number;
}

interface ComparisonChartProps {
  timeframe: "1M" | "6M" | "1Y";
  onTimeframeChange: (timeframe: "1M" | "6M" | "1Y") => void;
  className?: string;
}

// Mock data for demonstration
const generateMockData = (timeframe: string): ChartDataPoint[] => {
  const periods = timeframe === "1M" ? 30 : timeframe === "6M" ? 180 : 365;
  const data: ChartDataPoint[] = [];

  let portfolioValue = 100;
  let sp500Value = 100;

  for (let i = 0; i < periods; i++) {
    // Portfolio tends to outperform slightly with more volatility
    const portfolioChange = (Math.random() - 0.48) * 2;
    const sp500Change = (Math.random() - 0.49) * 1.5;

    portfolioValue += portfolioChange;
    sp500Value += sp500Change;

    const date = new Date();
    date.setDate(date.getDate() - (periods - i));

    data.push({
      date: date.toISOString().split("T")[0],
      portfolio: Math.max(85, portfolioValue),
      sp500: Math.max(90, sp500Value),
    });
  }

  return data;
};

export function ComparisonChart({
  timeframe,
  onTimeframeChange,
  className,
}: ComparisonChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  const data = generateMockData(timeframe);
  const chartWidth = 350;
  const chartHeight = 200;
  const padding = 30;

  const allValues = [
    ...data.map((d) => d.portfolio),
    ...data.map((d) => d.sp500),
  ];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;

  // Calculate returns
  const portfolioReturn =
    ((data[data.length - 1].portfolio - data[0].portfolio) /
      data[0].portfolio) *
    100;
  const sp500Return =
    ((data[data.length - 1].sp500 - data[0].sp500) / data[0].sp500) * 100;
  const outperformance = portfolioReturn - sp500Return;

  // Generate SVG paths
  const portfolioPath = data
    .map((point, index) => {
      const x =
        padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
      const y =
        padding +
        ((maxValue - point.portfolio) / valueRange) *
          (chartHeight - 2 * padding);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const sp500Path = data
    .map((point, index) => {
      const x =
        padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
      const y =
        padding +
        ((maxValue - point.sp500) / valueRange) * (chartHeight - 2 * padding);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <Card className={cn("bg-white/90 backdrop-blur-sm border-0", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance vs S&P 500
          </CardTitle>
          <div className="flex gap-1">
            {(["1M", "3M", "6M", "1Y"] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeframeChange(tf)}
                className="h-7 px-2 text-xs"
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-xs text-muted-foreground">Your Portfolio</div>
            <div
              className={cn(
                "font-bold",
                portfolioReturn >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {portfolioReturn >= 0 ? "+" : ""}
              {portfolioReturn.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-muted-foreground">S&P 500</div>
            <div
              className={cn(
                "font-bold",
                sp500Return >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {sp500Return >= 0 ? "+" : ""}
              {sp500Return.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-xs text-muted-foreground">Difference</div>
            <div
              className={cn(
                "font-bold flex items-center justify-center gap-1",
                outperformance >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {outperformance >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {outperformance >= 0 ? "+" : ""}
              {outperformance.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <svg width={chartWidth} height={chartHeight} className="w-full">
            {/* Grid lines */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 30"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* S&P 500 line (background) */}
            <path
              d={sp500Path}
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.8"
            />

            {/* Portfolio line (foreground) */}
            <path
              d={portfolioPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              className="drop-shadow-sm"
            />

            {/* Portfolio gradient fill */}
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${portfolioPath} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
              fill="url(#portfolioGradient)"
            />

            {/* Interactive points */}
            {data.map((point, index) => {
              if (index % Math.ceil(data.length / 10) !== 0) return null; // Show every 10th point

              const x =
                padding +
                (index / (data.length - 1)) * (chartWidth - 2 * padding);
              const portfolioY =
                padding +
                ((maxValue - point.portfolio) / valueRange) *
                  (chartHeight - 2 * padding);
              const sp500Y =
                padding +
                ((maxValue - point.sp500) / valueRange) *
                  (chartHeight - 2 * padding);

              return (
                <g key={index}>
                  {/* S&P 500 point */}
                  <circle
                    cx={x}
                    cy={sp500Y}
                    r="3"
                    fill="#6b7280"
                    className="opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Portfolio point */}
                  <circle
                    cx={x}
                    cy={portfolioY}
                    r="4"
                    fill="#3b82f6"
                    className="opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs">
              <div>Portfolio: {hoveredPoint.portfolio.toFixed(1)}%</div>
              <div>S&P 500: {hoveredPoint.sp500.toFixed(1)}%</div>
              <div>{new Date(hoveredPoint.date).toLocaleDateString()}</div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500" />
            <span>Your Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 border-t-2 border-gray-500 border-dashed" />
            <span>S&P 500</span>
          </div>
        </div>

        {/* Performance Message */}
        {Math.abs(outperformance) > 1 && (
          <div
            className={cn(
              "p-3 rounded-lg text-sm text-center",
              outperformance > 0
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200",
            )}
          >
            {outperformance > 0 ? "🎉" : "📈"} Your portfolio is{" "}
            {outperformance > 0 ? "outperforming" : "underperforming"} the
            market by {Math.abs(outperformance).toFixed(1)}% this{" "}
            {timeframe.toLowerCase()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
