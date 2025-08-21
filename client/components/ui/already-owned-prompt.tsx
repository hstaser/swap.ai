import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeOff, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlreadyOwnedPromptProps {
  symbol: string;
  onHideOwned: () => void;
  onDismiss: () => void;
  className?: string;
}

export function AlreadyOwnedPrompt({ 
  symbol, 
  onHideOwned, 
  onDismiss, 
  className 
}: AlreadyOwnedPromptProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn(
      "border-blue-200 bg-blue-50 shadow-md transition-all duration-200",
      isExpanded ? "mb-4" : "mb-2",
      className
    )}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              Already Owned
            </Badge>
            <span className="text-sm font-medium text-blue-900">
              You own {symbol}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
            >
              <ChevronRight className={cn(
                "h-3 w-3 transition-transform",
                isExpanded && "rotate-90"
              )} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700 mb-3">
              Want to focus on discovering new stocks? You can hide stocks you already own from your swipe feed.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onHideOwned}
                className="flex-1 h-8 text-xs bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <EyeOff className="h-3 w-3 mr-1" />
                Hide Owned Stocks
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-8 text-xs text-blue-600 hover:bg-blue-100"
              >
                Keep Showing All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
