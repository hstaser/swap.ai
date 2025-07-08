import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface StockCardProps {
  stock: Stock;
  onConfidenceSelect: (
    symbol: string,
    confidence: "not-interested" | "conservative" | "bullish" | "very-bullish",
  ) => void;
  onToggleWatchlist: (symbol: string) => void;
  isInWatchlist: boolean;
  className?: string;
}

export function StockCard({
  stock,
  onConfidenceSelect,
  onToggleWatchlist,
  isInWatchlist,
  className,
}: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <Card
      className={cn(
        "border-0 bg-white/90 backdrop-blur-sm shadow-lg",
        className,
      )}
    >
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <h3 className="font-bold text-foreground text-4xl">
              {stock.symbol}
            </h3>
            <Badge variant="outline" className="text-sm">
              {stock.sector}
            </Badge>
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
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">Volume</div>
            <div className="font-bold text-lg">{stock.volume}</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">Market Cap</div>
            <div className="font-bold text-lg">{stock.marketCap}</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">News Summary</div>
            <div className="font-bold text-sm text-primary leading-tight">
              {stock.newsSummary}
            </div>
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

        <Separator />

        {/* Confidence Level Buttons */}
        <div className="space-y-4">
          <h4 className="font-semibold text-center text-sm text-muted-foreground">
            Your Confidence Level
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onConfidenceSelect(stock.symbol, "not-interested")}
              className="h-12 text-sm font-semibold border-red-200 text-red-700 hover:bg-red-50"
            >
              Not Interested
            </Button>
            <Button
              variant="outline"
              onClick={() => onConfidenceSelect(stock.symbol, "conservative")}
              className="h-12 text-sm font-semibold border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              Conservative
            </Button>
            <Button
              variant="outline"
              onClick={() => onConfidenceSelect(stock.symbol, "bullish")}
              className="h-12 text-sm font-semibold border-green-200 text-green-700 hover:bg-green-50"
            >
              Bullish
            </Button>
            <Button
              variant="outline"
              onClick={() => onConfidenceSelect(stock.symbol, "very-bullish")}
              className="h-12 text-sm font-semibold border-green-300 text-green-800 hover:bg-green-100"
            >
              Very Bullish
            </Button>
          </div>

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
