import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockDashboard } from "@/components/ui/stock-dashboard";
import { TopMovesWidget } from "@/components/ui/top-moves-widget";
import { PortfolioReviewSidebar } from "@/components/ui/portfolio-review-sidebar";
import { ExploreAgentModal } from "@/components/ui/explore-agent-modal";
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
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPortfolioReview(true)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Review Portfolio
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowExploreAgent(true)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask Assistant
          </Button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dashboard - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2">
          <StockDashboard onStockSelect={onStockSelect} />
        </div>

        {/* Assistant Widgets - Takes up 1/3 on large screens */}
        <div className="space-y-6">
          {/* Top Moves Widget */}
          <TopMovesWidget 
            onMoveClick={(move) => {
              console.log("Move clicked:", move);
              if (move.symbol) {
                onStockSelect?.(move.symbol);
              }
            }}
          />

          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10"
                onClick={() => setShowPortfolioReview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Review my portfolio
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-10"
                onClick={() => setShowExploreAgent(true)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask a question
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-10"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Check market news
              </Button>
            </CardContent>
          </Card>
        </div>
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
