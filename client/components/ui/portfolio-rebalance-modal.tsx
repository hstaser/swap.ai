import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  PieChart,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioStock {
  symbol: string;
  name: string;
  currentAllocation: number;
  recommendedAllocation: number;
  currentValue: number;
  recommendedValue: number;
  sector: string;
  change: number;
}

interface RebalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PortfolioRebalanceModal({
  isOpen,
  onClose,
  onConfirm,
}: RebalanceModalProps) {
  const [step, setStep] = useState<"analysis" | "confirmation">("analysis");

  // Mock current portfolio vs optimized allocation
  const portfolioComparison: PortfolioStock[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      currentAllocation: 22.5,
      recommendedAllocation: 18.0,
      currentValue: 3870.85,
      recommendedValue: 3096.68,
      sector: "Technology",
      change: -4.5,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      currentAllocation: 18.2,
      recommendedAllocation: 16.0,
      currentValue: 3130.48,
      recommendedValue: 2752.42,
      sector: "Technology",
      change: -2.2,
    },
    {
      symbol: "SPY",
      name: "SPDR S&P 500 ETF",
      currentAllocation: 15.0,
      recommendedAllocation: 25.0,
      currentValue: 2580.23,
      recommendedValue: 4300.38,
      sector: "ETF",
      change: +10.0,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      currentAllocation: 12.8,
      recommendedAllocation: 8.0,
      currentValue: 2201.8,
      recommendedValue: 1376.12,
      sector: "Technology",
      change: -4.8,
    },
    {
      symbol: "QQQ",
      name: "Invesco QQQ Trust",
      currentAllocation: 8.5,
      recommendedAllocation: 12.0,
      currentValue: 1462.13,
      recommendedValue: 2064.18,
      sector: "ETF",
      change: +3.5,
    },
    {
      symbol: "VTI",
      name: "Vanguard Total Stock Market",
      currentAllocation: 5.0,
      recommendedAllocation: 15.0,
      currentValue: 860.12,
      recommendedValue: 2580.36,
      sector: "ETF",
      change: +10.0,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      currentAllocation: 18.0,
      recommendedAllocation: 6.0,
      currentValue: 3096.68,
      recommendedValue: 1032.22,
      sector: "Consumer Discretionary",
      change: -12.0,
    },
  ];

  const totalValue = 17201.53;
  const projectedReturn = 12.4; // vs current 8.9%
  const riskReduction = 15.2; // percentage
  const diversificationImprovement = 23.8; // percentage

  const getSectorAllocations = (isRecommended: boolean) => {
    const sectors: { [key: string]: number } = {};
    portfolioComparison.forEach((stock) => {
      const allocation = isRecommended
        ? stock.recommendedAllocation
        : stock.currentAllocation;
      sectors[stock.sector] = (sectors[stock.sector] || 0) + allocation;
    });
    return Object.entries(sectors).map(([sector, allocation]) => ({
      sector,
      allocation,
    }));
  };

  const currentSectors = getSectorAllocations(false);
  const recommendedSectors = getSectorAllocations(true);

  const getSectorColor = (sector: string) => {
    const colors: { [key: string]: string } = {
      Technology: "bg-blue-500",
      ETF: "bg-green-500",
      "Consumer Discretionary": "bg-purple-500",
      Healthcare: "bg-red-500",
      "Financial Services": "bg-yellow-500",
      Energy: "bg-orange-500",
    };
    return colors[sector] || "bg-gray-500";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                Portfolio Rebalancing Analysis
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                AI-optimized allocation recommendations for better risk-adjusted
                returns
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "analysis" && (
            <>
              {/* Key Metrics Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">
                      +{projectedReturn - 8.9}%
                    </div>
                    <div className="text-sm text-green-600">
                      Expected Annual Return
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      From 8.9% to {projectedReturn}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-700">
                      -{riskReduction}%
                    </div>
                    <div className="text-sm text-blue-600">Risk Reduction</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Lower portfolio volatility
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-700">
                      +{diversificationImprovement}%
                    </div>
                    <div className="text-sm text-purple-600">
                      Diversification
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Better sector balance
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sector Allocation Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Current Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentSectors.map(({ sector, allocation }) => (
                      <div key={sector} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{sector}</span>
                          <span className="font-medium">
                            {allocation.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              getSectorColor(sector),
                            )}
                            style={{ width: `${allocation}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Recommended Allocation
                      <Badge className="bg-green-100 text-green-700">
                        Optimized
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recommendedSectors.map(({ sector, allocation }) => (
                      <div key={sector} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{sector}</span>
                          <span className="font-medium">
                            {allocation.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              getSectorColor(sector),
                            )}
                            style={{ width: `${allocation}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Individual Stock Changes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Individual Holdings Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {portfolioComparison.map((stock) => (
                      <div
                        key={stock.symbol}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-gray-600">
                              {stock.name}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {stock.currentAllocation.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              ${stock.currentValue.toLocaleString()}
                            </div>
                          </div>

                          <ArrowRight
                            className={cn(
                              "h-4 w-4",
                              stock.change > 0
                                ? "text-green-600"
                                : stock.change < 0
                                  ? "text-red-600"
                                  : "text-gray-400",
                            )}
                          />

                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {stock.recommendedAllocation.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              ${stock.recommendedValue.toLocaleString()}
                            </div>
                          </div>

                          <Badge
                            variant="outline"
                            className={cn(
                              "min-w-[60px] justify-center",
                              stock.change > 0 &&
                                "bg-green-50 text-green-700 border-green-300",
                              stock.change < 0 &&
                                "bg-red-50 text-red-700 border-red-300",
                              stock.change === 0 &&
                                "bg-gray-50 text-gray-700 border-gray-300",
                            )}
                          >
                            {stock.change > 0 ? "+" : ""}
                            {stock.change.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Save recommendations for later
                      onClose();
                    }}
                  >
                    Save for Later
                  </Button>
                  <Button
                    onClick={() => setStep("confirmation")}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Proceed with Rebalancing
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === "confirmation" && (
            <>
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <h2 className="text-2xl font-bold">Confirm Rebalancing</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  This will execute trades to rebalance your portfolio according
                  to the AI recommendations. The process may take a few minutes.
                </p>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Important Notice
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        This will trigger market orders during trading hours.
                        Trades may be subject to market volatility and execution
                        delays.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={() => setStep("analysis")}>
                  Back to Analysis
                </Button>
                <Button
                  onClick={onConfirm}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Rebalancing
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
