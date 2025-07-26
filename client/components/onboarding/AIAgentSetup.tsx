import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/lib/ai-agent";
import { useAIAgent } from "@/hooks/use-ai-agent";
import {
  Bot,
  TrendingUp,
  Shield,
  Target,
  Clock,
  Building,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAgentSetupProps {
  onComplete: (data: UserProfile) => void;
  onSkip: () => void;
}

const riskOptions = [
  {
    id: "conservative" as const,
    label: "Conservative",
    icon: Shield,
    description: "Prefer stability and lower risk",
    color: "text-green-600",
  },
  {
    id: "moderate" as const,
    label: "Moderate",
    icon: TrendingUp,
    description: "Balanced approach to risk and return",
    color: "text-blue-600",
  },
  {
    id: "aggressive" as const,
    label: "Aggressive", 
    icon: Target,
    description: "Higher risk for potential higher returns",
    color: "text-red-600",
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

export function AIAgentSetup({ onComplete, onSkip }: AIAgentSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    maxSectorConcentration: 30, // Default 30%
  });
  const { setupAgent } = useAIAgent();

  const handleComplete = () => {
    const completeProfile: UserProfile = {
      riskTolerance: profile.riskTolerance || "moderate",
      timeHorizon: profile.timeHorizon || "medium",
      investmentGoals: profile.investmentGoals || [],
      preferredSectors: profile.preferredSectors || [],
      excludedSectors: profile.excludedSectors || [],
      maxSectorConcentration: profile.maxSectorConcentration || 30,
    };
    
    setupAgent(completeProfile);
    onComplete(completeProfile);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Bot className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Meet Your AI Assistant</h2>
        <p className="text-muted-foreground">
          I'll learn your preferences and help you make better investment decisions
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="h-6 w-6 text-purple-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">What I'll do for you:</h3>
              <ul className="space-y-2 text-sm">
                <li>• Track your investment preferences and behavior</li>
                <li>• Alert you when your portfolio needs attention</li>
                <li>• Suggest optimizations based on your goals</li>
                <li>• Help you stay disciplined with your strategy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onSkip} className="flex-1">
          Skip for now
        </Button>
        <Button onClick={() => setStep(2)} className="flex-1">
          Let's set it up
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
          This helps me understand your investment style
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
          Select all that apply (you can change these later)
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
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mx-auto mt-2">
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
        <h2 className="text-xl font-bold">Sector preferences</h2>
        <p className="text-muted-foreground">
          Which sectors interest you most? (Select 3-5)
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
