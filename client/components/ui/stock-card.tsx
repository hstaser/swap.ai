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
  onAddToPortfolio: (symbol: string) => void;
  onToggleWatchlist: (symbol: string) => void;
  isInWatchlist: boolean;
  className?: string;
}

export function StockCard({
  stock,
  onAddToPortfolio,
  onToggleWatchlist,
  isInWatchlist,
  className,
}: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <Card className={cn("border-0 bg-white/50 backdrop-blur-sm", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-foreground text-3xl">
                {stock.symbol}
              </h3>
              <Badge variant="outline" className="text-xs bg-muted/50">
                {stock.sector}
              </Badge>
            </div>
            <p className="text-base text-muted-foreground">{stock.name}</p>
          </div>
        </div>

        {/* Price and Change */}
        <div className="space-y-2">
          <div className="text-4xl font-bold text-foreground">
            ${stock.price.toFixed(2)}
          </div>
          <div
            className={cn(
              "flex items-center gap-2 text-lg font-medium",
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

        <Separator />

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Volume</span>
            <div className="font-semibold text-lg">{stock.volume}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <div className="font-semibold text-lg">{stock.marketCap}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">P/E</span>
            <div className="font-semibold text-lg">
              {stock.pe ? stock.pe.toFixed(2) : "N/A"}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Div Yield</span>
            <div className="font-semibold text-lg">
              {stock.dividendYield
                ? `${stock.dividendYield.toFixed(2)}%`
                : "N/A"}
            </div>
          </div>
        </div>

        <Separator />

        {/* Recent News */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent News
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {stock.news.map((newsItem, index) => (
              <div key={index} className="p-3 bg-white/60 rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="font-medium text-sm line-clamp-2 flex-1">
                    {newsItem.title}
                  </h5>
                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{newsItem.source}</span>
                  <span>•</span>
                  <span>{newsItem.time}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {newsItem.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onAddToPortfolio(stock.symbol)}
              className="w-full"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Portfolio
            </Button>
            <Button
              variant="outline"
              onClick={() => onToggleWatchlist(stock.symbol)}
              className="w-full"
              size="lg"
            >
              {isInWatchlist ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {isInWatchlist ? "Remove" : "Watchlist"}
            </Button>
          </div>
          <Button variant="ghost" className="w-full" size="lg">
            <ExternalLink className="h-4 w-4 mr-2" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
