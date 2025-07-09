import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    winRate: 62.5,
  },
  {
    period: "1W",
    portfolioReturn: 2.34,
    benchmarkReturn: 1.89,
    alpha: 0.45,
    beta: 0.91,
    sharpeRatio: 1.42,
    maxDrawdown: -3.2,
    volatility: 15.1,
    winRate: 71.4,
  },
  {
    period: "1M",
    portfolioReturn: 5.67,
    benchmarkReturn: 4.23,
    alpha: 1.44,
    beta: 0.93,
    sharpeRatio: 1.38,
    maxDrawdown: -5.8,
    volatility: 15.8,
    winRate: 64.5,
  },
  {
    period: "3M",
    portfolioReturn: 12.45,
    benchmarkReturn: 8.76,
    alpha: 3.69,
    beta: 0.88,
    sharpeRatio: 1.35,
    maxDrawdown: -8.9,
    volatility: 16.2,
    winRate: 68.2,
  },
  {
    period: "1Y",
    portfolioReturn: 18.92,
    benchmarkReturn: 12.34,
    alpha: 6.58,
    beta: 0.92,
    sharpeRatio: 1.31,
    maxDrawdown: -12.3,
    volatility: 17.1,
    winRate: 65.8,
  },
];

const holdingsPerformance: HoldingPerformance[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    allocation: 28.5,
    return1D: 1.28,
    return1W: 3.45,
    return1M: 8.92,
    return3M: 15.67,
    return1Y: 22.34,
    contribution: 0.37,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp",
    allocation: 24.1,
    return1D: -0.4,
    return1W: 2.1,
    return1M: 6.8,
    return3M: 12.4,
    return1Y: 18.9,
    contribution: -0.1,
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    allocation: 17.7,
    return1D: 0.21,
    return1W: 1.5,
    return1M: 3.2,
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
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
        </TabsList>

        {/* Performance Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 text-center">
                {performanceData.map((data) => (
                  <div key={data.period} className="space-y-2">
                    <div className="text-xs text-muted-foreground">
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
                  <BarChart3 className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Max Drawdown</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {performanceData[4].maxDrawdown.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Worst decline from peak
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Detailed Analytics */}
        <TabsContent value="analytics" className="space-y-4">
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
                  <div className="text-sm text-muted-foreground">
                    Volatility
                  </div>
                  <div className="text-xl font-bold">
                    {performanceData[4].volatility.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Annual volatility
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Max Drawdown
                  </div>
                  <div className="text-xl font-bold text-destructive">
                    {performanceData[4].maxDrawdown.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Largest decline
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                  <div className="text-xl font-bold text-success">
                    {performanceData[4].winRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Positive days
                  </div>
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

          {/* Historical Performance */}
          <Card className="bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle>Historical Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceData.slice(1).map((data) => (
                  <div key={data.period} className="flex items-center gap-4">
                    <div className="w-8 text-sm font-medium">{data.period}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Portfolio</span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            data.portfolioReturn >= 0
                              ? "text-success"
                              : "text-destructive",
                          )}
                        >
                          {data.portfolioReturn >= 0 ? "+" : ""}
                          {data.portfolioReturn.toFixed(2)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.abs(data.portfolioReturn) * 2}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holdings Performance */}
        <TabsContent value="holdings" className="space-y-4">
          {holdingsPerformance.map((holding) => (
            <Card
              key={holding.symbol}
              className="bg-white/90 backdrop-blur-sm border-0"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{holding.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {holding.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {holding.allocation.toFixed(1)}%
                    </div>
                    <div
                      className={cn(
                        "font-medium",
                        holding.contribution >= 0
                          ? "text-success"
                          : "text-destructive",
                      )}
                    >
                      {holding.contribution >= 0 ? "+" : ""}
                      {holding.contribution.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div>
                    <div className="text-muted-foreground">1D</div>
                    <div
                      className={cn(
                        "font-medium",
                        holding.return1D >= 0
                          ? "text-success"
                          : "text-destructive",
                      )}
                    >
                      {holding.return1D >= 0 ? "+" : ""}
                      {holding.return1D.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">1W</div>
                    <div
                      className={cn(
                        "font-medium",
                        holding.return1W >= 0
                          ? "text-success"
                          : "text-destructive",
                      )}
                    >
                      {holding.return1W >= 0 ? "+" : ""}
                      {holding.return1W.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">1M</div>
                    <div
                      className={cn(
                        "font-medium",
                        holding.return1M >= 0
                          ? "text-success"
                          : "text-destructive",
                      )}
                    >
                      {holding.return1M >= 0 ? "+" : ""}
                      {holding.return1M.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">3M</div>
                    <div
                      className={cn(
                        "font-medium",
                        holding.return3M >= 0
                          ? "text-success"
                          : "text-destructive",
                      )}
                    >
                      {holding.return3M >= 0 ? "+" : ""}
                      {holding.return3M.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">1Y</div>
                    <div
                      className={cn(
                        "font-medium",
                        holding.return1Y >= 0
                          ? "text-success"
                          : "text-destructive",
                      )}
                    >
                      {holding.return1Y >= 0 ? "+" : ""}
                      {holding.return1Y.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
