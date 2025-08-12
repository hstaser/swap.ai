import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockDashboard } from "@/components/ui/stock-dashboard";
import { PortfolioReviewSidebar } from "@/components/ui/portfolio-review-sidebar";
import { ExploreAgentModal } from "@/components/ui/explore-agent-modal";
import { PinnedStocksSection } from "@/components/ui/friend-dashboard-share";

import {
  BarChart3,
  MessageCircle,
  TrendingUp,
  Eye,
} from "lucide-react";

interface DashboardWithAssistantProps {
  onStockSelect?: (symbol: string) => void;
}

export function DashboardWithAssistant({ onStockSelect }: DashboardWithAssistantProps) {
  const [showPortfolioReview, setShowPortfolioReview] = useState(false);
  const [showExploreAgent, setShowExploreAgent] = useState(false);

  return (
    <div className="space-y-6">
      {/* AI Search Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Dashboard</h2>
        <Button
          size="sm"
          onClick={() => setShowExploreAgent(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          AI Search
        </Button>
      </div>

      {/* Main Dashboard - Full Width */}
      <div>
        <StockDashboard onStockSelect={onStockSelect} />
      </div>

      {/* Modals and Sidebars */}
      <PortfolioReviewSidebar
        isOpen={showPortfolioReview}
        onClose={() => setShowPortfolioReview(false)}
      />

      <ExploreAgentModal
        isOpen={showExploreAgent}
        onClose={() => setShowExploreAgent(false)}
      />
    </div>
  );
}
