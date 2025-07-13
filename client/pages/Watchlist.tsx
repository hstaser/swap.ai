import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Bell,
  Settings,
  Wallet,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NotificationSystem } from "@/components/ui/notifications";

interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  marketCap: string;
  volume: string;
}

const mockWatchlistStocks: WatchlistStock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 182.52,
    change: 2.31,
    changePercent: 1.28,
    sector: "Technology",
    marketCap: "2.85T",
    volume: "52.4M",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 238.77,
    change: -8.32,
    changePercent: -3.37,
    sector: "Consumer Discretionary",
    marketCap: "759.8B",
    volume: "89.7M",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.85,
    change: -1.52,
    changePercent: -0.4,
    sector: "Technology",
    marketCap: "2.81T",
    volume: "28.1M",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 722.48,
    change: 12.66,
    changePercent: 1.78,
    sector: "Technology",
    marketCap: "1.78T",
    volume: "67.8M",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 138.21,
    change: 3.45,
    changePercent: 2.56,
    sector: "Communication Services",
    marketCap: "1.75T",
    volume: "31.2M",
  },
  {
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 328.45,
    change: 5.67,
    changePercent: 1.76,
    sector: "Communication Services",
    marketCap: "832.1B",
    volume: "18.3M",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    price: 102.33,
    change: -2.14,
    changePercent: -2.05,
    sector: "Technology",
    marketCap: "165.2B",
    volume: "45.7M",
  },
];

export default function Watchlist() {
  const [watchlistStocks, setWatchlistStocks] = useState(mockWatchlistStocks);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const removeFromWatchlist = (symbol: string) => {
    setWatchlistStocks(
      watchlistStocks.filter((stock) => stock.symbol !== symbol),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Watchlist
                </h1>
                <p className="text-sm text-muted-foreground">
                  {watchlistStocks.length} stocks watching
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isEditing ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Done" : "Edit"}
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Add Stock Button */}
        <Button asChild className="w-full h-12 text-lg font-semibold">
          <Link to="/">
            <Plus className="h-5 w-5 mr-2" />
            Add More Stocks
          </Link>
        </Button>

        {/* Stock List */}
        <div className="space-y-3">
          {watchlistStocks.map((stock) => {
            const isPositive = stock.change >= 0;

            return (
              <Card
                key={stock.symbol}
                className="bg-white/90 backdrop-blur-sm border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => !isEditing && navigate(`/stock/${stock.symbol}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">
                              {stock.symbol}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {stock.sector}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {stock.name}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div
                            className={cn(
                              "flex items-center justify-end gap-1 text-sm font-medium",
                              isPositive ? "text-success" : "text-destructive",
                            )}
                          >
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>
                              {isPositive ? "+" : ""}
                              {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Volume</span>
                          <div className="font-medium">{stock.volume}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Market Cap
                          </span>
                          <div className="font-medium">{stock.marketCap}</div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-4 pt-3 border-t">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromWatchlist(stock.symbol);
                              }}
                              className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-white"
                            >
                              <EyeOff className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Portfolio
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {watchlistStocks.length === 0 && (
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Start adding stocks you want to keep track of
            </p>
            <Button asChild size="lg">
              <Link to="/">
                <Plus className="h-5 w-5 mr-2" />
                Browse Stocks
              </Link>
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        {!isEditing && watchlistStocks.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate("/markets")}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Market Analysis
            </Button>
            <Button
              variant="outline"
              className="h-12"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </Button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <NotificationSystem
              className="border shadow-lg"
              onPreferencesChange={(prefs) =>
                console.log("Preferences updated:", prefs)
              }
            />
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowNotifications(false)}
                className="bg-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
