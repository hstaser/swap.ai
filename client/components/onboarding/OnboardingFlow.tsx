import { KYCOnboarding } from "./KYCOnboarding";

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  return <KYCOnboarding onComplete={onComplete} onSkip={onSkip} />;
}
