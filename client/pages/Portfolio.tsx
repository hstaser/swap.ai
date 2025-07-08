import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PerformanceChart } from "@/components/ui/performance-chart";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Plus,
  BarChart3,
  DollarSign,
  Target,
  Shield,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  PieChart,
  Activity,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PortfolioStock {
  symbol: string;
  name: string;
  currentPrice: number;
  shares: number;
  totalValue: number;
  allocation: number;
  recommendedAllocation: number;
  change: number;
  changePercent: number;
  sector: string;
  beta: number;
  expectedReturn: number;
  risk: "Low" | "Medium" | "High";
}

interface PortfolioMetrics {
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  diversificationScore: number;
  riskScore: number;
  sharpeRatio: number;
  beta: number;
  expectedAnnualReturn: number;
  volatility: number;
  lastOptimized: string;
}

// Mock portfolio data with optimization
const mockPortfolioStocks: PortfolioStock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 182.52,
    shares: 27,
    totalValue: 4928.04,
    allocation: 28.5,
    recommendedAllocation: 25.0,
    change: 62.37,
    changePercent: 1.28,
    sector: "Technology",
    beta: 1.24,
    expectedReturn: 12.4,
    risk: "Medium",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 378.85,
    shares: 11,
    totalValue: 4167.35,
    allocation: 24.1,
    recommendedAllocation: 22.0,
    change: -16.72,
    changePercent: -0.4,
    sector: "Technology",
    beta: 0.91,
    expectedReturn: 11.2,
    risk: "Medium",
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    currentPrice: 161.42,
    shares: 19,
    totalValue: 3066.98,
    allocation: 17.7,
    recommendedAllocation: 20.0,
    change: 6.46,
    changePercent: 0.21,
    sector: "Healthcare",
    beta: 0.65,
    expectedReturn: 8.5,
    risk: "Low",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    currentPrice: 154.23,
    shares: 16,
    totalValue: 2467.68,
    allocation: 14.3,
    recommendedAllocation: 15.0,
    change: -13.92,
    changePercent: -0.56,
    sector: "Financial Services",
    beta: 1.15,
    expectedReturn: 10.8,
    risk: "Medium",
  },
  {
    symbol: "PG",
    name: "Procter & Gamble",
    currentPrice: 142.86,
    shares: 18,
    totalValue: 2571.48,
    allocation: 14.9,
    recommendedAllocation: 18.0,
    change: 25.71,
    changePercent: 1.02,
    sector: "Consumer Staples",
    beta: 0.52,
    expectedReturn: 7.2,
    risk: "Low",
  },
];

const portfolioMetrics: PortfolioMetrics = {
  totalValue: 17201.53,
  totalReturn: 1863.84,
  totalReturnPercent: 12.16,
  diversificationScore: 82,
  riskScore: 68,
  sharpeRatio: 1.45,
  beta: 0.89,
  expectedAnnualReturn: 10.2,
  volatility: 14.8,
  lastOptimized: "2 minutes ago",
};

const optimizationInsights = [
  {
    type: "rebalance",
    title: "Rebalancing Recommended",
    description:
      "Your Apple allocation is 3.5% above optimal. Consider reducing position.",
    impact: "Could improve Sharpe ratio by 0.08",
    icon: RefreshCw,
    severity: "medium",
  },
  {
    type: "diversification",
    title: "Add International Exposure",
    description:
      "Portfolio is US-heavy. Consider adding international ETFs for better diversification.",
    impact: "Could reduce portfolio volatility by 2.1%",
    icon: Target,
    severity: "low",
  },
  {
    type: "risk",
    title: "Risk Level Optimal",
    description:
      "Current risk level aligns well with moderate growth strategy.",
    impact: "Portfolio beta of 0.89 is within target range",
    icon: CheckCircle,
    severity: "good",
  },
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showRebalanceDetails, setShowRebalanceDetails] = useState(false);

  const runOptimization = () => {
    setIsOptimizing(true);
    // Simulate optimization process
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  const getSectorAllocation = () => {
    const sectors: { [key: string]: number } = {};
    mockPortfolioStocks.forEach((stock) => {
      sectors[stock.sector] = (sectors[stock.sector] || 0) + stock.allocation;
    });
    return Object.entries(sectors).map(([sector, allocation]) => ({
      sector,
      allocation: Number(allocation.toFixed(1)),
    }));
  };

  const sectorAllocation = getSectorAllocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Portfolio
                </h1>
                <p className="text-sm text-muted-foreground">
                  Auto-optimized • {mockPortfolioStocks.length} holdings
                </p>
              </div>
            </div>
            <Button
              onClick={runOptimization}
              disabled={isOptimizing}
              size="sm"
              className="relative"
            >
              {isOptimizing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isOptimizing ? "Optimizing..." : "Optimize"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Portfolio Overview */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div>
                <div className="text-4xl font-bold text-foreground">
                  ${portfolioMetrics.totalValue.toLocaleString()}
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center gap-2 text-lg font-semibold mt-2",
                    portfolioMetrics.totalReturn >= 0
                      ? "text-success"
                      : "text-destructive",
                  )}
                >
                  {portfolioMetrics.totalReturn >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  <span>
                    ${portfolioMetrics.totalReturn.toLocaleString()} (
                    {portfolioMetrics.totalReturnPercent >= 0 ? "+" : ""}
                    {portfolioMetrics.totalReturnPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {portfolioMetrics.diversificationScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Diversification Score
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {portfolioMetrics.riskScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Risk Score
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {portfolioMetrics.sharpeRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sharpe Ratio
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Insights */}
        <Card className="bg-white/90 backdrop-blur-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Insights
              <Badge variant="outline" className="ml-auto text-xs">
                Updated {portfolioMetrics.lastOptimized}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {optimizationInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    insight.severity === "good" &&
                      "bg-green-50 border-green-400",
                    insight.severity === "medium" &&
                      "bg-yellow-50 border-yellow-400",
                    insight.severity === "low" && "bg-blue-50 border-blue-400",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={cn(
                        "h-5 w-5 mt-0.5",
                        insight.severity === "good" && "text-green-600",
                        insight.severity === "medium" && "text-yellow-600",
                        insight.severity === "low" && "text-blue-600",
                      )}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                      <p className="text-xs text-primary font-medium mt-2">
                        {insight.impact}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Portfolio Details Tabs */}
        <Tabs defaultValue="holdings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="holdings" className="space-y-3">
            {mockPortfolioStocks.map((stock) => (
              <Card
                key={stock.symbol}
                className="bg-white/90 backdrop-blur-sm border-0 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{stock.symbol}</h3>
                        <Badge variant="outline" className="text-xs">
                          {stock.sector}
                        </Badge>
                        <Badge
                          variant={
                            stock.risk === "Low"
                              ? "secondary"
                              : stock.risk === "Medium"
                                ? "outline"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {stock.risk} Risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {stock.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {stock.shares} shares @ $
                          {stock.currentPrice.toFixed(2)}
                        </div>
                        <div className="text-xl font-bold">
                          ${stock.totalValue.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {stock.allocation.toFixed(1)}% of portfolio
                        </div>
                        <div
                          className={cn(
                            "text-sm font-medium",
                            stock.change >= 0
                              ? "text-success"
                              : "text-destructive",
                          )}
                        >
                          {stock.change >= 0 ? "+" : ""}$
                          {stock.change.toFixed(2)} (
                          {stock.change >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Current: {stock.allocation.toFixed(1)}%</span>
                        <span>
                          Target: {stock.recommendedAllocation.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={stock.allocation} className="h-2" />
                      {Math.abs(
                        stock.allocation - stock.recommendedAllocation,
                      ) > 2 && (
                        <div className="text-xs text-warning mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Rebalancing suggested
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button asChild className="w-full h-12 text-lg font-semibold mt-4">
              <Link to="/">
                <Plus className="h-5 w-5 mr-2" />
                Add More Stocks
              </Link>
            </Button>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-4">
            {/* Sector Allocation */}
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Sector Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sectorAllocation.map((sector) => (
                  <div key={sector.sector}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{sector.sector}</span>
                      <span className="font-medium">{sector.allocation}%</span>
                    </div>
                    <Progress value={sector.allocation} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Asset Allocation vs Target */}
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Current vs Target Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockPortfolioStocks.map((stock) => (
                  <div key={stock.symbol} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{stock.symbol}</span>
                      <span>
                        {stock.allocation.toFixed(1)}% /{" "}
                        {stock.recommendedAllocation.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={stock.allocation} className="h-3" />
                      <div
                        className="absolute top-0 h-3 w-1 bg-destructive rounded"
                        style={{
                          left: `${stock.recommendedAllocation}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">
                    {portfolioMetrics.expectedAnnualReturn.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expected Return
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">
                    {portfolioMetrics.volatility.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Volatility
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Sharpe Ratio
                    </div>
                    <div className="text-xl font-bold">
                      {portfolioMetrics.sharpeRatio.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Portfolio Beta
                    </div>
                    <div className="text-xl font-bold">
                      {portfolioMetrics.beta.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Return
                    </div>
                    <div className="text-xl font-bold text-success">
                      {portfolioMetrics.totalReturnPercent.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Diversification
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {portfolioMetrics.diversificationScore}/100
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <PerformanceChart />
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Portfolio Risk Level</span>
                    <span className="font-medium">
                      {portfolioMetrics.riskScore}/100
                    </span>
                  </div>
                  <Progress
                    value={portfolioMetrics.riskScore}
                    className="h-3"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Moderate risk level suitable for long-term growth
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Risk Breakdown by Holding</h4>
                  {mockPortfolioStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stock.symbol}</span>
                        <Badge
                          variant={
                            stock.risk === "Low"
                              ? "secondary"
                              : stock.risk === "Medium"
                                ? "outline"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {stock.risk}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        β {stock.beta.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
