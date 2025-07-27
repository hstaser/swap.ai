import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SmartPrompt {
  id: string;
  title: string;
  description: string;
  type: "warning" | "suggestion" | "info" | "opportunity";
  actions: Array<{
    label: string;
    action: "primary" | "secondary" | "dismiss";
    onClick: () => void;
  }>;
  dismissible?: boolean;
  collapsible?: boolean;
  priority?: "low" | "medium" | "high";
}

interface SmartPromptCardProps {
  prompt: SmartPrompt;
  onDismiss?: (id: string) => void;
  className?: string;
}

const promptIcons = {
  warning: AlertTriangle,
  suggestion: Target,
  info: BarChart3,
  opportunity: TrendingDown,
};

const promptColors = {
  warning: {
    card: "border-l-amber-400 bg-amber-50/50",
    icon: "text-amber-600",
    title: "text-amber-900",
    description: "text-amber-700",
  },
  suggestion: {
    card: "border-l-blue-400 bg-blue-50/50",
    icon: "text-blue-600",
    title: "text-blue-900",
    description: "text-blue-700",
  },
  info: {
    card: "border-l-gray-400 bg-gray-50/50",
    icon: "text-gray-600",
    title: "text-gray-900",
    description: "text-gray-700",
  },
  opportunity: {
    card: "border-l-green-400 bg-green-50/50",
    icon: "text-green-600",
    title: "text-green-900",
    description: "text-green-700",
  },
};

export function SmartPromptCard({ prompt, onDismiss, className }: SmartPromptCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const IconComponent = promptIcons[prompt.type];
  const colors = promptColors[prompt.type];

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(prompt.id), 200);
  };

  if (!isVisible) return null;

  return (
    <Card
      className={cn(
        "transition-all duration-200 border-l-4 shadow-sm",
        colors.card,
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <IconComponent className={cn("h-5 w-5", colors.icon)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h4 className={cn("font-medium text-sm leading-tight", colors.title)}>
                  {prompt.title}
                </h4>
                {prompt.priority && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs mt-1 h-4 px-1.5"
                  >
                    {prompt.priority} priority
                  </Badge>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {prompt.collapsible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="h-6 w-6 p-0"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronUp className="h-3 w-3" />
                    )}
                  </Button>
                )}

                {prompt.dismissible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Description and Actions */}
            {!isCollapsed && (
              <div className="space-y-3">
                <p className={cn("text-sm leading-relaxed", colors.description)}>
                  {prompt.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {prompt.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={
                        action.action === "primary" 
                          ? "default" 
                          : action.action === "secondary" 
                          ? "outline" 
                          : "ghost"
                      }
                      size="sm"
                      onClick={action.onClick}
                      className={cn(
                        "h-7 px-3 text-xs font-medium",
                        action.action === "dismiss" && "text-muted-foreground"
                      )}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Preset prompt generators
export const createTechOverweightPrompt = (percentage: number): SmartPrompt => ({
  id: "tech_overweight",
  title: "Your portfolio is heavy in tech",
  description: `You have ${percentage}% in technology stocks. Consider diversifying into other sectors like healthcare or financials for better balance.`,
  type: "warning",
  priority: "medium",
  actions: [
    {
      label: "Fix This",
      action: "primary",
      onClick: () => console.log("Navigate to rebalancing"),
    },
    {
      label: "See Options",
      action: "secondary", 
      onClick: () => console.log("Show diversification suggestions"),
    },
    {
      label: "Remind Later",
      action: "dismiss",
      onClick: () => console.log("Remind in 24h"),
    },
  ],
  dismissible: true,
  collapsible: true,
});

export const createConfidenceMismatchPrompt = (stockSymbol: string): SmartPrompt => ({
  id: "confidence_mismatch",
  title: "This doesn't match your usual picks",
  description: `${stockSymbol} is riskier than your typical investments. Your profile suggests more conservative options.`,
  type: "suggestion",
  priority: "low",
  actions: [
    {
      label: "See Alternatives",
      action: "primary",
      onClick: () => console.log("Show similar but safer stocks"),
    },
    {
      label: "Keep Anyway",
      action: "secondary",
      onClick: () => console.log("Add to queue regardless"),
    },
    {
      label: "Got It",
      action: "dismiss",
      onClick: () => console.log("Dismiss"),
    },
  ],
  dismissible: true,
});

export const createOpportunityPrompt = (sector: string): SmartPrompt => ({
  id: "sector_opportunity",
  title: `${sector} is looking attractive`,
  description: "Prices are down 8% this week but fundamentals remain strong. Good time to add exposure if you're underweight.",
  type: "opportunity",
  priority: "medium",
  actions: [
    {
      label: "Show Stocks",
      action: "primary",
      onClick: () => console.log(`Filter to ${sector} stocks`),
    },
    {
      label: "Learn More",
      action: "secondary",
      onClick: () => console.log("Show sector analysis"),
    },
    {
      label: "Not Now",
      action: "dismiss",
      onClick: () => console.log("Dismiss"),
    },
  ],
  dismissible: true,
});
