import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users } from "lucide-react";

interface CommunitySentimentProps {
  symbol: string;
  className?: string;
}

export function CommunitySentiment({
  symbol,
  className,
}: CommunitySentimentProps) {
  // Mock data for demonstration - in real app this would come from API
  const bullishCount = 847;
  const bearishCount = 423;
  const totalFlags = bullishCount + bearishCount;
  const bullishPercentage = (bullishCount / totalFlags) * 100;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0">
      <CardContent className="p-4 space-y-4">
        {/* Community Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Community Sentiment</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {totalFlags.toLocaleString()} people
            </Badge>
          </div>

          {/* Sentiment Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                {bullishPercentage.toFixed(1)}% Bullish
              </span>
              <span className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-red-600" />
                {(100 - bullishPercentage).toFixed(1)}% Bearish
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                style={{ width: `${bullishPercentage}%` }}
              />
            </div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground">
                {bullishCount.toLocaleString()} bullish,{" "}
                {bearishCount.toLocaleString()} bearish
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
