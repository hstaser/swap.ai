import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  X,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioSuggestion {
  id: string;
  type: "rebalance" | "reduce" | "add" | "replace";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  currentValue?: string;
  targetValue?: string;
  reasoning: string;
  actionable: boolean;
}

interface PortfolioReviewSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions?: PortfolioSuggestion[];
}

const suggestionIcons = {
  rebalance: BarChart3,
  reduce: TrendingDown,
  add: TrendingUp,
  replace: Target,
};

const impactColors = {
  high: "text-red-600 bg-red-50 border-red-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  low: "text-blue-600 bg-blue-50 border-blue-200",
};

const mockSuggestions: PortfolioSuggestion[] = [
  {
    id: "reduce_aapl",
    type: "reduce",
    title: "Reduce AAPL by 3%",
    description: "Apple is 2.5x over your target weight",
    impact: "high",
    currentValue: "15.2%",
    targetValue: "12.0%",
    reasoning: "Your target allocation for any single stock is 10-12%. Apple has grown to represent too much of your portfolio.",
    actionable: true,
  },
  {
    id: "add_healthcare",
    type: "add",
    title: "Add healthcare exposure",
    description: "Missing defensive positioning",
    impact: "medium",
    currentValue: "2.1%",
    targetValue: "8-12%",
    reasoning: "Healthcare provides stability during market volatility and you're currently underexposed to this defensive sector.",
    actionable: true,
  },
  {
    id: "rebalance_growth",
    type: "rebalance",
    title: "Rebalance growth vs value",
    description: "Too heavy on growth stocks",
    impact: "medium",
    currentValue: "78%",
    targetValue: "65%",
    reasoning: "Your moderate risk profile suggests a more balanced approach between growth and value stocks.",
    actionable: true,
  },
];

export function PortfolioReviewSidebar({ 
  isOpen, 
  onClose, 
  suggestions = mockSuggestions 
}: PortfolioReviewSidebarProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  if (!isOpen) return null;

  const highImpactCount = suggestions.filter(s => s.impact === "high").length;
  const actionableCount = suggestions.filter(s => s.actionable).length;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Review</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-gray-700">
                {highImpactCount} priority item{highImpactCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">
                {actionableCount} quick fix{actionableCount !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Good foundation</h3>
                  <p className="text-sm text-blue-700">
                    A few tweaks will optimize your risk-return profile
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions List */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Top Suggestions</h3>
            
            {suggestions.map((suggestion) => {
              const IconComponent = suggestionIcons[suggestion.type];
              const isSelected = selectedSuggestion === suggestion.id;
              
              return (
                <Card 
                  key={suggestion.id}
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedSuggestion(isSelected ? null : suggestion.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-sm text-gray-900">
                            {suggestion.title}
                          </h4>
                          <Badge 
                            className={cn("text-xs", impactColors[suggestion.impact])}
                            variant="outline"
                          >
                            {suggestion.impact}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {suggestion.description}
                        </p>
                        
                        {/* Values */}
                        {suggestion.currentValue && suggestion.targetValue && (
                          <div className="flex items-center gap-4 text-xs mb-2">
                            <div>
                              <span className="text-gray-500">Current: </span>
                              <span className="font-medium">{suggestion.currentValue}</span>
                            </div>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <div>
                              <span className="text-gray-500">Target: </span>
                              <span className="font-medium text-blue-600">{suggestion.targetValue}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Expanded Details */}
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-700 mb-3">
                              {suggestion.reasoning}
                            </p>
                            
                            <div className="flex gap-2">
                              <Button size="sm" className="h-7 px-3 text-xs">
                                Apply Fix
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* Expand indicator */}
                        {!isSelected && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <span>Tap for details</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 space-y-3">
          <Button className="w-full h-10" onClick={onClose}>
            Apply All Quick Fixes
          </Button>
          <Button variant="outline" className="w-full h-10">
            Schedule Review Call
          </Button>
        </div>
      </div>
    </>
  );
}
