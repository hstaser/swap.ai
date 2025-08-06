import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceData {
  period: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  alpha: number;
  beta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  winRate: number;
}

interface HoldingPerformance {
  symbol: string;
  name: string;
  allocation: number;
  return1D: number;
  return1W: number;
  return1M: number;
  return3M: number;
  return1Y: number;
  contribution: number;
}

const performanceData: PerformanceData[] = [
  {
    period: "1D",
    portfolioReturn: 0.87,
    benchmarkReturn: 0.54,
    alpha: 0.33,
    beta: 0.89,
    sharpeRatio: 1.45,
    maxDrawdown: -2.1,
    volatility: 14.8,
    winRate: 62.3,
  },
  {
    period: "1W",
    portfolioReturn: 2.14,
    benchmarkReturn: 1.89,
    alpha: 0.25,
    beta: 0.91,
    sharpeRatio: 1.42,
    maxDrawdown: -3.2,
    volatility: 15.2,
    winRate: 61.8,
  },
  {
    period: "1M",
    portfolioReturn: 4.32,
    benchmarkReturn: 3.76,
    alpha: 0.56,
    beta: 0.93,
    sharpeRatio: 1.38,
    maxDrawdown: -5.8,
    volatility: 16.1,
    winRate: 58.4,
  },
  {
    period: "3M",
    portfolioReturn: 8.91,
    benchmarkReturn: 7.42,
    alpha: 1.49,
    beta: 0.88,
    sharpeRatio: 1.35,
    maxDrawdown: -8.9,
    volatility: 17.3,
    winRate: 57.2,
  },
  {
    period: "1Y",
    portfolioReturn: 18.92,
    benchmarkReturn: 12.34,
    alpha: 6.58,
    beta: 0.92,
    sharpeRatio: 1.31,
    maxDrawdown: -12.3,
    volatility: 18.7,
    winRate: 55.9,
  },
];

const holdingsPerformance: HoldingPerformance[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    allocation: 28.5,
    return1D: 1.28,
    return1W: 3.2,
    return1M: 6.7,
    return3M: 12.4,
    return1Y: 18.9,
    contribution: 0.36,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    allocation: 24.1,
    return1D: -0.4,
    return1W: 1.8,
    return1M: 5.2,
    return3M: 7.8,
    return1Y: 11.2,
    contribution: 0.04,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    allocation: 14.3,
    return1D: -0.56,
    return1W: 0.8,
    return1M: 4.1,
    return3M: 9.3,
    return1Y: 14.7,
    contribution: -0.08,
  },
  {
    symbol: "PG",
    name: "Procter & Gamble",
    allocation: 14.9,
    return1D: 1.02,
    return1W: 2.3,
    return1M: 5.4,
    return3M: 8.9,
    return1Y: 13.5,
    contribution: 0.15,
  },
];

interface PerformanceChartProps {
  className?: string;
}

export function PerformanceChart({ className }: PerformanceChartProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Performance Overview */}
      <Card className="bg-white/90 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {performanceData.map((data) => (
                <div
                  key={data.period}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {data.period}
                  </div>
                  <div
                    className={cn(
                      "text-lg font-bold",
                      data.portfolioReturn >= 0
                        ? "text-success"
                        : "text-destructive",
                    )}
                  >
                    {data.portfolioReturn >= 0 ? "+" : ""}
                    {data.portfolioReturn.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    vs {data.benchmarkReturn.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Alpha</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              +{performanceData[4].alpha.toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Outperforming benchmark
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Portfolio Growth</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              +24.8%
            </div>
            <div className="text-xs text-muted-foreground">
              Total return this year
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics */}
      <Card className="bg-white/90 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Beta</div>
              <div className="text-xl font-bold">
                {performanceData[4].beta.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Lower than market
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Volatility</div>
              <div className="text-xl font-bold">
                {performanceData[4].volatility.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Annual volatility
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              <div className="text-xl font-bold text-primary">
                1.8
              </div>
              <div className="text-xs text-muted-foreground">
                Risk-adjusted return
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
              <div className="text-xl font-bold text-success">
                $47,832
              </div>
              <div className="text-xs text-muted-foreground">Total value</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Level</span>
              <span className="font-medium">Moderate</span>
            </div>
            <Progress value={68} className="h-2" />
            <div className="text-xs text-muted-foreground">
              68/100 risk score
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
