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

  // Calculate returns
  const portfolioReturn =
    ((data[data.length - 1].portfolio - data[0].portfolio) /
      data[0].portfolio) *
    100;
  const sp500Return =
    ((data[data.length - 1].sp500 - data[0].sp500) / data[0].sp500) * 100;
  const outperformance = portfolioReturn - sp500Return;

  // Chart dimensions
  const chartWidth = 720;
  const chartHeight = 240;

  // Find min/max values for scaling
  const allValues = data.flatMap((d) => [d.portfolio, d.sp500]);
  const minY = Math.min(...allValues) * 0.98;
  const maxY = Math.max(...allValues) * 1.02;

  // Create path strings for lines
  const createPath = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * chartWidth;
        const y = chartHeight - ((value - minY) / (maxY - minY)) * chartHeight;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const portfolioPath = createPath(data.map((d) => d.portfolio));
  const sp500Path = createPath(data.map((d) => d.sp500));

  return (
    <Card className={cn("bg-white/90 backdrop-blur-sm border-0", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance vs S&P 500
          </CardTitle>
          <div className="flex gap-1">
            {(["1M", "6M", "1Y"] as const).map((tf) => (
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
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-muted-foreground">Your Portfolio</div>
            <div
              className={cn(
                "font-bold text-lg",
                portfolioReturn >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {portfolioReturn >= 0 ? "+" : ""}
              {portfolioReturn.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-muted-foreground">S&P 500</div>
            <div
              className={cn(
                "font-bold text-lg",
                sp500Return >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {sp500Return >= 0 ? "+" : ""}
              {sp500Return.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-muted-foreground">Difference</div>
            <div
              className={cn(
                "font-bold text-lg flex items-center justify-center gap-1",
                outperformance >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {outperformance >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {outperformance >= 0 ? "+" : ""}
              {outperformance.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative bg-white rounded-lg p-4 border">
          <svg
            width="100%"
            height="320"
            viewBox="0 0 800 320"
            className="w-full"
          >
            {/* Background */}
            <rect width="800" height="320" fill="white" />

            {/* Chart area with margins for axes */}
            <g transform="translate(60, 20)">
              {/* Grid lines */}
              <defs>
                <pattern
                  id="grid"
                  width="80"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 80 0 L 0 0 0 40"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="720" height="240" fill="url(#grid)" />

              {/* Y-axis labels */}
              {[0, 20, 40, 60, 80, 100].map((value, index) => (
                <g key={value}>
                  <line
                    x1="0"
                    y1={240 - (value / 100) * 240}
                    x2="720"
                    y2={240 - (value / 100) * 240}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x="-10"
                    y={240 - (value / 100) * 240 + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {value}%
                  </text>
                </g>
              ))}

              {/* X-axis labels */}
              {[0, 25, 50, 75, 100].map((percentage, index) => {
                const x = (percentage / 100) * 720;
                const dataIndex = Math.floor(
                  (percentage / 100) * (data.length - 1),
                );
                const date = new Date(data[dataIndex]?.date);
                const label =
                  timeframe === "1M"
                    ? date.getDate().toString()
                    : timeframe === "6M"
                      ? date.toLocaleDateString("en-US", { month: "short" })
                      : date.toLocaleDateString("en-US", {
                          month: "short",
                          year: "2-digit",
                        });

                return (
                  <g key={percentage}>
                    <line
                      x1={x}
                      y1="240"
                      x2={x}
                      y2="250"
                      stroke="#6b7280"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y="265"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#6b7280"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* S&P 500 line (background) */}
              <path
                d={sp500Path}
                fill="none"
                stroke="#9ca3af"
                strokeWidth="3"
                strokeDasharray="6,6"
                opacity="0.8"
              />

              {/* Portfolio line (foreground) */}
              <path
                d={portfolioPath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                className="drop-shadow-sm"
              />
            </g>

            {/* Y-axis title */}
            <text
              x="25"
              y="160"
              textAnchor="middle"
              fontSize="14"
              fill="#374151"
              transform="rotate(-90, 25, 160)"
              fontWeight="500"
            >
              Return (%)
            </text>

            {/* X-axis title */}
            <text
              x="420"
              y="310"
              textAnchor="middle"
              fontSize="14"
              fill="#374151"
              fontWeight="500"
            >
              Time ({timeframe === "1M" ? "Days" : "Months"})
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded" />
            <span>Your Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 border-t-2 border-gray-500 border-dashed" />
            <span>S&P 500</span>
          </div>
        </div>

        {/* Outperformance Badge */}
        {Math.abs(outperformance) > 1 && (
          <div className="text-center">
            <Badge
              variant={outperformance >= 0 ? "default" : "destructive"}
              className="text-sm px-3 py-1"
            >
              Your portfolio is{" "}
              {outperformance >= 0 ? "outperforming" : "underperforming"} the
              market by {Math.abs(outperformance).toFixed(1)}% this{" "}
              {timeframe.toLowerCase()}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
