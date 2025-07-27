import { useState } from "react";
import { useAIAgent } from "@/hooks/use-ai-agent";
import { useQueue } from "@/hooks/use-queue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AIInterventions } from "@/components/ui/ai-intervention";
import { AIChat } from "@/components/ui/ai-chat";
import { BottomNav } from "@/components/ui/bottom-nav";
import {
  Bot,
  Brain,
  TrendingUp,
  Target,
  Activity,
  MessageCircle,
  Settings,
  Shield,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, Link } from "react-router-dom";

export default function AIAgent() {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "interventions" | "settings">("overview");

  const { isSetup, interventions, dismissIntervention, getInsights } = useAIAgent();
  const { queue } = useQueue();

  const insights = getInsights();

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">AI Agent Not Set Up</CardTitle>
            <p className="text-muted-foreground">
              Complete your onboarding to activate your AI investment assistant
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => {
                // Clear onboarding flag to force AI setup
                localStorage.removeItem("onboarding_completed");
                navigate("/");
              }}
              className="w-full"
            >
              Complete Setup
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInterventionAction = (intervention: any) => {
    if (intervention.actionType === "view_suggestions") {
      setActiveTab("insights");
    } else if (intervention.actionType === "adjust_strategy") {
      setShowChat(true);
    } else if (intervention.actionType === "rebalance") {
      navigate("/portfolio");
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* AI Status Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Your AI Agent is Active</h3>
              <p className="text-muted-foreground">
                Learning from your behavior and providing smart insights
              </p>
            </div>
            <Button
              onClick={() => setShowChat(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{insights.totalSwipes || 0}</div>
            <div className="text-sm text-muted-foreground">Decisions Made</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{queue.length}</div>
            <div className="text-sm text-muted-foreground">Stocks Queued</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{insights.topSectors?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Top Sectors</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{insights.riskPreference || "Medium"}</div>
            <div className="text-sm text-muted-foreground">Risk Profile</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interventions */}
      {interventions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Interventions</h3>
          <AIInterventions
            interventions={interventions}
            onDismiss={dismissIntervention}
            onAction={handleInterventionAction}
          />
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => setShowChat(true)}
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <MessageCircle className="h-6 w-6" />
            <span>Ask AI</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/portfolio")}
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <TrendingUp className="h-6 w-6" />
            <span>Review Portfolio</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Behavioral Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sector Preferences */}
          <div>
            <h4 className="font-medium mb-3">Preferred Sectors</h4>
            <div className="space-y-2">
              {insights.topSectors?.slice(0, 3).map((sector, index) => (
                <div key={sector} className="flex items-center justify-between">
                  <span className="text-sm">{sector}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${100 - (index * 20)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {100 - (index * 20)}%
                    </span>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">
                  Start swiping on stocks to see your preferences develop
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Risk Profile */}
          <div>
            <h4 className="font-medium mb-3">Risk Analysis</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Risk Level</span>
                  <span className="font-medium">{insights.riskPreference}</span>
                </div>
                <Progress
                  value={
                    insights.riskPreference === "Low" ? 25 :
                    insights.riskPreference === "Medium" ? 50 :
                    insights.riskPreference === "High" ? 75 : 50
                  }
                  className="h-2"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Summary */}
          <div>
            <h4 className="font-medium mb-3">Activity Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Swipes:</span>
                <span className="ml-2 font-medium">{insights.totalSwipes || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Streak Days:</span>
                <span className="ml-2 font-medium">{insights.streakDays || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900">Portfolio Diversification</h5>
              <p className="text-sm text-blue-800 mt-1">
                Consider adding exposure to defensive sectors like Healthcare or Utilities to balance your tech-heavy portfolio.
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <h5 className="font-medium text-green-900">Risk Management</h5>
              <p className="text-sm text-green-800 mt-1">
                Your current risk level aligns well with your moderate tolerance. Consider maintaining this balance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInterventions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Interventions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Smart nudges to keep your investment strategy on track
          </p>
        </CardHeader>
        <CardContent>
          {interventions.length > 0 ? (
            <AIInterventions
              interventions={interventions}
              onDismiss={dismissIntervention}
              onAction={handleInterventionAction}
            />
          ) : (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium text-gray-900 mb-2">No Active Interventions</h3>
              <p className="text-sm text-gray-500">
                Your portfolio looks good! I'll notify you if anything needs attention.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Smart Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Get AI-powered portfolio alerts
              </p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Learning Mode</h4>
              <p className="text-sm text-muted-foreground">
                Allow AI to learn from your behavior
              </p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Chat History</h4>
              <p className="text-sm text-muted-foreground">
                Save conversation history
              </p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>

          <Separator />

          <Button variant="outline" className="w-full">
            Reset AI Learning Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold">AI Agent</h1>
              </div>
            </div>

            <Button
              onClick={() => setShowChat(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with AI
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex gap-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 mb-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "insights", label: "Insights", icon: Brain },
            { id: "interventions", label: "Interventions", icon: Target },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 min-w-fit whitespace-nowrap"
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <div className="pb-20 md:pb-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "insights" && renderInsights()}
          {activeTab === "interventions" && renderInterventions()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </div>

      {/* AI Chat Modal */}
      <AIChat isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
