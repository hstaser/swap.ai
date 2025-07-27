import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Target,
  AlertTriangle,
  Lightbulb 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidenceHintProps {
  symbol: string;
  userConfidenceLevel?: "conservative" | "bullish" | "very-bullish";
  stockRisk?: "Low" | "Medium" | "High";
  sector?: string;
  className?: string;
}

export function ConfidenceHint({ 
  symbol, 
  userConfidenceLevel, 
  stockRisk,
  sector,
  className 
}: ConfidenceHintProps) {
  
  // Generate subtle hints based on confidence patterns
  const getHint = () => {
    // High confidence + High risk stock
    if (userConfidenceLevel === "very-bullish" && stockRisk === "High") {
      return {
        icon: AlertTriangle,
        text: "High conviction + high risk. Consider position sizing.",
        type: "warning" as const,
      };
    }
    
    // Conservative user picking aggressive stock
    if (userConfidenceLevel === "conservative" && stockRisk === "High") {
      return {
        icon: Shield,
        text: "This is riskier than your usual picks. AI can show safer alternatives.",
        type: "suggestion" as const,
      };
    }
    
    // High concentration risk
    if (symbol === "AAPL") {
      return {
        icon: Target,
        text: "Consider balancing with non-tech exposure.",
        type: "info" as const,
      };
    }
    
    // Sector momentum
    if (sector === "Technology") {
      return {
        icon: TrendingUp,
        text: "Tech is hot. AI can suggest complementary defensive plays.",
        type: "opportunity" as const,
      };
    }
    
    return null;
  };

  const hint = getHint();
  if (!hint) return null;

  const colors = {
    warning: "text-amber-600 bg-amber-50 border-amber-200",
    suggestion: "text-blue-600 bg-blue-50 border-blue-200", 
    info: "text-gray-600 bg-gray-50 border-gray-200",
    opportunity: "text-green-600 bg-green-50 border-green-200",
  };

  const IconComponent = hint.icon;

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg border text-xs",
      colors[hint.type],
      className
    )}>
      <IconComponent className="h-3 w-3 flex-shrink-0" />
      <span className="leading-tight">{hint.text}</span>
    </div>
  );
}

// Hook for queue-wide confidence analysis
export function useConfidenceAnalysis(queue: Array<{symbol: string; confidence: string}>) {
  const analysis = () => {
    if (queue.length === 0) return null;
    
    const highConfidenceCount = queue.filter(item => 
      item.confidence === "very-bullish"
    ).length;
    
    const conservativeCount = queue.filter(item =>
      item.confidence === "conservative" 
    ).length;
    
    // Too many high-conviction bets
    if (highConfidenceCount > 3) {
      return {
        type: "overconfidence" as const,
        message: "You have 4+ high-conviction picks. Consider some moderate positions for balance.",
        action: "AI can suggest complementary lower-risk adds"
      };
    }
    
    // All conservative picks
    if (conservativeCount === queue.length && queue.length > 2) {
      return {
        type: "too_conservative" as const,
        message: "All conservative picks detected. You might be missing growth opportunities.",
        action: "AI can suggest 1-2 growth additions"
      };
    }
    
    return null;
  };
  
  return analysis();
}
