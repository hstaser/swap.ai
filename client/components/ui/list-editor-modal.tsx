import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  X,
  CheckCircle,
  Edit3,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";
import { Stock } from "./stock-card";

interface ListEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  listName: string;
  initialStocks: string[];
  allStocks: Stock[];
  onSave: (listName: string, selectedStocks: string[]) => void;
  onAddToWatchlist?: (symbol: string) => void;
}

export function ListEditorModal({
  isOpen,
  onClose,
  listName,
  initialStocks,
  allStocks,
  onSave,
  onAddToWatchlist
}: ListEditorModalProps) {
  const { addToQueue, isInQueue } = useQueue();
  const [selectedStocks, setSelectedStocks] = useState<string[]>(initialStocks);
  const [editedListName, setEditedListName] = useState(listName);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"performance" | "alphabetical" | "market_cap">("performance");
  const [showInListOnly, setShowInListOnly] = useState(false);

  // Filter and sort stocks
  const filteredStocks = allStocks
    .filter(stock => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter;
      const matchesListFilter = !showInListOnly || selectedStocks.includes(stock.symbol);
      return matchesSearch && matchesSector && matchesListFilter;
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

  const availableSectors = [...new Set(allStocks.map(stock => stock.sector))];

  const handleToggleStock = (symbol: string) => {
    setSelectedStocks(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleSelectAll = () => {
    const visibleStockSymbols = filteredStocks.map(stock => stock.symbol);
    if (visibleStockSymbols.every(symbol => selectedStocks.includes(symbol))) {
      // Remove all visible stocks from selection
      setSelectedStocks(prev => prev.filter(symbol => !visibleStockSymbols.includes(symbol)));
    } else {
      // Add all visible stocks to selection
      const newSelection = [...new Set([...selectedStocks, ...visibleStockSymbols])];
      setSelectedStocks(newSelection);
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
  };

  const handleAddAllToWatchlist = () => {
    if (onAddToWatchlist) {
      selectedStocks.forEach(symbol => {
        onAddToWatchlist(symbol);
      });
    }
  };

  const handleSave = () => {
    onSave(editedListName, selectedStocks);
    onClose();
  };

  const handleRemoveFromList = (symbol: string) => {
    setSelectedStocks(prev => prev.filter(s => s !== symbol));
  };

  const getStockData = (symbol: string): Stock | undefined => {
    return allStocks.find(stock => stock.symbol === symbol);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle asChild>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <Input
                    value={editedListName}
                    onChange={(e) => setEditedListName(e.target.value)}
                    className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                    placeholder="List name..."
                  />
                </div>
              </div>
              <Badge variant="outline" className="ml-2">
                {selectedStocks.length} stocks
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Edit your list by adding or removing stocks. Use the filters to find stocks and manage your selection.
          </DialogDescription>
        </DialogHeader>

        {/* Controls */}
        <div className="space-y-3 border-b pb-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-in-list-only"
              checked={showInListOnly}
              onCheckedChange={setShowInListOnly}
            />
            <label htmlFor="show-in-list-only" className="text-sm font-medium">
              Show only stocks in list ({selectedStocks.length})
            </label>
          </div>

          {/* Filters */}
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

          {/* Select All */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={filteredStocks.length > 0 && filteredStocks.every(stock => selectedStocks.includes(stock.symbol))}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select All Visible ({filteredStocks.filter(stock => selectedStocks.includes(stock.symbol)).length}/{filteredStocks.length})
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredStocks.length} visible stocks
            </div>
          </div>
        </div>

        {/* Stock List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-2 p-1">
            {filteredStocks.map((stock) => (
              <Card
                key={stock.symbol}
                className={cn(
                  "transition-all hover:shadow-md cursor-pointer",
                  selectedStocks.includes(stock.symbol) && "ring-2 ring-blue-500 bg-blue-50"
                )}
                onClick={() => handleToggleStock(stock.symbol)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedStocks.includes(stock.symbol)}
                      onCheckedChange={() => handleToggleStock(stock.symbol)}
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
                            {selectedStocks.includes(stock.symbol) && (
                              <Badge className="bg-blue-600 text-white text-xs">
                                In List
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
                      {selectedStocks.includes(stock.symbol) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromList(stock.symbol);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
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

        {/* Footer Actions */}
        <div className="border-t pt-4 space-y-3">
          {/* Bulk Actions */}
          {selectedStocks.length > 0 && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium">
                {selectedStocks.length} stocks in list
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
          )}

          {/* Save/Cancel Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save List
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
