import { useState } from "react";
import { KYCOnboarding } from "./KYCOnboarding";
import { AIAgentSetup } from "./AIAgentSetup";

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState<"kyc" | "ai-setup">("kyc");
  const [kycData, setKycData] = useState<any>(null);

  const handleKYCComplete = (data: any) => {
    setKycData(data);
    setStep("ai-setup");
  };

  const handleAISetupComplete = (aiData: any) => {
    onComplete({ kyc: kycData, ai: aiData });
  };

  const handleAISetupSkip = () => {
    onComplete({ kyc: kycData, ai: null });
  };

  if (step === "kyc") {
    return <KYCOnboarding onComplete={handleKYCComplete} onSkip={onSkip} />;
  }

  return (
    <AIAgentSetup
      onComplete={handleAISetupComplete}
      onSkip={handleAISetupSkip}
    />
  );
}
