import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIIntervention } from "@/lib/ai-agent";
import {
  X,
  TrendingUp,
  Shield,
  BarChart3,
  Target,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInterventionProps {
  intervention: AIIntervention;
  onDismiss: (id: string) => void;
  onAction?: (intervention: AIIntervention) => void;
}

const interventionIcons = {
  diversification: BarChart3,
  risk_check: Shield,
  rebalancing: TrendingUp,
  market_update: AlertTriangle,
  strategy_focus: Target,
};

const interventionColors = {
  low: "bg-blue-50 border-blue-200 text-blue-800",
  medium: "bg-amber-50 border-amber-200 text-amber-800", 
  high: "bg-red-50 border-red-200 text-red-800",
};

export function AIInterventionCard({ intervention, onDismiss, onAction }: AIInterventionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = interventionIcons[intervention.type] || Lightbulb;

  return (
    <Card
      className={cn(
        "border-l-4 shadow-sm",
        interventionColors[intervention.priority]
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <IconComponent className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm leading-tight">
                  {intervention.title}
                </h4>
                <p className="text-sm mt-1 leading-relaxed">
                  {intervention.message}
                </p>
                
                {/* Trigger reason (only when expanded) */}
                {isExpanded && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Trigger: {intervention.triggerReason}
                  </p>
                )}
              </div>

              {/* Dismiss button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(intervention.id)}
                className="h-6 w-6 p-0 flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              {intervention.actionText && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction?.(intervention)}
                  className="h-7 px-3 text-xs font-medium"
                >
                  {intervention.actionText}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 px-2 text-xs text-muted-foreground"
              >
                {isExpanded ? "Less" : "More"}
              </Button>
              
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {intervention.priority} priority
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AIInterventionsProps {
  interventions: AIIntervention[];
  onDismiss: (id: string) => void;
  onAction?: (intervention: AIIntervention) => void;
  className?: string;
}

export function AIInterventions({ 
  interventions, 
  onDismiss, 
  onAction, 
  className 
}: AIInterventionsProps) {
  if (interventions.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {interventions.map((intervention) => (
        <AIInterventionCard
          key={intervention.id}
          intervention={intervention}
          onDismiss={onDismiss}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
