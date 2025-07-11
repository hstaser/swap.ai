import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchSuggestion {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  isPopular?: boolean;
  isTrending?: boolean;
}

const searchSuggestions: SearchSuggestion[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 182.52,
    change: 2.31,
    changePercent: 1.28,
    volume: "52.4M",
    isPopular: true,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    sector: "Consumer Discretionary",
    price: 238.77,
    change: -8.32,
    changePercent: -3.37,
    volume: "89.7M",
    isTrending: true,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    price: 722.48,
    change: 12.66,
    changePercent: 1.78,
    volume: "67.8M",
    isTrending: true,
  },
  {
    symbol: "META",
    name: "Meta Platforms, Inc.",
    sector: "Communication Services",
    price: 328.45,
    change: 5.67,
    changePercent: 1.76,
    volume: "18.3M",
    isPopular: true,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Communication Services",
    price: 138.21,
    change: 3.45,
    changePercent: 2.56,
    volume: "31.2M",
    isPopular: true,
  },
];

const recentSearches = ["AAPL", "MSFT", "GOOGL"];
const trendingStocks = ["NVDA", "AMD", "PLTR", "RIVN", "COIN"];

interface StockSearchProps {
  onStockSelect?: (symbol: string) => void;
  onFilterOverride?: (symbol: string) => void;
  className?: string;
}

export function StockSearch({
  onStockSelect,
  onFilterOverride,
  className,
}: StockSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchSuggestions.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.sector.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
      setIsOpen(true);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [searchQuery]);

  const handleStockClick = (symbol: string) => {
    if (onStockSelect) {
      onStockSelect(symbol);
    } else {
      navigate(`/stock/${symbol}`);
    }
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleQuickSelect = (symbol: string) => {
    // Override filters and navigate to specific stock
    if (onFilterOverride) {
      onFilterOverride(symbol);
    } else {
      navigate(`/?symbol=${symbol}`);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks, companies, or sectors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setIsOpen(true)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white shadow-lg border-0">
          <CardContent className="p-0 max-h-80 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              <div className="space-y-1 p-2">
                {filteredSuggestions.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock.symbol)}
                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{stock.symbol}</span>
                        <Badge variant="outline" className="text-xs">
                          {stock.sector}
                        </Badge>
                        {stock.isPopular && (
                          <Star className="h-3 w-3 text-yellow-500" />
                        )}
                        {stock.isTrending && (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${stock.price.toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            "text-xs",
                            stock.change >= 0
                              ? "text-success"
                              : "text-destructive",
                          )}
                        >
                          {stock.change >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {stock.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No stocks found for "{searchQuery}"
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Access - Recent & Trending */}
      {!searchQuery && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Recent
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((symbol) => (
                <Button
                  key={symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(symbol)}
                  className="h-8"
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Trending
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingStocks.map((symbol) => (
                <Button
                  key={symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(symbol)}
                  className="h-8"
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
