import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  date: string;
}

interface InteractiveChartProps {
  symbol: string;
  onClose: () => void;
  className?: string;
}

// Mock data generator
const generateChartData = (symbol: string): ChartDataPoint[] => {
  const basePrice = 150 + Math.random() * 100;
  const dataPoints: ChartDataPoint[] = [];
  let currentPrice = basePrice;
  const now = Date.now();

  for (let i = 30; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 5;
    currentPrice += change;
    const timestamp = now - i * 24 * 60 * 60 * 1000;

    dataPoints.push({
      timestamp,
      price: Math.max(10, currentPrice),
      volume: Math.floor(Math.random() * 10000000),
      date: new Date(timestamp).toLocaleDateString(),
    });
  }

  return dataPoints;
};

export function InteractiveChart({
  symbol,
  onClose,
  className,
}: InteractiveChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [timeframe, setTimeframe] = useState("1M");

  useEffect(() => {
    setChartData(generateChartData(symbol));
  }, [symbol, timeframe]);

  useEffect(() => {
    if (chartData.length > 0 && !selectedPoint) {
      setSelectedPoint(chartData[chartData.length - 1]);
    }
  }, [chartData]);

  const timeframes = [
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "1Y", value: "1Y" },
  ];

  const chartWidth = 400;
  const chartHeight = 250;
  const padding = 40;

  if (chartData.length === 0) return null;

  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Calculate positions
  const getPointPosition = (index: number, price: number) => {
    const x =
      padding + (index / (chartData.length - 1)) * (chartWidth - 2 * padding);
    const y =
      padding + ((maxPrice - price) / priceRange) * (chartHeight - 2 * padding);
    return { x, y };
  };

  // Generate SVG path
  const pathData = chartData
    .map((point, index) => {
      const { x, y } = getPointPosition(index, point.price);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    // Scale mouse position to data index
    const normalizedX = (mouseX - padding) / (chartWidth - 2 * padding);
    const dataIndex = Math.round(normalizedX * (chartData.length - 1));
    const clampedIndex = Math.max(0, Math.min(chartData.length - 1, dataIndex));

    if (isDragging || event.type === "mousemove") {
      setSelectedPoint(chartData[clampedIndex]);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const currentPrice =
    selectedPoint?.price || chartData[chartData.length - 1]?.price || 0;
  const previousPrice = chartData[0]?.price || currentPrice;
  const change = currentPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;
  const isPositive = change >= 0;

  const selectedIndex = chartData.findIndex((d) => d === selectedPoint);
  const selectedPosition = selectedPoint
    ? getPointPosition(selectedIndex, selectedPoint.price)
    : null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
        className,
      )}
    >
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {symbol}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Interactive Chart</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Price Display */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold">${currentPrice.toFixed(2)}</div>
            <div
              className={cn(
                "flex items-center justify-center gap-2 text-lg font-semibold",
                isPositive ? "text-green-600" : "text-red-600",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change.toFixed(2)} ({isPositive ? "+" : ""}
                {changePercent.toFixed(2)}%)
              </span>
            </div>
            {selectedPoint && (
              <Badge variant="outline" className="text-sm">
                {selectedPoint.date}
              </Badge>
            )}
          </div>

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

          {/* Interactive Chart */}
          <div className="relative bg-gray-50 rounded-lg p-4">
            <svg
              ref={svgRef}
              width={chartWidth}
              height={chartHeight}
              className="w-full cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
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

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Area under curve */}
              <path
                d={`${pathData} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
                fill="url(#priceGradient)"
              />

              {/* Price line */}
              <path
                d={pathData}
                fill="none"
                stroke={isPositive ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
                className="drop-shadow-sm"
              />

              {/* Crosshair */}
              {selectedPosition && (
                <>
                  <line
                    x1={selectedPosition.x}
                    y1={padding}
                    x2={selectedPosition.x}
                    y2={chartHeight - padding}
                    stroke="#6b7280"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    opacity="0.7"
                  />
                  <line
                    x1={padding}
                    y1={selectedPosition.y}
                    x2={chartWidth - padding}
                    y2={selectedPosition.y}
                    stroke="#6b7280"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    opacity="0.7"
                  />
                </>
              )}

              {/* Interactive invisible overlay */}
              <rect
                x={padding}
                y={padding}
                width={chartWidth - 2 * padding}
                height={chartHeight - 2 * padding}
                fill="transparent"
                className="cursor-crosshair"
              />

              {/* Draggable point */}
              {selectedPosition && (
                <circle
                  cx={selectedPosition.x}
                  cy={selectedPosition.y}
                  r="6"
                  fill={isPositive ? "#22c55e" : "#ef4444"}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-grab active:cursor-grabbing drop-shadow-md"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                />
              )}

              {/* Price labels on Y-axis */}
              <text
                x={padding - 10}
                y={padding + 5}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                ${maxPrice.toFixed(0)}
              </text>
              <text
                x={padding - 10}
                y={chartHeight - padding + 5}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                ${minPrice.toFixed(0)}
              </text>
            </svg>

            {/* Tooltip */}
            {selectedPoint && selectedPosition && (
              <div
                className="absolute bg-black text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10"
                style={{
                  left: selectedPosition.x - 50,
                  top: selectedPosition.y - 60,
                  transform: "translate(-50%, 0)",
                }}
              >
                <div className="font-semibold">
                  ${selectedPoint.price.toFixed(2)}
                </div>
                <div className="text-xs opacity-90">{selectedPoint.date}</div>
                <div className="text-xs opacity-75">
                  Vol: {selectedPoint.volume.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground">
            Drag the circle or click anywhere on the chart to see prices over
            time
          </div>

          {/* Chart Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-muted-foreground">Volume</div>
              <div className="font-semibold">
                {selectedPoint?.volume.toLocaleString() || "N/A"}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-muted-foreground">High</div>
              <div className="font-semibold">${maxPrice.toFixed(2)}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-muted-foreground">Low</div>
              <div className="font-semibold">${minPrice.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
