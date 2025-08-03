import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Activity,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AIInsight {
  id: string;
  type: "opportunity" | "risk" | "optimization" | "market";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  confidence: number;
  impact: string;
  timeframe: string;
  category: string;
}

const insights: AIInsight[] = [
  {
    id: "1",
    type: "opportunity",
    priority: "high",
    title: "Buy JPM for diversification",
    description: "Your portfolio has no exposure to Financials",
    action: "Add to queue",
    confidence: 87,
    impact: "Reduce portfolio volatility by 2.3%",
    timeframe: "This week",
    category: "Diversification",
  },
  {
    id: "2",
    type: "optimization",
    priority: "medium",
    title: "Reduce tech allocation",
    description: "Technology is 45% of your portfolio (target: 30%)",
    action: "Rebalance",
    confidence: 92,
    impact: "Better risk-adjusted returns",
    timeframe: "Next trade",
    category: "Allocation",
  },
  {
    id: "3",
    type: "opportunity",
    priority: "medium", 
    title: "Consider healthcare exposure",
    description: "Defensive positioning for market uncertainty",
    action: "Explore options",
    confidence: 78,
    impact: "Defensive positioning",
    timeframe: "This month",
    category: "Sector Rotation",
  },
  {
    id: "4",
    type: "market",
    priority: "low",
    title: "Monitor earnings season",
    description: "3 of your holdings report earnings this week",
    action: "Review positions",
    confidence: 95,
    impact: "Stay informed",
    timeframe: "This week",
    category: "Earnings",
  },
];

export default function AIInsights() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredInsights = insights.filter(insight => 
    selectedFilter === "all" || insight.type === selectedFilter
  );

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity": return TrendingUp;
      case "risk": return AlertTriangle;
      case "optimization": return Target;
      case "market": return Activity;
      default: return Sparkles;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === "high") {
      return type === "risk" ? "border-red-400 bg-red-50" : "border-green-400 bg-green-50";
    } else if (priority === "medium") {
      return "border-blue-400 bg-blue-50";
    }
    return "border-gray-300 bg-gray-50";
  };

  const getInsightIconColor = (type: string, priority: string) => {
    if (priority === "high") {
      return type === "risk" ? "text-red-600" : "text-green-600";
    } else if (priority === "medium") {
      return "text-blue-600";
    }
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Futuristic Header */}
      <header className="border-b border-blue-800/30 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">AI Insights</h1>
                  <p className="text-sm text-blue-200">Intelligent portfolio analysis</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-cyan-400 text-cyan-400 bg-cyan-400/10">
                Live Analysis
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 border-blue-800/30 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {insights.filter(i => i.priority === "high").length}
              </div>
              <div className="text-sm text-blue-200">High Priority</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 border-blue-800/30 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {insights.filter(i => i.type === "opportunity").length}
              </div>
              <div className="text-sm text-blue-200">Opportunities</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 border-blue-800/30 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length}%
              </div>
              <div className="text-sm text-blue-200">Avg Confidence</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 border-blue-800/30 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {insights.filter(i => i.timeframe === "This week").length}
              </div>
              <div className="text-sm text-blue-200">This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="bg-black/20 border-blue-800/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {["all", "opportunity", "optimization", "risk", "market"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={cn(
                    selectedFilter === filter 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0" 
                      : "border-blue-600/50 text-blue-300 hover:bg-blue-500/20"
                  )}
                >
                  {filter === "all" ? "All Insights" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights List */}
        <div className="space-y-4">
          {filteredInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <Card 
                key={insight.id}
                className={cn(
                  "bg-black/20 backdrop-blur-xl border-l-4 hover:bg-black/30 transition-all cursor-pointer",
                  getInsightColor(insight.type, insight.priority).replace("bg-", "border-l-").replace("-50", "-500")
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      insight.priority === "high" ? "bg-gradient-to-br from-green-400 to-emerald-500" :
                      insight.priority === "medium" ? "bg-gradient-to-br from-blue-400 to-cyan-500" :
                      "bg-gradient-to-br from-gray-400 to-slate-500"
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{insight.title}</h3>
                          <p className="text-blue-200 mt-1">{insight.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              insight.priority === "high" ? "border-green-400 text-green-400 bg-green-400/10" :
                              insight.priority === "medium" ? "border-blue-400 text-blue-400 bg-blue-400/10" :
                              "border-gray-400 text-gray-400 bg-gray-400/10"
                            )}
                          >
                            {insight.priority}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-blue-300 mb-1">Confidence</div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={insight.confidence} 
                              className="h-2 bg-blue-900/50"
                            />
                            <span className="text-sm text-white font-medium">{insight.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-blue-300 mb-1">Impact</div>
                          <div className="text-sm text-cyan-400 font-medium">{insight.impact}</div>
                        </div>
                        <div>
                          <div className="text-xs text-blue-300 mb-1">Timeline</div>
                          <div className="text-sm text-purple-400 font-medium">{insight.timeframe}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-purple-400 text-purple-400 bg-purple-400/10 text-xs">
                          {insight.category}
                        </Badge>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        >
                          {insight.action}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-black/20 border-blue-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-16 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
              onClick={() => navigate("/portfolio")}
            >
              <Eye className="h-5 w-5 mr-2" />
              Review Portfolio
            </Button>
            <Button 
              variant="outline" 
              className="h-16 border-blue-400/50 text-blue-400 hover:bg-blue-400/20"
              onClick={() => navigate("/research")}
            >
              <Brain className="h-5 w-5 mr-2" />
              Ask AI Assistant
            </Button>
            <Button 
              variant="outline" 
              className="h-16 border-purple-400/50 text-purple-400 hover:bg-purple-400/20"
              onClick={() => navigate("/markets")}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Check Markets
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
