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
            <div className="text-sm text-muted-foreground">P/E</div>
            <div className="font-bold text-lg">
              {stock.pe ? stock.pe.toFixed(2) : "N/A"}
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

        {/* Recent News */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-center flex items-center justify-center gap-2">
            <Clock className="h-5 w-5" />
            Recent News
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stock.news.slice(0, 3).map((newsItem, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className="font-semibold text-sm leading-tight flex-1">
                    {newsItem.title}
                  </h5>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="font-medium">{newsItem.source}</span>
                  <span>•</span>
                  <span>{newsItem.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {newsItem.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onAddToPortfolio(stock.symbol)}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add to Portfolio
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onToggleWatchlist(stock.symbol)}
              className="h-12 font-semibold"
              size="lg"
            >
              {isInWatchlist ? (
                <EyeOff className="h-5 w-5 mr-2" />
              ) : (
                <Eye className="h-5 w-5 mr-2" />
              )}
              {isInWatchlist ? "Remove" : "Watchlist"}
            </Button>

            <Button variant="outline" className="h-12 font-semibold" size="lg">
              <ExternalLink className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
