import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PerformanceChart } from "@/components/ui/performance-chart";
import { ExportModal } from "@/components/ui/export-modal";
import { PriceAlerts } from "@/components/ui/price-alerts";
import { AIRebalancing } from "@/components/ui/ai-rebalancing";
import { AIOptimizationReview } from "@/components/ui/ai-optimization-review";
import { ComparisonChart } from "@/components/ui/comparison-chart";
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
  Download,
  Bell,
  Calendar,
  FileText,
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

interface Transaction {
  id: string;
  date: string;
  type: "BUY" | "SELL" | "DIVIDEND";
  symbol: string;
  companyName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  orderId: string;
}

interface PortfolioMetrics {
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  diversificationScore: number;
  riskScore: number;
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

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    date: "2024-01-15T10:30:00Z",
    type: "BUY",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    quantity: 10,
    price: 182.52,
    totalAmount: 1825.2,
    status: "COMPLETED",
    orderId: "ORD_20240115_001",
  },
  {
    id: "txn_002",
    date: "2024-01-12T14:15:00Z",
    type: "BUY",
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    quantity: 11,
    price: 378.85,
    totalAmount: 4167.35,
    status: "COMPLETED",
    orderId: "ORD_20240112_002",
  },
  {
    id: "txn_003",
    date: "2024-01-10T09:45:00Z",
    type: "DIVIDEND",
    symbol: "JNJ",
    companyName: "Johnson & Johnson",
    quantity: 19,
    price: 1.57,
    totalAmount: 29.83,
    status: "COMPLETED",
    orderId: "DIV_20240110_003",
  },
  {
    id: "txn_004",
    date: "2024-01-08T11:20:00Z",
    type: "BUY",
    symbol: "JPM",
    companyName: "JPMorgan Chase & Co.",
    quantity: 16,
    price: 154.23,
    totalAmount: 2467.68,
    status: "COMPLETED",
    orderId: "ORD_20240108_004",
  },
  {
    id: "txn_005",
    date: "2024-01-05T16:30:00Z",
    type: "BUY",
    symbol: "PG",
    companyName: "Procter & Gamble",
    quantity: 18,
    price: 142.86,
    totalAmount: 2571.48,
    status: "COMPLETED",
    orderId: "ORD_20240105_005",
  },
];

const portfolioMetrics: PortfolioMetrics = {
  totalValue: 17201.53,
  totalReturn: 1863.84,
  totalReturnPercent: 12.16,
  diversificationScore: 82,
  riskScore: 68,
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
    impact: "Could reduce portfolio volatility by 1.2%",
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showAIRebalancing, setShowAIRebalancing] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);
  const [optimizationData, setOptimizationData] = useState<any>(null);
  const [showRebalanceComparison, setShowRebalanceComparison] = useState(false);
  const [comparisonTimeframe, setComparisonTimeframe] = useState<
    "1M" | "6M" | "1Y"
  >("1Y");

  const runOptimization = () => {
    setShowAIRebalancing(true);
  };

  const handleRebalancingComplete = (recommendations: any) => {
    console.log("Rebalancing recommendations:", recommendations);
    setOptimizationData(recommendations);
    setShowAIRebalancing(false);
    setShowAIReview(true);
  };

  const handleApplyOptimization = () => {
    console.log("Applying optimization:", optimizationData);
    setShowAIReview(false);
    // Apply the recommendations to the portfolio
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAlertsModal(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
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
                    Spread Score
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {portfolioMetrics.riskScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Risk Level
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {portfolioMetrics.expectedAnnualReturn.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expected Return
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
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
                          variant="outline"
                          className={cn(
                            "text-xs",
                            stock.risk === "Low" &&
                              "bg-green-100 text-green-800 border-green-300",
                            stock.risk === "Medium" &&
                              "bg-yellow-100 text-yellow-800 border-yellow-300",
                            stock.risk === "High" &&
                              "bg-red-100 text-red-800 border-red-300",
                          )}
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
                        <div className="text-xs text-muted-foreground">
                          Target: {stock.recommendedAllocation.toFixed(1)}%
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

                    {/* Allocation Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Allocation vs Target</span>
                        <span>
                          {stock.allocation > stock.recommendedAllocation
                            ? "Overweight"
                            : stock.allocation < stock.recommendedAllocation
                              ? "Underweight"
                              : "On Target"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            stock.allocation > stock.recommendedAllocation
                              ? "bg-yellow-500"
                              : stock.allocation < stock.recommendedAllocation
                                ? "bg-blue-500"
                                : "bg-green-500",
                          )}
                          style={{
                            width: `${(stock.allocation / Math.max(stock.allocation, stock.recommendedAllocation)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          stock.changePercent >= 0
                            ? "text-success"
                            : "text-destructive",
                        )}
                      >
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>
                          {stock.change >= 0 ? "+" : ""}$
                          {stock.change.toFixed(2)} (
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                      {Math.abs(
                        stock.allocation - stock.recommendedAllocation,
                      ) > 2 && (
                        <div className="text-xs text-warning flex items-center gap-1">
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
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Sector Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Pie Chart Visualization */}
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full transform -rotate-90"
                  >
                    {(() => {
                      let cumulativePercentage = 0;
                      const colors = [
                        "#3B82F6",
                        "#10B981",
                        "#F59E0B",
                        "#EF4444",
                        "#8B5CF6",
                        "#06B6D4",
                      ];
                      return sectorAllocation.map((sector, index) => {
                        const percentage = sector.allocation;
                        const angle = (percentage / 100) * 2 * Math.PI;
                        const x1 =
                          50 +
                          40 *
                            Math.cos(
                              (2 * Math.PI * cumulativePercentage) / 100,
                            );
                        const y1 =
                          50 +
                          40 *
                            Math.sin(
                              (2 * Math.PI * cumulativePercentage) / 100,
                            );
                        cumulativePercentage += percentage;
                        const x2 =
                          50 +
                          40 *
                            Math.cos(
                              (2 * Math.PI * cumulativePercentage) / 100,
                            );
                        const y2 =
                          50 +
                          40 *
                            Math.sin(
                              (2 * Math.PI * cumulativePercentage) / 100,
                            );
                        const largeArcFlag = percentage > 50 ? 1 : 0;
                        const pathData = [
                          `M 50 50`,
                          `L ${x1} ${y1}`,
                          `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          "Z",
                        ].join(" ");
                        return (
                          <path
                            key={sector.sector}
                            d={pathData}
                            fill={colors[index % colors.length]}
                            stroke="white"
                            strokeWidth="0.5"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  {sectorAllocation.map((sector, index) => {
                    const colors = [
                      "#3B82F6",
                      "#10B981",
                      "#F59E0B",
                      "#EF4444",
                      "#8B5CF6",
                      "#06B6D4",
                    ];
                    return (
                      <div
                        key={sector.sector}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-sm"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <span className="text-sm font-medium">
                            {sector.sector}
                          </span>
                        </div>
                        <span className="text-sm font-bold">
                          {sector.allocation}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <ComparisonChart
              timeframe={comparisonTimeframe}
              onTimeframeChange={setComparisonTimeframe}
            />

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
                  <div className="text-2xl font-bold text-primary">
                    {portfolioMetrics.diversificationScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Spread Score
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <PerformanceChart />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTransactions.map((transaction) => {
                  const isPositive = transaction.type === "DIVIDEND" || transaction.type === "SELL";

                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          transaction.type === "BUY" && "bg-blue-100 text-blue-600",
                          transaction.type === "SELL" && "bg-red-100 text-red-600",
                          transaction.type === "DIVIDEND" && "bg-green-100 text-green-600"
                        )}>
                          {transaction.type === "BUY" && <TrendingUp className="h-5 w-5" />}
                          {transaction.type === "SELL" && <TrendingDown className="h-5 w-5" />}
                          {transaction.type === "DIVIDEND" && <DollarSign className="h-5 w-5" />}
                        </div>

                        <div>
                          <div className="font-semibold text-sm">
                            {transaction.type} {transaction.symbol}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.companyName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()} • {transaction.quantity} shares
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">
                          ${transaction.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${transaction.price.toFixed(2)}/share
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs mt-1",
                            transaction.status === "COMPLETED" && "bg-green-100 text-green-700",
                            transaction.status === "PENDING" && "bg-yellow-100 text-yellow-700",
                            transaction.status === "CANCELLED" && "bg-red-100 text-red-700"
                          )}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}

                <div className="text-center pt-4">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                          variant="outline"
                          className={cn(
                            "text-xs",
                            stock.risk === "Low" &&
                              "bg-green-100 text-green-800 border-green-300",
                            stock.risk === "Medium" &&
                              "bg-yellow-100 text-yellow-800 border-yellow-300",
                            stock.risk === "High" &&
                              "bg-red-100 text-red-800 border-red-300",
                          )}
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

        {/* Modals */}
        {showExportModal && (
          <ExportModal
            onClose={() => setShowExportModal(false)}
            portfolioValue={portfolioMetrics.totalValue}
            portfolioReturn={portfolioMetrics.totalReturnPercent}
          />
        )}

        {showAlertsModal && (
          <PriceAlerts onClose={() => setShowAlertsModal(false)} />
        )}

        {showAIRebalancing && (
          <AIRebalancing
            onComplete={handleRebalancingComplete}
            onClose={() => setShowAIRebalancing(false)}
          />
        )}

        {showAIReview && optimizationData && (
          <AIOptimizationReview
            data={optimizationData}
            onApply={handleApplyOptimization}
            onClose={() => setShowAIReview(false)}
          />
        )}
      </div>
    </div>
  );
}
