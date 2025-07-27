import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Plus,
  ArrowRight,
  Star,
  Target,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopMove {
  id: string;
  type: "buy" | "diversify" | "reduce" | "rebalance";
  symbol?: string;
  title: string;
  reason: string;
  confidence: "high" | "medium" | "low";
  priority: 1 | 2 | 3;
  action: string;
  sector?: string;
}

interface TopMovesWidgetProps {
  moves?: TopMove[];
  onMoveClick?: (move: TopMove) => void;
  className?: string;
}

const moveIcons = {
  buy: Plus,
  diversify: BarChart3,
  reduce: TrendingUp,
  rebalance: Target,
};

const confidenceColors = {
  high: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-blue-100 text-blue-700 border-blue-300", 
  low: "bg-gray-100 text-gray-700 border-gray-300",
};

const mockMoves: TopMove[] = [
  {
    id: "buy_jpm",
    type: "buy",
    symbol: "JPM",
    title: "Buy JPM for diversification", 
    reason: "Your portfolio has no exposure to Financials",
    confidence: "high",
    priority: 1,
    action: "Add to queue",
    sector: "Financial Services",
  },
  {
    id: "reduce_tech",
    type: "reduce",
    title: "Reduce tech allocation",
    reason: "Technology is 45% of your portfolio (target: 30%)",
    confidence: "medium",
    priority: 2,
    action: "Rebalance",
  },
  {
    id: "add_healthcare",
    type: "diversify",
    symbol: "JNJ",
    title: "Consider healthcare exposure",
    reason: "Defensive positioning for market uncertainty",
    confidence: "medium", 
    priority: 3,
    action: "Explore options",
    sector: "Healthcare",
  },
];

export function TopMovesWidget({ 
  moves = mockMoves, 
  onMoveClick,
  className 
}: TopMovesWidgetProps) {
  // Show only top 3 moves, sorted by priority
  const topMoves = moves
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Top Moves This Week
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            For you
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {topMoves.map((move, index) => {
          const IconComponent = moveIcons[move.type];
          
          return (
            <div
              key={move.id}
              className={cn(
                "group relative p-3 rounded-lg border transition-all cursor-pointer",
                "hover:border-blue-300 hover:bg-blue-50/50"
              )}
              onClick={() => onMoveClick?.(move)}
            >
              {/* Priority indicator */}
              <div className="absolute -left-1 top-3 w-1 h-8 bg-blue-500 rounded-r" />
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm text-gray-900 leading-tight">
                      {move.title}
                    </h4>
                    <Badge 
                      className={cn("text-xs", confidenceColors[move.confidence])}
                      variant="outline"
                    >
                      {move.confidence}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    {move.reason}
                  </p>
                  
                  {/* Symbol and Sector */}
                  {(move.symbol || move.sector) && (
                    <div className="flex items-center gap-2 mb-2">
                      {move.symbol && (
                        <Badge variant="secondary" className="text-xs font-mono">
                          {move.symbol}
                        </Badge>
                      )}
                      {move.sector && (
                        <span className="text-xs text-gray-500">{move.sector}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Action */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">
                      {move.action}
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Footer */}
        <div className="pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-8 text-xs text-gray-600 hover:text-blue-600"
          >
            View all suggestions
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to generate personalized moves based on user behavior
export function generatePersonalizedMoves(userBehavior: {
  topSectors: string[];
  riskPreference: string;
  portfolioAllocation?: Record<string, number>;
}): TopMove[] {
  const moves: TopMove[] = [];
  
  // Over-concentration check
  if (userBehavior.portfolioAllocation) {
    const overweightSectors = Object.entries(userBehavior.portfolioAllocation)
      .filter(([_, weight]) => weight > 35);
    
    if (overweightSectors.length > 0) {
      moves.push({
        id: "reduce_concentration",
        type: "reduce",
        title: `Reduce ${overweightSectors[0][0]} concentration`,
        reason: `${overweightSectors[0][0]} is ${overweightSectors[0][1]}% of your portfolio`,
        confidence: "high",
        priority: 1,
        action: "Rebalance",
      });
    }
  }
  
  // Diversification suggestions
  const underexposedSectors = ["Healthcare", "Financial Services", "Consumer Staples"]
    .filter(sector => !userBehavior.topSectors.includes(sector));
  
  if (underexposedSectors.length > 0) {
    moves.push({
      id: "add_diversification",
      type: "diversify",
      title: `Add ${underexposedSectors[0]} exposure`,
      reason: `Missing defensive positioning in ${underexposedSectors[0]}`,
      confidence: "medium",
      priority: 2,
      action: "Explore options",
      sector: underexposedSectors[0],
    });
  }
  
  return moves;
}
