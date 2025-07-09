import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  investmentExperience: string;
  riskTolerance: number;
  investmentGoal: string;
  timeHorizon: string;
  monthlyInvestment: number;
  targetReturn: number;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const defaultData: OnboardingData = {
  firstName: "",
  lastName: "",
  email: "",
  investmentExperience: "",
  riskTolerance: 5,
  investmentGoal: "",
  timeHorizon: "",
  monthlyInvestment: 500,
  targetReturn: 8,
};

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultData);

  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return data.firstName && data.lastName && data.email;
      case 1:
        return data.investmentExperience;
      case 2:
        return data.investmentGoal;
      case 3:
        return data.timeHorizon;
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const getRiskLabel = (risk: number) => {
    if (risk <= 3) return "Conservative";
    if (risk <= 6) return "Moderate";
    if (risk <= 8) return "Aggressive";
    return "Very Aggressive";
  };

  const steps = [
    {
      title: "Welcome to swap.ai",
      subtitle: "Let's personalize your investment experience",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={data.firstName}
                onChange={(e) => updateData({ firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={data.lastName}
                onChange={(e) => updateData({ lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="john.doe@example.com"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Investment Experience",
      subtitle: "Help us understand your background",
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <Label>What's your investment experience?</Label>
          <div className="space-y-3">
            {[
              { value: "beginner", label: "Beginner (Less than 1 year)" },
              { value: "intermediate", label: "Intermediate (1-5 years)" },
              { value: "experienced", label: "Experienced (5+ years)" },
              { value: "expert", label: "Expert (10+ years)" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  updateData({ investmentExperience: option.value })
                }
                className={cn(
                  "w-full p-4 text-left border-2 rounded-lg transition-colors",
                  data.investmentExperience === option.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Investment Goals",
      subtitle: "What are you investing for?",
      icon: Target,
      content: (
        <div className="space-y-4">
          <Label>Primary investment goal</Label>
          <div className="space-y-3">
            {[
              { value: "growth", label: "Long-term Growth" },
              { value: "income", label: "Regular Income" },
              { value: "retirement", label: "Retirement Planning" },
              { value: "house", label: "Buying a House" },
              { value: "education", label: "Education Fund" },
              { value: "emergency", label: "Emergency Fund" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateData({ investmentGoal: option.value })}
                className={cn(
                  "w-full p-4 text-left border-2 rounded-lg transition-colors",
                  data.investmentGoal === option.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Risk & Timeline",
      subtitle: "Let's set your investment preferences",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Investment timeline</Label>
            <Select
              value={data.timeHorizon}
              onValueChange={(value) => updateData({ timeHorizon: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2 years">1-2 years</SelectItem>
                <SelectItem value="3-5 years">3-5 years</SelectItem>
                <SelectItem value="5-10 years">5-10 years</SelectItem>
                <SelectItem value="10+ years">10+ years</SelectItem>
                <SelectItem value="retirement">Until Retirement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Risk tolerance</Label>
              <span className="text-sm font-medium text-primary">
                {getRiskLabel(data.riskTolerance)}
              </span>
            </div>
            <Slider
              value={[data.riskTolerance]}
              onValueChange={([value]) => updateData({ riskTolerance: value })}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>Very Aggressive</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monthly Investment</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={data.monthlyInvestment}
                  onChange={(e) =>
                    updateData({ monthlyInvestment: Number(e.target.value) })
                  }
                  className="pl-8"
                  placeholder="500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Return</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={data.targetReturn}
                  onChange={(e) =>
                    updateData({ targetReturn: Number(e.target.value) })
                  }
                  className="pr-8"
                  placeholder="8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "All Set!",
      subtitle: "Review your preferences",
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">
              Your Investment Profile
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="font-medium capitalize">
                  {data.investmentExperience}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Risk Tolerance:</span>
                <span className="font-medium">
                  {getRiskLabel(data.riskTolerance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Goal:</span>
                <span className="font-medium capitalize">
                  {data.investmentGoal?.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Timeline:</span>
                <span className="font-medium">{data.timeHorizon}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Investment:</span>
                <span className="font-medium">
                  ${data.monthlyInvestment?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Target Return:</span>
                <span className="font-medium">{data.targetReturn}%</span>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            We'll use this information to optimize your portfolio and provide
            personalized recommendations.
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentStepData.subtitle}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepData.content}

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-muted-foreground"
              >
                Skip
              </Button>
            </div>
            <Button onClick={nextStep} disabled={!isStepValid()}>
              {currentStep === totalSteps - 1 ? "Get Started" : "Next"}
              {currentStep < totalSteps - 1 && (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
