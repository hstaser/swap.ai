import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { UserProfile } from "@/lib/ai-agent";
import { useAIAgent } from "@/hooks/use-ai-agent";
import {
  User,
  Target,
  Clock,
  Building,
  TrendingUp,
  Shield,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleOnboardingProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

const riskOptions = [
  {
    id: "conservative" as const,
    label: "Conservative",
    icon: Shield,
    description: "Stability-focused with lower volatility",
    color: "text-green-600",
    recommendation: "",
  },
  {
    id: "moderate" as const,
    label: "Moderate",
    icon: TrendingUp,
    description: "Maximizes expected returns over volatility (optimal Sharpe ratio)",
    color: "text-blue-600",
    recommendation: "Recommended",
  },
  {
    id: "aggressive" as const,
    label: "Aggressive", 
    icon: Target,
    description: "Higher risk for potential higher returns",
    color: "text-red-600",
    recommendation: "",
  },
];

const timeHorizonOptions = [
  {
    id: "short" as const,
    label: "Short-term",
    description: "Less than 2 years",
    icon: Clock,
  },
  {
    id: "medium" as const,
    label: "Medium-term",
    description: "2-10 years",
    icon: Clock,
  },
  {
    id: "long" as const,
    label: "Long-term",
    description: "10+ years",
    icon: Clock,
  },
];

const investmentGoals = [
  "Capital Growth",
  "Dividend Income", 
  "Retirement Planning",
  "Emergency Fund",
  "House Down Payment",
  "Education Fund",
  "Wealth Preservation",
  "Short-term Gains",
];

const sectors = [
  "Technology",
  "Healthcare", 
  "Financial Services",
  "Consumer Discretionary",
  "Consumer Staples",
  "Industrial",
  "Energy",
  "Materials",
  "Utilities",
  "Real Estate",
  "Communication Services",
  "Aerospace & Defense",
];

export function SimpleOnboarding({ onComplete, onSkip }: SimpleOnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    maxSectorConcentration: 30,
  });
  const [basicInfo, setBasicInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  
  const { setupAgent } = useAIAgent();

  const handleComplete = () => {
    // Setup AI Agent
    const completeProfile: UserProfile = {
      riskTolerance: profile.riskTolerance || "moderate",
      timeHorizon: profile.timeHorizon || "medium",
      investmentGoals: profile.investmentGoals || [],
      preferredSectors: profile.preferredSectors || [],
      excludedSectors: profile.excludedSectors || [],
      maxSectorConcentration: profile.maxSectorConcentration || 30,
    };
    
    setupAgent(completeProfile);
    
    // Complete onboarding with minimal data
    onComplete({
      basic: basicInfo,
      ai: completeProfile,
      // Note: Legal/banking info will be collected at checkout
      deferredSetup: true
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to Swipr.AI</h2>
        <p className="text-muted-foreground">
          Let's get you set up with personalized investment recommendations
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={basicInfo.firstName}
              onChange={(e) => setBasicInfo({ ...basicInfo, firstName: e.target.value })}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={basicInfo.lastName}
              onChange={(e) => setBasicInfo({ ...basicInfo, lastName: e.target.value })}
              placeholder="Smith"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={basicInfo.email}
            onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">
              Quick & Easy Setup
            </p>
            <p className="text-blue-800">
              We'll only ask for basic preferences now. Legal and banking details can wait until you're ready to invest.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onSkip} className="flex-1">
          Skip for now
        </Button>
        <Button 
          onClick={() => setStep(2)} 
          disabled={!basicInfo.firstName || !basicInfo.lastName || !basicInfo.email}
          className="flex-1"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">What's your risk tolerance?</h2>
        <p className="text-muted-foreground">
          This helps our AI recommend suitable investments
        </p>
      </div>

      <div className="space-y-3">
        {riskOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = profile.riskTolerance === option.id;
          
          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all border-2",
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setProfile({ ...profile, riskTolerance: option.id })}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <IconComponent className={cn("h-6 w-6", option.color)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{option.label}</h3>
                      {option.recommendation && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          {option.recommendation}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={() => setStep(3)} 
          disabled={!profile.riskTolerance}
          className="flex-1"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">What's your time horizon?</h2>
        <p className="text-muted-foreground">
          How long do you plan to invest for?
        </p>
      </div>

      <div className="space-y-3">
        {timeHorizonOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = profile.timeHorizon === option.id;
          
          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all border-2",
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setProfile({ ...profile, timeHorizon: option.id })}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(2)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={() => setStep(4)} 
          disabled={!profile.timeHorizon}
          className="flex-1"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">What are your investment goals?</h2>
        <p className="text-muted-foreground">
          Select all that apply
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {investmentGoals.map((goal) => {
          const isSelected = profile.investmentGoals?.includes(goal);
          
          return (
            <Card
              key={goal}
              className={cn(
                "cursor-pointer transition-all border-2",
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => {
                const currentGoals = profile.investmentGoals || [];
                const newGoals = isSelected
                  ? currentGoals.filter(g => g !== goal)
                  : [...currentGoals, goal];
                setProfile({ ...profile, investmentGoals: newGoals });
              }}
            >
              <CardContent className="p-3">
                <div className="text-center">
                  <h3 className="font-medium text-sm">{goal}</h3>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-blue-500 mx-auto mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(3)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={() => setStep(5)} 
          disabled={!profile.investmentGoals?.length}
          className="flex-1"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">Any sector preferences?</h2>
        <p className="text-muted-foreground">
          Which industries interest you most? (Select 3-5)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sectors.map((sector) => {
          const isSelected = profile.preferredSectors?.includes(sector);
          
          return (
            <Button
              key={sector}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="h-auto py-2 px-3 text-xs justify-start"
              onClick={() => {
                const currentSectors = profile.preferredSectors || [];
                const newSectors = isSelected
                  ? currentSectors.filter(s => s !== sector)
                  : [...currentSectors, sector];
                setProfile({ ...profile, preferredSectors: newSectors });
              }}
            >
              <Building className="h-3 w-3 mr-2" />
              {sector}
            </Button>
          );
        })}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-green-900 mb-1">
              Almost Ready!
            </p>
            <p className="text-green-800">
              Your AI agent will be set up with these preferences. You can always adjust them later.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(4)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={!profile.preferredSectors?.length}
          className="flex-1"
        >
          Complete Setup
          <Sparkles className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              Step {step} of 5
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </CardContent>
      </Card>
    </div>
  );
}
