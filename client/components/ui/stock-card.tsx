import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface StockCardProps {
  stock: Stock;
  onAddToPortfolio: (symbol: string) => void;
  className?: string;
}

export function StockCard({
  stock,
  onAddToPortfolio,
  className,
}: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-white/50 backdrop-blur-sm",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-lg">
                {stock.symbol}
              </h3>
              <Badge variant="outline" className="text-xs bg-muted/50">
                {stock.sector}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {stock.name}
            </p>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToPortfolio(stock.symbol);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              ${stock.price.toFixed(2)}
            </span>
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive ? "text-success" : "text-destructive",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Volume</span>
              <div className="font-medium">{stock.volume}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Market Cap</span>
              <div className="font-medium">{stock.marketCap}</div>
            </div>
            <div>
              <span className="text-muted-foreground">P/E</span>
              <div className="font-medium">
                {stock.pe ? stock.pe.toFixed(2) : "N/A"}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Div Yield</span>
              <div className="font-medium">
                {stock.dividendYield
                  ? `${stock.dividendYield.toFixed(2)}%`
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
