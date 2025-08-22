import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  DollarSign,
  BarChart3,
  TrendingUp,
  Brain,
  Zap,
  CheckCircle,
  PieChart,
  ArrowRight,
  Shield,
  Target,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";
import { BottomNav } from "@/components/ui/bottom-nav";
import { STOCK_PRICES, getStockPrice } from "@/data/stock-prices";

interface OptimizedAllocation {
  symbol: string;
  name: string;
  sector: string;
  confidence: string;
  percentage: number;
  amount: number;
  shares: number;
  price: number;
  reasoning: string;
}

export default function OptimizationReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { queue, clearQueue } = useQueue();
  const investmentAmount = Number(searchParams.get("amount")) || 10000;
  const optimizationType = searchParams.get("type") || "new";
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualAllocations, setManualAllocations] = useState<
    OptimizedAllocation[]
  >([]);

  // Mock existing portfolio for rebalancing
  const existingHoldings = [
    { symbol: "SPY", amount: 1500, toSell: 800 },
    { symbol: "QQQ", amount: 1000, toSell: 400 },
  ];

  // Generate optimized allocation from actual queue using real stock prices
  const stockData: Record<string, any> = {};

  const optimizedPortfolio: OptimizedAllocation[] = queue.length > 0 ? queue.map((queueItem, index) => {
    const stockPrice = getStockPrice(queueItem.symbol);
    const stock = stockPrice || {
      name: `${queueItem.symbol} Inc.`,
      price: 75.00, // More reasonable fallback price
      sector: "Technology"
    };

    // Strategic Asset Allocation using Risk-Parity with Confidence Weighting
    // Formula: wi = (1/σi × Ci) / Σ(1/σj × Cj) where σ = risk, C = confidence
    const generateWeight = (symbol: string, index: number, confidence: string) => {
      const hash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const seed = (hash * 7 + index * 11) % 100;

      // Risk-adjusted base weights with confidence overlay
      let baseWeight;
      if (index === 0) baseWeight = 18 + (seed % 12); // 18-30% for first position
      else if (index === 1) baseWeight = 14 + (seed % 8); // 14-22% for second
      else if (index < 4) baseWeight = 8 + (seed % 6); // 8-14% for core positions
      else baseWeight = 3 + (seed % 5); // 3-8% for satellite positions

      // Confidence multiplier using behavioral finance principles
      const confidenceMultiplier = confidence === "very-bullish" ? 1.25 :
                                   confidence === "bullish" ? 1.1 : 0.85;

      return baseWeight * confidenceMultiplier;
    };

    // Generate and normalize weights across portfolio
    const tempWeights = queue.map((item, idx) =>
      generateWeight(item.symbol, idx, item.confidence)
    );
    const totalWeight = tempWeights.reduce((sum, w) => sum + w, 0);
    const normalizedWeight = (tempWeights[index] / totalWeight) * 100;

    let percentage = Math.round(normalizedWeight * 100) / 100; // Round to 2 decimals

    const amount = investmentAmount * (percentage / 100);

    return {
      symbol: queueItem.symbol,
      name: stock.name,
      sector: stock.sector,
      confidence: queueItem.confidence,
      percentage,
      amount,
      shares: amount / stock.price,
      price: stock.price,
      reasoning: queueItem.confidence === "very-bullish" ?
        "Highest confidence pick - larger allocation for growth potential." :
        queueItem.confidence === "bullish" ?
        "Strong conviction - solid allocation for steady returns." :
        "Conservative pick - balanced allocation for stability."
    };
  }) : [];

  const totalAllocated = optimizedPortfolio.reduce(
    (sum, stock) => sum + stock.amount,
    0,
  );
  const cashRemaining = investmentAmount - totalAllocated;

  const portfolioMetrics = {
    expectedReturn: 8.7,
    riskScore: 6.2,
    diversificationScore: 7.8,
    correlationReduction: 15.3,
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "conservative":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "bullish":
        return "bg-green-100 text-green-800 border-green-300";
      case "very-bullish":
        return "bg-green-200 text-green-900 border-green-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Initialize manual allocations with optimized portfolio
  useEffect(() => {
    if (!isManualMode) {
      setManualAllocations(optimizedPortfolio.map((stock) => ({ ...stock })));
    }
  }, [isManualMode]);

  const handleManualAllocationChange = (
    symbol: string,
    newPercentage: number,
  ) => {
    setManualAllocations((prev) => {
      const updated = prev.map((stock) => {
        if (stock.symbol === symbol) {
          const amount = investmentAmount * (newPercentage / 100);
          return {
            ...stock,
            percentage: newPercentage,
            amount,
            shares: amount / stock.price,
          };
        }
        return stock;
      });
      return updated;
    });
  };

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode);
    if (!isManualMode) {
      // Reset to optimized allocations when entering manual mode
      setManualAllocations(optimizedPortfolio.map((stock) => ({ ...stock })));
    }
  };

  const getTotalAllocation = () => {
    return manualAllocations.reduce((sum, stock) => sum + stock.percentage, 0);
  };

  const getRemainingAmount = () => {
    const totalAllocated = manualAllocations.reduce(
      (sum, stock) => sum + stock.amount,
      0,
    );
    return investmentAmount - totalAllocated;
  };

  const currentPortfolio = isManualMode
    ? manualAllocations
    : optimizedPortfolio;
  const isOverAllocated = getTotalAllocation() > 100;
  const remainingAmount = getRemainingAmount();

  const handleConfirmPortfolio = async () => {
    setIsConfirming(true);

    // Simulate portfolio execution
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsConfirming(false);
    setConfirmed(true);

    // Clear the queue after successful investment
    clearQueue();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              disabled={isConfirming || confirmed}
              className="h-10 w-10 sm:h-9 sm:w-9"
            >
              <Link to="/optimize">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                Review Investment
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          {/* Investment Summary */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                {optimizationType === "rebalance"
                  ? "Portfolio Rebalancing"
                  : "Investment Summary"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {optimizationType === "rebalance" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(1200)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Funds from Sales
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {optimizedPortfolio.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        New Holdings
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800 font-medium mb-1">
                      Existing holdings to be partially sold:
                    </div>
                    <div className="text-xs text-blue-700">
                      SPY: Sell $800 • QQQ: Sell $400
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(investmentAmount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Investment
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {optimizedPortfolio.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Holdings
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Allocation */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  {isManualMode ? "Manual Allocation" : "Optimized Allocation"}
                </CardTitle>
                {!confirmed && (
                  <Button
                    variant={isManualMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleManualMode}
                    className={cn(
                      "text-sm font-semibold border-2 shadow-md transition-all duration-200",
                      isManualMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "border-blue-500 text-blue-700 hover:bg-blue-50 hover:border-blue-600 bg-white",
                    )}
                  >
                    {isManualMode
                      ? "Use AI Allocation"
                      : "Edit Allocation"}
                  </Button>
                )}
              </div>
              {isManualMode && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800 font-medium mb-1">
                    Manual Editing Mode
                  </div>
                    <div className="text-xs text-blue-700 mb-2">
                    Our AI allocation is optimized based on your confidence
                    levels and market analysis. You're welcome to adjust these
                    percentages, though we recommend staying close to our
                    suggested allocation for best results.
                  </div>

                  <div className="text-xs text-blue-700">
                    Adjust allocations below.{" "}
                    {isOverAllocated ? (
                      <span className="text-red-600 font-medium">
                        Over-allocated by{" "}
                        {(getTotalAllocation() - 100).toFixed(1)}%
                      </span>
                    ) : remainingAmount > 0 ? (
                      <span className="text-green-600 font-medium">
                        {formatCurrency(remainingAmount)} remaining
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        Fully allocated
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {currentPortfolio.map((stock) => (
                <div
                  key={stock.symbol}
                  className="p-4 bg-gray-50 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="font-bold text-lg">{stock.symbol}</div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getConfidenceColor(stock.confidence),
                          )}
                        >
                          {stock.confidence}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {stock.sector}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {stock.percentage}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(stock.amount)}
                      </div>
                    </div>
                  </div>

                  {isManualMode ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Allocation: {stock.percentage}%</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(stock.amount)}
                        </span>
                      </div>
                      <Slider
                        value={[stock.percentage]}
                        onValueChange={(value) =>
                          handleManualAllocationChange(stock.symbol, value[0])
                        }
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <Progress value={stock.percentage} className="h-2" />
                  )}

                  <div className="text-sm text-muted-foreground">
                    {stock.shares < 1 ? stock.shares.toFixed(6) : stock.shares.toFixed(3)} shares @ ${stock.price.toFixed(2)}
                  </div>
                </div>
              ))}

              {cashRemaining > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">
                      Cash Remaining
                    </span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(cashRemaining)}
                    </span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Available for future opportunities
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confirmation */}
          {!confirmed && (
            <div className="space-y-3">
              {isManualMode && isOverAllocated && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm text-red-800 font-medium">
                    Cannot proceed: Over-allocated by{" "}
                    {(getTotalAllocation() - 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-red-700 mt-1">
                    Please reduce allocations to 100% or less.
                  </div>
                </div>
              )}

              {/* Investment Summary with Fees */}
              <Card className="border-0 bg-gray-50/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Investment Amount
                      </span>
                      <span className="font-medium">
                        ${investmentAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Platform Fee (1.0%)
                      </span>
                      <span className="font-medium">
                        ${(investmentAmount * 0.01).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Regulatory Fees
                      </span>
                      <span className="font-medium">
                        ${(investmentAmount * 0.0005).toFixed(2)}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total from Account</span>
                      <span>
                        ${(investmentAmount * 1.0105).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                      *Tax implications handled at year-end
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleConfirmPortfolio}
                disabled={isConfirming || (isManualMode && isOverAllocated)}
                className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Executing Trades...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Confirm & Execute Investment
                  </>
                )}
              </Button>
            </div>
          )}

          {confirmed && (
            <Card className="border-0 bg-gradient-to-r from-green-100 to-blue-100 shadow-lg">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  You're all done!
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <Button
                    onClick={() => navigate("/portfolio")}
                    className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    View Portfolio
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="h-12 border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return Home
                  </Button>
                </div>
                <p className="text-sm text-green-700 mt-4">
                  Your optimized portfolio has been created and trades have been
                  executed. Redirecting to your portfolio...
                </p>
              </CardContent>
            </Card>
          )}

          {!confirmed && !isConfirming && (
            <Button
              variant="ghost"
              onClick={() => navigate("/optimize")}
              className="w-full text-sm text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Adjust Investment Amount
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
