import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  isAfterHours?: boolean;
}

interface StockChartData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  data: ChartDataPoint[];
  afterHoursPrice?: number;
  afterHoursChange?: number;
}

interface StockChartProps {
  symbol: string;
  onClose: () => void;
}

// Mock chart data generator
const generateMockData = (
  symbol: string,
  timeframe: string,
): StockChartData => {
  const basePrice = 150 + Math.random() * 100;
  const dataPoints: ChartDataPoint[] = [];

  let periods = 30;
  if (timeframe === "1W") periods = 7;
  else if (timeframe === "1M") periods = 30;
  else if (timeframe === "3M") periods = 90;
  else if (timeframe === "1Y") periods = 365;

  let currentPrice = basePrice;
  const now = Date.now();

  for (let i = periods; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 5;
    currentPrice += change;

    dataPoints.push({
      timestamp: now - i * 24 * 60 * 60 * 1000,
      price: Math.max(10, currentPrice),
      volume: Math.floor(Math.random() * 10000000),
    });
  }

  // Add after-hours data
  const afterHoursChange = (Math.random() - 0.5) * 3;
  const lastPrice = dataPoints[dataPoints.length - 1].price;

  return {
    symbol,
    name: `${symbol} Inc.`,
    currentPrice: lastPrice,
    change: afterHoursChange,
    changePercent: (afterHoursChange / lastPrice) * 100,
    data: dataPoints,
    afterHoursPrice: lastPrice + afterHoursChange,
    afterHoursChange,
  };
};

export function StockChart({ symbol, onClose }: StockChartProps) {
  const [timeframe, setTimeframe] = useState("1D");
  const [chartData, setChartData] = useState<StockChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  const timeframes = [
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "1Y", value: "1Y" },
  ];

  const fetchChartData = async (selectedTimeframe: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = generateMockData(symbol, selectedTimeframe);
    setChartData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChartData(timeframe);
  }, [symbol, timeframe]);

  const renderChart = () => {
    if (!chartData || chartData.data.length === 0) return null;

    const prices = chartData.data.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    const chartWidth = 350;
    const chartHeight = 200;
    const padding = 20;

    // Generate SVG path
    const pathData = chartData.data
      .map((point, index) => {
        const x =
          padding +
          (index / (chartData.data.length - 1)) * (chartWidth - 2 * padding);
        const y =
          padding +
          ((maxPrice - point.price) / priceRange) * (chartHeight - 2 * padding);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const isPositive = chartData.change >= 0;

    return (
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="50"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth="2"
            className="drop-shadow-sm"
          />

          {/* Gradient fill */}
          <defs>
            <linearGradient
              id="priceGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isPositive ? "#22c55e" : "#ef4444"}
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor={isPositive ? "#22c55e" : "#ef4444"}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
            fill="url(#priceGradient)"
          />

          {/* Data points for interaction */}
          {chartData.data.map((point, index) => {
            const x =
              padding +
              (index / (chartData.data.length - 1)) *
                (chartWidth - 2 * padding);
            const y =
              padding +
              ((maxPrice - point.price) / priceRange) *
                (chartHeight - 2 * padding);

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={isPositive ? "#22c55e" : "#ef4444"}
                className="opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs">
            <div>${hoveredPoint.price.toFixed(2)}</div>
            <div>{new Date(hoveredPoint.timestamp).toLocaleDateString()}</div>
          </div>
        )}
      </div>
    );
  };

  if (!chartData) return null;

  const isPositive = chartData.change >= 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {chartData.symbol}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{chartData.name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Price Display */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">
              ${chartData.currentPrice.toFixed(2)}
            </div>
            <div
              className={cn(
                "flex items-center justify-center gap-2 text-lg font-semibold",
                isPositive ? "text-success" : "text-destructive",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {chartData.change.toFixed(2)} ({isPositive ? "+" : ""}
                {chartData.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* After Hours */}
          {chartData.afterHoursPrice && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-muted-foreground">After Hours</div>
              <div className="font-semibold">
                ${chartData.afterHoursPrice.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {chartData.afterHoursChange && chartData.afterHoursChange >= 0
                  ? "+"
                  : ""}
                {chartData.afterHoursChange?.toFixed(2)}
              </div>
            </div>
          )}

          {/* Timeframe Selector */}
          <div className="flex justify-center">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={timeframe === tf.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe(tf.value)}
                  className="h-8 px-3"
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              renderChart()
            )}
          </div>

          {/* Chart Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-muted-foreground">Volume</div>
              <div className="font-semibold">
                {chartData.data[
                  chartData.data.length - 1
                ]?.volume.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-muted-foreground">Range</div>
              <div className="font-semibold">
                ${Math.min(...chartData.data.map((d) => d.price)).toFixed(2)} -
                ${Math.max(...chartData.data.map((d) => d.price)).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={() => fetchChartData(timeframe)}
            disabled={isLoading}
            className="w-full"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
            />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
