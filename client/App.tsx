import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueueProvider } from "@/hooks/use-queue";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AIAgentProvider } from "@/hooks/use-ai-agent";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import Research from "./pages/Research";
import Banking from "./pages/Banking";
import Transactions from "./pages/Transactions";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import AIAgent from "./pages/AIAgent";
import Friends from "./pages/Friends";
import Messages from "./pages/Messages";
import Rewards from "./pages/Rewards";
import QueueAdd from "./pages/QueueAdd";
import QueueReview from "./pages/QueueReview";
import PortfolioOptimize from "./pages/PortfolioOptimize";
import OptimizationReview from "./pages/OptimizationReview";
import StockDetail from "./pages/StockDetail";
import StockNews from "./pages/StockNews";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { authStatus } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(
    // Show onboarding for authenticated users only - force show for AI agent setup
    authStatus === "authenticated" &&
      (localStorage.getItem("onboarding_completed") !== "true" ||
       localStorage.getItem("ai_agent_profile") === null),
  );

  const handleOnboardingComplete = (data: any) => {
    console.log("Onboarding completed with data:", data);
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  // Show landing page if not authenticated
  if (authStatus === "unauthenticated") {
    return <Landing />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/research" element={<Research />} />
        <Route path="/banking" element={<Banking />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/ai-agent" element={<AIAgent />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/queue/add/:symbol" element={<QueueAdd />} />
        <Route path="/queue/review" element={<QueueReview />} />
        <Route path="/optimize" element={<PortfolioOptimize />} />
        <Route path="/optimize/review" element={<OptimizationReview />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/stock/:symbol/news" element={<StockNews />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Onboarding Flow - only for authenticated users */}
      {showOnboarding && authStatus === "authenticated" && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <QueueProvider>
            <AIAgentProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </AIAgentProvider>
          </QueueProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
