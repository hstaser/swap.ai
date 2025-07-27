import { SimpleOnboarding } from "./SimpleOnboarding";

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  return <SimpleOnboarding onComplete={onComplete} onSkip={onSkip} />;
}
