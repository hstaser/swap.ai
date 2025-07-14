import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  DollarSign,
  BarChart3,
  TrendingUp,
  Brain,
  Zap,
  Calculator,
  PieChart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function PortfolioOptimize() {
  const navigate = useNavigate();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [optimizationType, setOptimizationType] = useState<"new" | "rebalance">(
    "new",
  );

  // Mock queued stocks count and existing portfolio
  const queuedStocksCount = 3;
  const existingPortfolioValue = 2500; // Mock existing portfolio value

  const presetAmounts = [
    { label: "$100", value: "100", popular: false },
    { label: "$250", value: "250", popular: true },
    { label: "$500", value: "500", popular: true },
    { label: "$750", value: "750", popular: false },
    { label: "$1,000", value: "1000", popular: true },
  ];

  const handlePresetSelect = (value: string) => {
    if (selectedPreset === value) {
      // Deselect if clicking the same preset
      setInvestmentAmount("");
      setSelectedPreset(null);
    } else {
      setInvestmentAmount(value);
      setSelectedPreset(value);
    }
  };

  const handleOptimize = () => {
    if (
      optimizationType === "new" &&
      (!investmentAmount || Number(investmentAmount) < 100)
    ) {
      alert("Please enter a minimum investment amount of $100");
      return;
    }

    // Navigate to optimization review with the amount and type
    const params = new URLSearchParams();
    if (optimizationType === "new") {
      params.set("amount", investmentAmount);
    }
    params.set("type", optimizationType);
    navigate(`/optimize/review?${params.toString()}`);
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "";
    const num = Number(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/queue/review">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Set Investment Amount
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Queue Summary */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-lg">
                    Ready to Optimize
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Choose how much to invest and we'll optimize the allocation of
                  your{" "}
                  <Badge variant="outline" className="mx-1">
                    {queuedStocksCount} queued stocks
                  </Badge>
                  then execute the trades.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Type */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Optimization Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOptimizationType("new")}
                  className={cn(
                    "h-auto p-4 text-left justify-start",
                    optimizationType === "new" &&
                      "bg-blue-50 border-blue-300 text-blue-700",
                  )}
                >
                  <div className="flex-1">
                    <div className="font-semibold">Invest New Money</div>
                    <div className="text-sm opacity-80 mt-1">
                      Use fresh funds to buy these stocks with optimal
                      allocation
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOptimizationType("rebalance")}
                  className={cn(
                    "h-auto p-4 text-left justify-start",
                    optimizationType === "rebalance" &&
                      "bg-purple-50 border-purple-300 text-purple-700",
                  )}
                >
                  <div className="flex-1">
                    <div className="font-semibold">Rebalance & Invest</div>
                    <div className="text-sm opacity-80 mt-1">
                      Sell some current holdings to buy these new stocks ($
                      {existingPortfolioValue.toLocaleString()} portfolio)
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Investment Amount Input */}
          {optimizationType === "new" && (
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Investment Amount
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    How much would you like to invest?
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => {
                        setInvestmentAmount(e.target.value);
                        setSelectedPreset(null);
                      }}
                      placeholder="0"
                      className="pl-10 h-12 text-lg"
                      min="100"
                      step="100"
                    />
                  </div>
                  {investmentAmount && (
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(investmentAmount)}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Preset Amounts */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Quick Select</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {presetAmounts.map((preset) => (
                      <Button
                        key={preset.value}
                        variant="outline"
                        onClick={() => handlePresetSelect(preset.value)}
                        className={cn(
                          "h-12 relative",
                          selectedPreset === preset.value &&
                            "bg-blue-50 border-blue-300 text-blue-700",
                          preset.popular &&
                            "ring-1 ring-green-300 border-green-300",
                        )}
                      >
                        {preset.label}
                        {preset.popular && (
                          <Badge
                            variant="secondary"
                            className="absolute -top-2 -right-2 text-xs bg-green-100 text-green-700 border-green-300"
                          >
                            Popular
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Optimization Preview */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Optimization Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium">Risk-Adjusted</div>
                  <div className="text-xs text-muted-foreground">
                    Returns optimization
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Calculator className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm font-medium">Diversification</div>
                  <div className="text-xs text-muted-foreground">
                    Correlation analysis
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Our AI will analyze correlation patterns, risk metrics, and
                market volatility to create your optimal allocation.
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            onClick={handleOptimize}
            disabled={
              optimizationType === "new" &&
              (!investmentAmount || Number(investmentAmount) < 100)
            }
            className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            {optimizationType === "new"
              ? "Create Smart Portfolio"
              : "Rebalance Portfolio"}
          </Button>

          {optimizationType === "new" &&
            Number(investmentAmount) > 0 &&
            Number(investmentAmount) < 100 && (
              <p className="text-center text-sm text-red-600">
                Minimum investment amount is $100
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
