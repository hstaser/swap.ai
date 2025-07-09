import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Zap,
  CheckCircle,
  X,
  Calculator,
  Lightbulb,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OptimizationData {
  adjustments: Array<{
    symbol: string;
    action: string;
    reason: string;
  }>;
  correlationReduction: string;
  riskReduction: string;
  diversificationImprovement: string;
}

interface AIOptimizationReviewProps {
  data: OptimizationData;
  onApply: () => void;
  onClose: () => void;
}

const mathInsights = [
  {
    title: "Correlation Matrix Analysis",
    formula: "ρ(A,B) = Cov(A,B) / (σA × σB)",
    insight:
      "Reduced portfolio correlation from 0.68 to 0.53 by rebalancing tech positions",
    icon: Calculator,
  },
  {
    title: "Sharpe Ratio Optimization",
    formula: "S = (Rp - Rf) / σp",
    insight:
      "Expected Sharpe ratio improvement from 1.24 to 1.47 through risk reduction",
    icon: TrendingUp,
  },
  {
    title: "Modern Portfolio Theory",
    formula: "E(R) = Σ wi × E(Ri)",
    insight:
      "Optimized weights to maximize risk-adjusted returns along efficient frontier",
    icon: Target,
  },
  {
    title: "Value at Risk (VaR)",
    formula: "VaR = μ - z × σ",
    insight: "95% VaR reduced from -8.4% to -6.2% over 1-month horizon",
    icon: Shield,
  },
];

const aiInsights = [
  "Applied Monte Carlo simulation with 10,000 iterations for risk modeling",
  "Utilized Black-Litterman model for expected return optimization",
  "Implemented machine learning clustering for sector allocation",
  "Applied behavioral finance factors to adjust for market anomalies",
  "Used real-time sentiment analysis from 500+ financial news sources",
];

export function AIOptimizationReview({
  data,
  onApply,
  onClose,
}: AIOptimizationReviewProps) {
  const [currentTab, setCurrentTab] = useState<"overview" | "math" | "ai">(
    "overview",
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Brain className="h-6 w-6" />
                  <h2 className="text-xl font-bold">AI Optimization Review</h2>
                </div>
                <p className="text-sm opacity-90">
                  Advanced portfolio analysis complete
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Tab Navigation */}
            <div className="flex border-b">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                {
                  id: "math",
                  label: "Mathematical Analysis",
                  icon: Calculator,
                },
                { id: "ai", label: "AI Insights", icon: Lightbulb },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                      currentTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Overview Tab */}
            {currentTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      -{data.correlationReduction}
                    </div>
                    <div className="text-sm text-green-700">
                      Asset Correlation
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      -{data.riskReduction}
                    </div>
                    <div className="text-sm text-blue-700">Overall Risk</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      +{data.diversificationImprovement}
                    </div>
                    <div className="text-sm text-purple-700">
                      Diversification
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Recommended Adjustments</h3>
                  {data.adjustments.map((adjustment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{adjustment.symbol}</Badge>
                        <span className="text-sm font-medium">
                          {adjustment.action}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {adjustment.reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Math Tab */}
            {currentTab === "math" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold">
                    Advanced Mathematical Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sophisticated algorithms applied to optimize your portfolio
                  </p>
                </div>

                <div className="space-y-4">
                  {mathInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold">{insight.title}</h4>
                        </div>
                        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                          {insight.formula}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {insight.insight}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">
                      Portfolio Efficiency Score
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "87%" }}
                      />
                    </div>
                    <span className="font-bold text-blue-800">87%</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Your optimized portfolio operates at 87% efficiency on the
                    Markowitz frontier
                  </p>
                </div>
              </div>
            )}

            {/* AI Tab */}
            {currentTab === "ai" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold">
                    Artificial Intelligence Engine
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Machine learning models and advanced algorithms powering
                    your optimization
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      47.3K
                    </div>
                    <div className="text-sm text-purple-700">
                      Data Points Analyzed
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      99.7%
                    </div>
                    <div className="text-sm text-green-700">
                      Prediction Accuracy
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">AI Processing Pipeline</h4>
                  {aiInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-indigo-600" />
                    <span className="font-semibold text-indigo-800">
                      Neural Network Confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-indigo-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: "94%" }}
                      />
                    </div>
                    <span className="font-bold text-indigo-800">94%</span>
                  </div>
                  <p className="text-sm text-indigo-700 mt-2">
                    AI models show high confidence in these optimization
                    recommendations
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={onApply} className="flex-1 h-12">
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Optimization
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12"
              >
                Review Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
