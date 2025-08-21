import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueueProvider } from "@/hooks/use-queue";
import AuthProvider, { useAuth } from "@/hooks/use-auth";
import { AIAgentProvider } from "@/hooks/use-ai-agent";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import Research from "./pages/Research";
import Pelosi from "./pages/Pelosi";
import Banking from "./pages/Banking";
import Transactions from "./pages/Transactions";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";

import Friends from "./pages/Friends";
import Social from "./pages/Messages";
import UserProfile from "./pages/UserProfile";
import AddFriends from "./pages/AddFriends";
import Rewards from "./pages/Rewards";
import QueueAdd from "./pages/QueueAdd";
import NewsMonitoring from "./pages/NewsMonitoring";
import QueueReview from "./pages/QueueReview";
import PortfolioOptimize from "./pages/PortfolioOptimize";
import OptimizationReview from "./pages/OptimizationReview";
import StockDetail from "./pages/StockDetail";
import StockNews from "./pages/StockNews";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { authStatus, requiresOnboarding, completeOnboarding } = useAuth();

  const handleOnboardingComplete = async (data: any) => {
    console.log("Onboarding completed with data:", data);
    await completeOnboarding(data);
  };

  const handleOnboardingSkip = async () => {
    // Create minimal onboarding data for users who skip
    const minimalData = {
      user_type: "intermediate",
      sector_interests: ["technology"],
      primary_goal: "wealth-building",
      risk_tolerance: 5,
      ai_involvement: "advisory",
      skipped: true,
    };
    await completeOnboarding(minimalData);
  };

  // Show landing page if not authenticated
  if (authStatus === "unauthenticated") {
    return <Landing />;
  }

  // Show onboarding if user needs to complete it
  if (requiresOnboarding()) {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/research" element={<Research />} />
        <Route path="/pelosi" element={<Pelosi />} />
        <Route path="/banking" element={<Banking />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/rebalance" element={<Portfolio />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/social" element={<Social />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/add-friends" element={<AddFriends />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/queue/add/:symbol" element={<QueueAdd />} />
        <Route path="/queue/review" element={<QueueReview />} />
        <Route path="/news" element={<NewsMonitoring />} />
        <Route path="/optimize" element={<PortfolioOptimize />} />
        <Route path="/optimize/review" element={<OptimizationReview />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/stock/:symbol/news" element={<StockNews />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

// Prevent double root creation during HMR
const rootElement = document.getElementById("root")!;
if (!rootElement._reactRoot) {
  rootElement._reactRoot = createRoot(rootElement);
}
rootElement._reactRoot.render(<App />);
