import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Brain,
  TrendingUp,
  Shield,
  Target,
  CheckCircle,
  RefreshCw,
  Zap,
  Activity,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIRebalancingProps {
  onComplete: (recommendations: any) => void;
  onClose: () => void;
}

interface RebalanceStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: number;
  completed: boolean;
}

const rebalancingSteps: RebalanceStep[] = [
  {
    id: "analyze",
    title: "Analyzing Portfolio",
    description: "Scanning your holdings and market data",
    icon: Brain,
    duration: 2000,
    completed: false,
  },
  {
    id: "market",
    title: "Market Intelligence",
    description: "Processing real-time market conditions",
    icon: Activity,
    duration: 1500,
    completed: false,
  },
  {
    id: "risk",
    title: "Risk Assessment",
    description: "Evaluating your risk profile and goals",
    icon: Shield,
    duration: 1800,
    completed: false,
  },
  {
    id: "optimize",
    title: "Smart Optimization",
    description: "Finding the best allocation strategy",
    icon: Target,
    duration: 2200,
    completed: false,
  },
  {
    id: "generate",
    title: "Creating Recommendations",
    description: "Finalizing your personalized plan",
    icon: Sparkles,
    duration: 1000,
    completed: false,
  },
];

export function AIRebalancing({ onComplete, onClose }: AIRebalancingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [steps, setSteps] = useState(rebalancingSteps);

  useEffect(() => {
    if (currentStep < steps.length && !isComplete) {
      const step = steps[currentStep];
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) =>
            i === currentStep ? { ...s, completed: true } : s,
          ),
        );

        if (currentStep === steps.length - 1) {
          setShowConfirmation(true);
          setProgress(100);
        } else {
          setCurrentStep(currentStep + 1);
          setProgress(((currentStep + 1) / steps.length) * 100);
        }
      }, step.duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length, isComplete]);

  const currentStepData = steps[currentStep];
  const Icon = currentStepData?.icon || Sparkles;

  const recommendations = {
    adjustments: [
      {
        symbol: "AAPL",
        action: "Reduce by 3.5%",
        reason: "Overweight position",
      },
      {
        symbol: "NVDA",
        action: "Increase by 2.1%",
        reason: "Growth opportunity",
      },
      {
        symbol: "JNJ",
        action: "Increase by 1.4%",
        reason: "Better diversification",
      },
    ],
    correlationReduction: "15.3%",
    riskReduction: "12.4%",
    diversificationImprovement: "22.7%",
  };

  if (showConfirmation && !isComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-lg bg-white">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Review Portfolio Changes
                </h3>
                <p className="text-muted-foreground">
                  Please review these AI recommendations before executing
                </p>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <h4 className="font-semibold mb-3">Recommended Adjustments:</h4>
                <div className="space-y-3">
                  {recommendations.adjustments.map((adj, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{adj.symbol}</div>
                        <div className="text-sm text-muted-foreground">{adj.reason}</div>
                      </div>
                      <div className={cn(
                        "font-semibold",
                        adj.action.includes("Increase") ? "text-green-600" : "text-orange-600"
                      )}>
                        {adj.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Expected Improvements:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reduced Asset Correlation:</span>
                    <span className="font-semibold text-green-600">
                      -{recommendations.correlationReduction}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Decreased Overall Risk:</span>
                    <span className="font-semibold text-blue-600">
                      -{recommendations.riskReduction}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Improved Diversification:</span>
                    <span className="font-semibold text-primary">
                      +{recommendations.diversificationImprovement}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => onComplete(recommendations)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Execute Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsComplete(false)}
                className="w-full"
              >
                Back to Optimize
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white overflow-hidden">
        <CardContent className="p-0">
          {/* Animated Background */}
          <div className="relative h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Icon className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-4 border-2 border-white/30 rounded-full animate-spin" />
                <div className="absolute -inset-8 border border-white/20 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Current Step */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">{currentStepData?.title}</h3>
              <p className="text-muted-foreground text-sm">
                {currentStepData?.description}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = step.completed;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-all",
                      isActive && "bg-blue-50 border border-blue-200",
                      isCompleted && "bg-green-50 border border-green-200",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-gray-200 text-gray-500",
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={cn(
                          "font-medium text-sm",
                          isActive && "text-blue-700",
                          isCompleted && "text-green-700",
                        )}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                    {isActive && (
                      <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  AI Insight
                </span>
              </div>
              <p className="text-xs text-purple-700">
                {currentStep === 0 &&
                  "Identifying overweight positions and correlation inefficiencies..."}
                {currentStep === 1 &&
                  "Analyzing 50,000+ data points from global markets..."}
                {currentStep === 2 &&
                  "Your risk tolerance suggests a balanced growth approach..."}
                {currentStep === 3 &&
                  "Found 3 optimization opportunities to reduce portfolio risk..."}
                {currentStep === 4 &&
                  "Generating personalized recommendations based on your goals..."}
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-sm"
              disabled={currentStep < 2}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
