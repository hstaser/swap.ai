import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  ListPlus,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  marketCap: string;
  pe?: number;
  isGainer: boolean;
  newsSummary: string;
}

interface StockListConstructorProps {
  stocks: Stock[];
  title?: string;
  onAddToWatchlist?: (symbol: string) => void;
  onClose?: () => void;
}

export function StockListConstructor({ 
  stocks, 
  title = "Stock List", 
  onAddToWatchlist,
  onClose 
}: StockListConstructorProps) {
  const { addToQueue, isInQueue } = useQueue();
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"performance" | "alphabetical" | "market_cap">("performance");

  // Filter and sort stocks
  const filteredStocks = stocks
    .filter(stock => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "performance":
          return b.changePercent - a.changePercent;
        case "alphabetical":
          return a.symbol.localeCompare(b.symbol);
        case "market_cap":
          const aValue = parseFloat(a.marketCap.replace(/[^0-9.]/g, ''));
          const bValue = parseFloat(b.marketCap.replace(/[^0-9.]/g, ''));
          return bValue - aValue;
        default:
          return 0;
      }
    });

  const availableSectors = [...new Set(stocks.map(stock => stock.sector))];

  const handleSelectStock = (symbol: string) => {
    setSelectedStocks(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleSelectAll = () => {
    if (selectedStocks.length === filteredStocks.length) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(filteredStocks.map(stock => stock.symbol));
    }
  };

  const handleAddToQueue = (symbol: string) => {
    addToQueue(symbol, "bullish");
  };

  const handleAddAllToQueue = () => {
    selectedStocks.forEach(symbol => {
      if (!isInQueue(symbol)) {
        addToQueue(symbol, "bullish");
      }
    });
    setSelectedStocks([]);
  };

  const handleAddAllToWatchlist = () => {
    if (onAddToWatchlist) {
      selectedStocks.forEach(symbol => {
        onAddToWatchlist(symbol);
      });
    }
    setSelectedStocks([]);
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListPlus className="h-5 w-5" />
            {title}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
        
        {/* Filters and Search */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {availableSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy as any}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
                <SelectItem value="market_cap">Market Cap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select All and Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedStocks.length === filteredStocks.length && filteredStocks.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select All ({selectedStocks.length}/{filteredStocks.length})
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredStocks.length} stocks
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Stock List */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6">
          <div className="space-y-2 pb-4">
            {filteredStocks.map((stock) => (
              <Card
                key={stock.symbol}
                className={cn(
                  "transition-all hover:shadow-md cursor-pointer",
                  selectedStocks.includes(stock.symbol) && "ring-2 ring-blue-500 bg-blue-50"
                )}
                onClick={() => handleSelectStock(stock.symbol)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedStocks.includes(stock.symbol)}
                      onCheckedChange={() => handleSelectStock(stock.symbol)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Stock Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{stock.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {stock.sector}
                            </Badge>
                            {isInQueue(stock.symbol) && (
                              <Badge className="bg-purple-600 text-white text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                In Queue
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stock.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {stock.newsSummary}
                          </div>
                        </div>

                        {/* Price and Performance */}
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-1 text-sm",
                              stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                            )}
                          >
                            {stock.changePercent >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stock.marketCap} • P/E: {stock.pe || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Individual Action Buttons */}
                    <div className="flex gap-2">
                      {onAddToWatchlist && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToWatchlist(stock.symbol);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToQueue(stock.symbol);
                        }}
                        disabled={isInQueue(stock.symbol)}
                        className={cn(
                          isInQueue(stock.symbol) 
                            ? "bg-purple-600 text-white" 
                            : "bg-blue-600 hover:bg-blue-700"
                        )}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {isInQueue(stock.symbol) ? "Queued" : "Queue"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Bulk Action Buttons */}
      {selectedStocks.length > 0 && (
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedStocks.length} stocks selected
            </div>
            <div className="flex gap-3">
              {onAddToWatchlist && (
                <Button
                  variant="outline"
                  onClick={handleAddAllToWatchlist}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Add All to Watchlist
                </Button>
              )}
              <Button
                onClick={handleAddAllToQueue}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add All to Queue
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
