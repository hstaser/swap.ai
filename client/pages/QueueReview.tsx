import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Trash2,
  Plus,
  Zap,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useQueue } from "@/hooks/use-queue";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/ui/auth-modal";

interface QueuedStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  confidence: string;
  confidenceLabel: string;
  addedAt: Date;
}

export default function QueueReview() {
  const navigate = useNavigate();
  const { queue, removeFromQueue, clearQueue } = useQueue();
  const { authStatus, saveGuestDataAndSignOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewMode, setViewMode] = useState<"marginal" | "net">("marginal");

  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      // Component cleanup
    };
  }, []);

  // Mock existing portfolio
  const existingPortfolio = [
    { symbol: "SPY", name: "SPDR S&P 500 ETF", amount: 1500, shares: 3.2 },
    { symbol: "QQQ", name: "Invesco QQQ Trust", amount: 1000, shares: 2.8 },
  ];

  // Convert queue to display format with mock stock data
  const queuedStocks = queue.map((item) => {
    // Mock stock data - in real app this would be fetched
    const stockData: Record<string, any> = {
      AAPL: {
        name: "Apple Inc.",
        price: 182.52,
        change: 2.31,
        changePercent: 1.28,
        sector: "Technology",
      },
      NVDA: {
        name: "NVIDIA Corporation",
        price: 722.48,
        change: 12.66,
        changePercent: 1.78,
        sector: "Technology",
      },
      MSFT: {
        name: "Microsoft Corporation",
        price: 378.85,
        change: -1.52,
        changePercent: -0.4,
        sector: "Technology",
      },
      RIVN: {
        name: "Rivian Automotive, Inc.",
        price: 24.67,
        change: -1.23,
        changePercent: -4.75,
        sector: "Consumer Discretionary",
      },
      COIN: {
        name: "Coinbase Global, Inc.",
        price: 156.78,
        change: 8.45,
        changePercent: 5.69,
        sector: "Financial Services",
      },
    };

    const stock = stockData[item.symbol] || {
      name: `${item.symbol} Inc.`,
      price: 100,
      change: 0,
      changePercent: 0,
      sector: "Technology",
    };

    return {
      symbol: item.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      sector: stock.sector,
      confidence: item.confidence,
      confidenceLabel:
        item.confidence === "conservative"
          ? "Conservative"
          : item.confidence === "bullish"
            ? "Bullish"
            : "Very Bullish",
      addedAt: item.addedAt,
    };
  });

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

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes}m ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-10 w-10 sm:h-9 sm:w-9"
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  Review Your Queue
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant={viewMode === "marginal" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("marginal")}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Queue Only</span>
                <span className="sm:hidden">Queue</span>
              </Button>
              <Button
                variant={viewMode === "net" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("net")}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Net Portfolio</span>
                <span className="sm:hidden">Net</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          {/* Session Summary */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {viewMode === "marginal"
                      ? queuedStocks.length
                      : queuedStocks.length + existingPortfolio.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {viewMode === "marginal"
                      ? "Stocks Queued"
                      : "Total Holdings"}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {viewMode === "marginal"
                      ? queuedStocks.filter((s) => s.change > 0).length
                      : queuedStocks.filter((s) => s.change > 0).length +
                        existingPortfolio.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {viewMode === "marginal" ? "Gainers" : "Positive Holdings"}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {viewMode === "marginal"
                      ? new Set(queuedStocks.map((s) => s.sector)).size
                      : new Set([...queuedStocks.map((s) => s.sector), "ETF"])
                          .size}
                  </div>
                  <div className="text-sm text-muted-foreground">Sectors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queued Stocks */}
          {queuedStocks.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {viewMode === "marginal"
                  ? "Your Queued Stocks"
                  : "Your Complete Portfolio (Preview)"}
              </h2>

              {/* Show existing portfolio in net view */}
              {viewMode === "net" && (
                <div className="space-y-3">
                  <h3 className="text-md font-medium text-muted-foreground">
                    Current Holdings
                  </h3>
                  {existingPortfolio.map((stock) => (
                    <Card
                      key={stock.symbol}
                      className="border-0 bg-blue-50 backdrop-blur-sm shadow-sm"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div className="font-bold text-sm">
                                {stock.symbol}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Current
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {stock.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {stock.shares} shares
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">
                              ${stock.amount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <h3 className="text-md font-medium text-muted-foreground mt-6">
                    Adding to Portfolio
                  </h3>
                </div>
              )}

              {queuedStocks.map((stock) => {
                const isPositive = stock.change >= 0;

                return (
                  <Card
                    key={stock.symbol}
                    className="border-0 bg-white/90 backdrop-blur-sm shadow-lg"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-lg">
                              {stock.symbol}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimeAgo(stock.addedAt)}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {stock.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {stock.sector}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  getConfidenceColor(stock.confidence),
                                )}
                              >
                                {stock.confidenceLabel}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-1 text-sm font-medium",
                              isPositive ? "text-success" : "text-destructive",
                            )}
                          >
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>
                              {isPositive ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromQueue(stock.symbol)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No stocks in queue
                  </h3>
                  <p className="text-sm">
                    Start browsing stocks to add them to your queue.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Investment Summary */}
          {queuedStocks.length > 0 && (
            <Card className="border-0 bg-gray-50/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Est. Investment
                    </span>
                    <span className="font-medium">
                      $
                      {queuedStocks
                        .reduce((sum, stock) => sum + stock.price * 10, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Processing & Platform
                    </span>
                    <span className="font-medium">
                      $
                      {(
                        queuedStocks.reduce(
                          (sum, stock) => sum + stock.price * 10,
                          0,
                        ) * 0.005
                      ).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span>
                      $
                      {(
                        queuedStocks.reduce(
                          (sum, stock) => sum + stock.price * 10,
                          0,
                        ) * 1.005
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {queuedStocks.length > 0 && (
              <Button
                onClick={() => {
                  if (authStatus === "guest") {
                    setShowAuthModal(true);
                  } else {
                    navigate("/optimize");
                  }
                }}
                className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <Zap className="h-4 w-4 mr-2" />
                Finalize & Invest Now
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full h-12 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Continue Browsing Stocks
            </Button>

            {queuedStocks.length > 0 && (
              <Button
                variant="ghost"
                onClick={clearQueue}
                className="w-full text-sm text-muted-foreground hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All from Queue
              </Button>
            )}
          </div>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal
            title="Sign in to Invest"
            subtitle="Create an account or sign in to proceed with your investment"
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
