import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { aiAgent, AIIntervention, UserProfile } from "@/lib/ai-agent";
import { useQueue } from "./use-queue";

interface AIAgentContextType {
  isSetup: boolean;
  interventions: AIIntervention[];
  setupAgent: (profile: UserProfile) => void;
  trackSwipe: (
    symbol: string,
    action: "skip" | "queue" | "watchlist",
    stockData: { sector: string; risk: "Low" | "Medium" | "High" },
    confidence?: "conservative" | "bullish" | "very-bullish"
  ) => void;
  dismissIntervention: (id: string) => void;
  getInsights: () => any;
  refreshInterventions: () => void;
}

const AIAgentContext = createContext<AIAgentContextType | undefined>(undefined);

function AIAgentProviderInner({ children }: { children: ReactNode }) {
  const [isSetup, setIsSetup] = useState(false);
  const [interventions, setInterventions] = useState<AIIntervention[]>([]);
  const { queue } = useQueue();

  useEffect(() => {
    // Check if agent is already setup
    const profile = aiAgent.getUserProfile();
    setIsSetup(!!profile);

    if (profile) {
      refreshInterventions();
    }
  }, []);

  useEffect(() => {
    // Refresh interventions when queue changes
    if (isSetup) {
      refreshInterventions();
    }
  }, [queue, isSetup]);

  const setupAgent = (profile: UserProfile) => {
    aiAgent.setUserProfile(profile);
    setIsSetup(true);
    refreshInterventions();
  };

  const trackSwipe = (
    symbol: string,
    action: "skip" | "queue" | "watchlist",
    stockData: { sector: string; risk: "Low" | "Medium" | "High" },
    confidence?: "conservative" | "bullish" | "very-bullish"
  ) => {
    aiAgent.trackSwipe(symbol, action, stockData, confidence);

    // Refresh interventions after tracking behavior
    setTimeout(() => refreshInterventions(), 100);
  };

  const dismissIntervention = (id: string) => {
    setInterventions(prev => prev.filter(intervention => intervention.id !== id));
  };

  const getInsights = () => {
    return aiAgent.getBehaviorInsights();
  };

  const refreshInterventions = () => {
    const newInterventions = aiAgent.generateInterventions(queue);
    setInterventions(newInterventions);
  };

  return (
    <AIAgentContext.Provider
      value={{
        isSetup,
        interventions,
        setupAgent,
        trackSwipe,
        dismissIntervention,
        getInsights,
        refreshInterventions,
      }}
    >
      {children}
    </AIAgentContext.Provider>
  );
}

export function AIAgentProvider({ children }: { children: ReactNode }) {
  // Add error boundary for queue context issues
  try {
    return <AIAgentProviderInner>{children}</AIAgentProviderInner>;
  } catch (error) {
    console.warn("AIAgentProvider failed, rendering children without AI context:", error);
    return <>{children}</>;
  }
}

export function useAIAgent() {
  const context = useContext(AIAgentContext);
  if (context === undefined) {
    // Return default values instead of throwing during development hot reload
    console.warn("useAIAgent used outside AIAgentProvider, returning defaults");
    return {
      isSetup: false,
      interventions: [],
      setupAgent: () => {},
      trackSwipe: () => {},
      dismissIntervention: () => {},
      getInsights: () => ({}),
      refreshInterventions: () => {},
    };
  }
  return context;
}
