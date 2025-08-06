import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Shield,
  TrendingDown,
  Clock,
  Brain,
  BookOpen,
  X,
  Settings,
  Eye,
  Calendar,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RiskIntervention {
  id: string;
  type: "portfolio_risk" | "swipe_warning" | "rebalance_guidance" | "educational" | "protective";
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
  context?: {
    symbol?: string;
    percentage?: number;
    sector?: string;
    timeframe?: string;
  };
  actions: Array<{
    label: string;
    type: "primary" | "secondary" | "dismiss";
    action: () => void;
  }>;
  educational?: {
    concept: string;
    explanation: string;
    learnMoreUrl?: string;
  };
  dismissible: boolean;
}

interface RiskInterventionSystemProps {
  interventions: RiskIntervention[];
  onDismiss: (id: string) => void;
  onUpdateSettings: (settings: RiskSettings) => void;
  userSettings: RiskSettings;
}

export interface RiskSettings {
  aiAssistanceLevel: "full" | "moderate" | "minimal" | "off";
  sectorConcentrationLimit: number;
  volatilityWarnings: boolean;
  earningsAlerts: boolean;
  educationalMode: boolean;
  stopLossAlerts: boolean;
}

const severityColors = {
  low: "border-l-blue-400 bg-blue-50/50 text-blue-800",
  medium: "border-l-amber-400 bg-amber-50/50 text-amber-800",
  high: "border-l-red-400 bg-red-50/50 text-red-800",
};

const severityIcons = {
  low: Brain,
  medium: AlertTriangle,
  high: Shield,
};

export function RiskInterventionSystem({
  interventions,
  onDismiss,
  onUpdateSettings,
  userSettings
}: RiskInterventionSystemProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(userSettings);

  const activeInterventions = interventions.filter(i => !i.dismissible || true);

  const handleSettingsUpdate = () => {
    onUpdateSettings(localSettings);
    setShowSettings(false);
  };

  if (showSettings) {
    return (
      <Card className="border-l-4 border-l-purple-400 bg-purple-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-purple-900">AI Risk Settings</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* AI Assistance Level */}
            <div>
              <label className="text-sm font-medium text-purple-900">AI Assistance Level</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["full", "moderate", "minimal", "off"].map((level) => (
                  <Button
                    key={level}
                    variant={localSettings.aiAssistanceLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLocalSettings(prev => ({ ...prev, aiAssistanceLevel: level as any }))}
                    className="text-xs capitalize"
                  >
                    {level === "off" ? "Turn Off" : level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Concentration Limits */}
            <div>
              <label className="text-sm font-medium text-purple-900">
                Sector Concentration Limit: {localSettings.sectorConcentrationLimit}%
              </label>
              <div className="mt-2">
                <input
                  type="range"
                  min="20"
                  max="50"
                  step="5"
                  value={localSettings.sectorConcentrationLimit}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    sectorConcentrationLimit: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-600 mt-1">
                  <span>20% (Conservative)</span>
                  <span>50% (Aggressive)</span>
                </div>
              </div>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-3">
              {[
                { key: "volatilityWarnings", label: "High volatility warnings", icon: TrendingDown },
                { key: "earningsAlerts", label: "Earnings date alerts", icon: Calendar },
                { key: "educationalMode", label: "Educational explanations", icon: BookOpen },
                { key: "stopLossAlerts", label: "Stop-loss suggestions", icon: Shield },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-900">{label}</span>
                  </div>
                  <Switch
                    checked={localSettings[key as keyof RiskSettings] as boolean}
                    onCheckedChange={(checked) =>
                      setLocalSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>

            <Button onClick={handleSettingsUpdate} className="w-full" size="sm">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeInterventions.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Settings Access */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">AI Risk Assistant</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="h-6 px-2 text-xs"
        >
          <Settings className="h-3 w-3 mr-1" />
          Settings
        </Button>
      </div>

      {/* Active Interventions */}
      {activeInterventions.map((intervention) => {
        const SeverityIcon = severityIcons[intervention.severity];

        return (
          <RiskInterventionCard
            key={intervention.id}
            intervention={intervention}
            onDismiss={onDismiss}
          />
        );
      })}
    </div>
  );
}

function RiskInterventionCard({
  intervention,
  onDismiss
}: {
  intervention: RiskIntervention;
  onDismiss: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const SeverityIcon = severityIcons[intervention.severity];

  return (
    <Card className={cn("border-l-4 transition-all", severityColors[intervention.severity])}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <SeverityIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-medium text-sm leading-tight">{intervention.title}</h4>
                <p className="text-sm mt-1">{intervention.message}</p>
              </div>

              {intervention.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(intervention.id)}
                  className="h-6 w-6 p-0 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Context Info */}
            {intervention.context && (
              <div className="flex gap-4 text-xs mb-3">
                {intervention.context.symbol && (
                  <span className="font-mono font-bold">{intervention.context.symbol}</span>
                )}
                {intervention.context.percentage && (
                  <span>{intervention.context.percentage}% allocation</span>
                )}
                {intervention.context.sector && (
                  <span>{intervention.context.sector} sector</span>
                )}
              </div>
            )}

            {/* Educational Content */}
            {intervention.educational && (
              <div className="mb-3 p-3 bg-white/50 rounded-lg border">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-blue-900">
                      Learn: {intervention.educational.concept}
                    </h5>
                    <p className="text-xs text-blue-800 mt-1">
                      {intervention.educational.explanation}
                    </p>
                    {intervention.educational.learnMoreUrl && (
                      <Button variant="ghost" size="sm" className="h-6 px-2 mt-2 text-xs">
                        Learn More
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {intervention.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={
                    action.type === "primary" ? "default" :
                    action.type === "secondary" ? "outline" : "ghost"
                  }
                  size="sm"
                  onClick={action.action}
                  className="h-7 px-3 text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>

            {/* AI Disclaimer */}
            <div className="mt-3 pt-2 border-t border-current/20">
              <p className="text-xs opacity-75">
                AI-generated suggestion based on your goals, not personalized financial advice.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Example interventions generator
export function generateSampleInterventions(portfolio: any[], queue: any[]): RiskIntervention[] {
  const interventions: RiskIntervention[] = [];

  // Portfolio Risk Check
  interventions.push({
    id: "tech_concentration",
    type: "portfolio_risk",
    severity: "medium",
    title: "High tech concentration detected",
    message: "You've invested 70% in tech — want to spread risk across other sectors?",
    context: { percentage: 70, sector: "Technology" },
    actions: [
      { label: "Show Alternatives", type: "primary", action: () => console.log("Show alternatives") },
      { label: "Keep Anyway", type: "secondary", action: () => console.log("Keep") },
      { label: "Remind Later", type: "dismiss", action: () => console.log("Remind later") },
    ],
    dismissible: true,
  });

  // Swipe Warning
  interventions.push({
    id: "risk_mismatch",
    type: "swipe_warning",
    severity: "low",
    title: "Outside your usual comfort zone",
    message: "This stock moves ~3x more than the market. Great upside, but high risk.",
    context: { symbol: "TSLA" },
    educational: {
      concept: "Beta and Volatility",
      explanation: "Beta measures how much a stock moves compared to the overall market. A beta of 3 means the stock typically moves 3x more than the market.",
    },
    actions: [
      { label: "See Alternatives", type: "primary", action: () => console.log("Alternatives") },
      { label: "Add to Watchlist", type: "secondary", action: () => console.log("Watchlist") },
      { label: "Continue Anyway", type: "dismiss", action: () => console.log("Continue") },
    ],
    dismissible: true,
  });

  // Educational Guardrail
  interventions.push({
    id: "negative_cashflow",
    type: "educational",
    severity: "medium",
    title: "Learning opportunity detected",
    message: "This company has negative free cash flow. Want to learn what this means?",
    context: { symbol: "UBER" },
    educational: {
      concept: "Free Cash Flow",
      explanation: "Free cash flow is the cash a company generates after paying for capital expenditures. Negative FCF means the company is spending more cash than it's generating from operations.",
      learnMoreUrl: "/learn/free-cash-flow",
    },
    actions: [
      { label: "Learn More", type: "primary", action: () => console.log("Learn") },
      { label: "Skip This Stock", type: "secondary", action: () => console.log("Skip") },
      { label: "Got It", type: "dismiss", action: () => console.log("Dismiss") },
    ],
    dismissible: true,
  });

  // Protective Notification
  interventions.push({
    id: "earnings_tomorrow",
    type: "protective",
    severity: "high",
    title: "Earnings release tomorrow",
    message: "AAPL reports earnings tomorrow — want to wait and review after that?",
    context: { symbol: "AAPL", timeframe: "tomorrow" },
    actions: [
      { label: "Wait for Earnings", type: "primary", action: () => console.log("Wait") },
      { label: "Buy Now Anyway", type: "secondary", action: () => console.log("Buy now") },
      { label: "Set Reminder", type: "dismiss", action: () => console.log("Remind") },
    ],
    dismissible: true,
  });

  return interventions;
}

// Default risk settings
export const defaultRiskSettings: RiskSettings = {
  aiAssistanceLevel: "moderate",
  sectorConcentrationLimit: 30,
  volatilityWarnings: true,
  earningsAlerts: true,
  educationalMode: true,
  stopLossAlerts: false,
};
