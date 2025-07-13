import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  TrendingUp,
  Shield,
  DollarSign,
  Target,
  Clock,
  User,
  X,
} from "lucide-react";

interface OnboardingData {
  riskTolerance: "conservative" | "moderate" | "aggressive" | "";
  investmentGoal: "growth" | "income" | "balanced" | "retirement" | "";
  timeHorizon: "short" | "medium" | "long" | "";
  experience: "beginner" | "intermediate" | "advanced" | "";
  initialAmount: number;
  monthlyContribution: number;
  age: number;
  employmentStatus: string;
  annualIncome: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    riskTolerance: "",
    investmentGoal: "",
    timeHorizon: "",
    experience: "",
    initialAmount: 1000,
    monthlyContribution: 100,
    age: 30,
    employmentStatus: "",
    annualIncome: "",
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.riskTolerance !== "";
      case 2:
        return data.investmentGoal !== "";
      case 3:
        return data.timeHorizon !== "";
      case 4:
        return data.experience !== "";
      case 5:
        return data.employmentStatus !== "" && data.annualIncome !== "";
      case 6:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                What's your risk tolerance?
              </h2>
              <p className="text-muted-foreground">
                This helps us recommend investments that match your comfort
                level.
              </p>
            </div>

            <RadioGroup
              value={data.riskTolerance}
              onValueChange={(value) => updateData("riskTolerance", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="conservative" id="conservative" />
                <Label htmlFor="conservative" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Conservative</div>
                  <div className="text-sm text-muted-foreground">
                    I prefer stable returns with minimal risk of losing money
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Moderate</div>
                  <div className="text-sm text-muted-foreground">
                    I'm comfortable with some ups and downs for better long-term
                    growth
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="aggressive" id="aggressive" />
                <Label htmlFor="aggressive" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Aggressive</div>
                  <div className="text-sm text-muted-foreground">
                    I want maximum growth potential and can handle significant
                    volatility
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                What's your primary investment goal?
              </h2>
              <p className="text-muted-foreground">
                This helps us tailor your portfolio to your objectives.
              </p>
            </div>

            <RadioGroup
              value={data.investmentGoal}
              onValueChange={(value) => updateData("investmentGoal", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="growth" id="growth" />
                <Label htmlFor="growth" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Growth</div>
                  <div className="text-sm text-muted-foreground">
                    Build wealth over time through capital appreciation
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Income</div>
                  <div className="text-sm text-muted-foreground">
                    Generate regular income through dividends and interest
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="balanced" id="balanced" />
                <Label htmlFor="balanced" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Balanced</div>
                  <div className="text-sm text-muted-foreground">
                    A mix of growth and income for steady, moderate returns
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="retirement" id="retirement" />
                <Label htmlFor="retirement" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Retirement</div>
                  <div className="text-sm text-muted-foreground">
                    Long-term wealth building for retirement security
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                What's your investment timeline?
              </h2>
              <p className="text-muted-foreground">
                Your time horizon affects which investments are right for you.
              </p>
            </div>

            <RadioGroup
              value={data.timeHorizon}
              onValueChange={(value) => updateData("timeHorizon", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Short-term (1-3 years)</div>
                  <div className="text-sm text-muted-foreground">
                    I may need this money relatively soon
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Medium-term (3-10 years)</div>
                  <div className="text-sm text-muted-foreground">
                    I'm planning for medium-term goals like a house or education
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="long" id="long" />
                <Label htmlFor="long" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Long-term (10+ years)</div>
                  <div className="text-sm text-muted-foreground">
                    I'm investing for retirement or other long-term goals
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                What's your investment experience?
              </h2>
              <p className="text-muted-foreground">
                This helps us provide appropriate guidance and recommendations.
              </p>
            </div>

            <RadioGroup
              value={data.experience}
              onValueChange={(value) => updateData("experience", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Beginner</div>
                  <div className="text-sm text-muted-foreground">
                    I'm new to investing and want guidance
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Intermediate</div>
                  <div className="text-sm text-muted-foreground">
                    I have some experience with stocks and basic investing
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Advanced</div>
                  <div className="text-sm text-muted-foreground">
                    I'm experienced with investing and financial markets
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Tell us about yourself
              </h2>
              <p className="text-muted-foreground">
                This information helps us comply with regulations and provide
                better recommendations.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <div className="mt-2">
                  <Slider
                    value={[data.age]}
                    onValueChange={(value) => updateData("age", value[0])}
                    max={80}
                    min={18}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center mt-2 font-semibold">
                    {data.age} years old
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="employment">Employment Status</Label>
                <Select
                  value={data.employmentStatus}
                  onValueChange={(value) =>
                    updateData("employmentStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="income">Annual Income</Label>
                <Select
                  value={data.annualIncome}
                  onValueChange={(value) => updateData("annualIncome", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select annual income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                    <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                    <SelectItem value="100k-150k">
                      $100,000 - $150,000
                    </SelectItem>
                    <SelectItem value="150k-250k">
                      $150,000 - $250,000
                    </SelectItem>
                    <SelectItem value="over-250k">Over $250,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Investment amounts</h2>
              <p className="text-muted-foreground">
                How much would you like to start with? You can always change
                this later.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="initial">Initial Investment</Label>
                <div className="mt-2">
                  <Slider
                    value={[data.initialAmount]}
                    onValueChange={(value) =>
                      updateData("initialAmount", value[0])
                    }
                    max={10000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="text-center mt-2 font-semibold">
                    ${data.initialAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="monthly">Monthly Contribution (Optional)</Label>
                <div className="mt-2">
                  <Slider
                    value={[data.monthlyContribution]}
                    onValueChange={(value) =>
                      updateData("monthlyContribution", value[0])
                    }
                    max={1000}
                    min={0}
                    step={25}
                    className="w-full"
                  />
                  <div className="text-center mt-2 font-semibold">
                    {data.monthlyContribution === 0
                      ? "No monthly contribution"
                      : `$${data.monthlyContribution}/month`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkip}
            className="absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle>Welcome to swap.ai</CardTitle>
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          <div className="text-center">
            <Button variant="link" onClick={onSkip} className="text-sm">
              Skip for now (Development Mode)
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button onClick={nextStep} disabled={!canProceed()}>
              {currentStep === totalSteps ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
