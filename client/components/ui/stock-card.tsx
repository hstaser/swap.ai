import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StockChart } from "./stock-chart";
import { CommunitySentiment } from "./community-sentiment";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  summary: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  pe: number | null;
  dividendYield: number | null;
  sector: string;
  isGainer: boolean;
  news: NewsItem[];
  newsSummary: string;
  returns?: {
    oneMonth: number;
    sixMonth: number;
    oneYear: number;
  };
  earningsDate?: string;
  risk?: "Low" | "Medium" | "High";
}

interface StockCardProps {
  stock: Stock;
  onToggleWatchlist: (symbol: string) => void;
  isInWatchlist: boolean;
  className?: string;
}

export function StockCard({
  stock,
  onToggleWatchlist,
  isInWatchlist,
  className,
}: StockCardProps) {
  const isPositive = stock.change >= 0;
  const [showChart, setShowChart] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "border-0 bg-white/90 backdrop-blur-sm shadow-lg",
        className,
      )}
    >
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="relative text-center space-y-3">
          {/* Earnings Alert Icon */}
          {stock.earningsDate && (
            <div className="absolute top-0 right-0">
              <div className="group relative">
                <AlertCircle className="h-5 w-5 text-yellow-600 animate-pulse cursor-pointer" />
                <div className="absolute right-0 top-6 invisible group-hover:visible bg-black text-white text-xs rounded-lg p-2 w-48 z-10">
                  <div className="font-semibold">
                    📅 Earnings: {stock.earningsDate}
                  </div>
                  <div className="text-xs opacity-90">
                    Less than 2 weeks away
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <h3 className="font-bold text-foreground text-4xl">
              {stock.symbol}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {stock.sector}
              </Badge>
              {stock.risk && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2 py-0.5",
                    stock.risk === "Low" &&
                      "bg-green-100 text-green-800 border-green-300",
                    stock.risk === "Medium" &&
                      "bg-yellow-100 text-yellow-800 border-yellow-300",
                    stock.risk === "High" &&
                      "bg-red-100 text-red-800 border-red-300",
                  )}
                >
                  {stock.risk} Risk
                </Badge>
              )}
            </div>
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            {stock.name}
          </p>
        </div>

        {/* Price and Change */}
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-foreground">
            ${stock.price.toFixed(2)}
          </div>
          <div
            className={cn(
              "flex items-center justify-center gap-2 text-xl font-semibold",
              isPositive ? "text-success" : "text-destructive",
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="font-bold text-lg">{stock.marketCap}</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">Div Yield</div>
              <div className="font-bold text-lg">
                {stock.dividendYield
                  ? `${stock.dividendYield.toFixed(2)}%`
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Returns Section with Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Recent Returns
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChart(true)}
                className="h-6 px-2 text-xs"
              >
                Chart
              </Button>
            </div>
            <div className="flex gap-2">
              {[
                { label: "1M", value: stock.returns?.oneMonth || 2.4 },
                { label: "6M", value: stock.returns?.sixMonth || 8.7 },
                { label: "1Y", value: stock.returns?.oneYear || 15.3 },
              ].map((period) => (
                <div
                  key={period.label}
                  className="flex-1 p-2 bg-gray-50 rounded text-center"
                >
                  <div className="text-xs text-muted-foreground">
                    {period.label}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      period.value >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {period.value >= 0 ? "+" : ""}
                    {period.value.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Summary */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">News Summary</div>
            <div className="font-bold text-sm text-primary leading-tight">
              {stock.newsSummary}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/stock/${stock.symbol}/news`)}
              className="h-6 px-2 text-xs text-blue-600"
            >
              See More
            </Button>
          </div>
        </div>

        <Separator />

        {/* Community Sentiment */}
        <CommunitySentiment symbol={stock.symbol} />

        {/* Chart Modal */}
        {showChart && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <StockChart
              symbol={stock.symbol}
              onClose={() => setShowChart(false)}
            />
          </div>
        )}

        <Separator />

        {/* AI Assistance Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate(`/research?symbol=${stock.symbol}`)}
            className="w-full h-12 text-sm font-medium border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Need help? Ask AI about {stock.symbol}
          </Button>
        </div>

        <Separator />

        {/* Add to Queue Button */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate(`/queue/add/${stock.symbol}`)}
            className="w-full h-12 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Queue
          </Button>

          {/* Watchlist Button */}
          <Button
            variant="ghost"
            onClick={() => onToggleWatchlist(stock.symbol)}
            className="w-full h-12 text-sm font-medium text-muted-foreground"
          >
            {isInWatchlist ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Remove from Watchlist
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Not sure? Add to Watchlist
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
