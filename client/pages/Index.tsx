import { useState, useMemo, useEffect } from "react";
import { StockCard, type Stock } from "@/components/ui/stock-card";
import { StockFilters, type FilterState } from "@/components/ui/stock-filters";
import { StockSearch } from "@/components/ui/stock-search";
import { MarketSentiment } from "@/components/ui/market-sentiment";
import { useQueue } from "@/hooks/use-queue";

import { HelpSystem } from "@/components/ui/help-system";
import { NotificationSystem } from "@/components/ui/notifications";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Search,
  BarChart3,
  Wallet,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Filter,
  Menu,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import { extendedStockDatabase } from "../data/extended-stocks";

// Helper function to determine risk level based on sector and other factors
const calculateRiskLevel = (stock: any): "Low" | "Medium" | "High" => {
  if (stock.sector === "Utilities" || stock.sector === "Consumer Staples")
    return "Low";
  if (stock.sector === "Healthcare" || stock.sector === "Financial Services")
    return "Low";
  if (stock.sector === "Technology" && stock.beta && stock.beta > 1.2)
    return "High";
  if (stock.sector === "Technology") return "Medium";
  if (stock.sector === "Energy" || stock.sector === "Materials") return "High";
  return "Medium";
};

// Use extended stock database
const mockStocks: Stock[] = extendedStockDatabase.map((stock) => ({
  symbol: stock.symbol,
  name: stock.name,
  price: stock.price,
  change: stock.change,
  changePercent: stock.changePercent,
  volume: stock.volume,
  marketCap: stock.marketCap,
  pe: stock.pe,
  dividendYield: stock.dividendYield,
  sector: stock.sector,
  isGainer: stock.isGainer,
  news: [],
  newsSummary: stock.newsSummary,
  returns: stock.returns,
  earningsDate: stock.earningsDate,
  risk: calculateRiskLevel(stock),
}));

const defaultFilters: FilterState = {
  sector: "All",
  marketCap: "All",
  peRange: "All",
  dividendYield: "All",
  exchange: "All",
  performance: "All",
};

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const symbolParam = searchParams.get("symbol");
  const { queue, isInQueue } = useQueue();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredStocks = useMemo(() => {
    let filtered = mockStocks.filter((stock) => {
      // Filter out queued stocks - user shouldn't see them again
      if (isInQueue(stock.symbol)) {
        return false;
      }

      // Sector filter
      if (filters.sector !== "All" && stock.sector !== filters.sector) {
        return false;
      }

      // Market cap filter
      if (filters.marketCap !== "All") {
        return true;
      }

      // P/E range filter
      if (filters.peRange !== "All" && stock.pe) {
        const [min, max] = filters.peRange.includes("-")
          ? filters.peRange.split("-").map(Number)
          : [40, Infinity];

        if (filters.peRange === "40+") {
          if (stock.pe < 40) return false;
        } else if (min && max) {
          if (stock.pe < min || stock.pe > max) return false;
        }
      }

      // Performance filter
      if (filters.performance !== "All") {
        const changePercent = stock.changePercent;
        const oneMonthReturn = stock.returns?.oneMonth || 0;
        const oneYearReturn = stock.returns?.oneYear || 0;

        switch (filters.performance) {
          case "Today's Gainers (>5%)":
            if (changePercent <= 5) return false;
            break;
          case "Today's Losers (<-5%)":
            if (changePercent >= -5) return false;
            break;
          case "Weekly Gainers (>10%)":
            if (changePercent <= 10) return false;
            break;
          case "Weekly Losers (<-10%)":
            if (changePercent >= -10) return false;
            break;
          case "Monthly Winners (>20%)":
            if (oneMonthReturn <= 20) return false;
            break;
          case "Monthly Losers (<-20%)":
            if (oneMonthReturn >= -20) return false;
            break;
          case "YTD Winners (>50%)":
            if (oneYearReturn <= 50) return false;
            break;
          case "YTD Losers (<-50%)":
            if (oneYearReturn >= -50) return false;
            break;
        }
      }

      return true;
    });

    return filtered;
  }, [filters, isInQueue]);

  const toggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const handleSkip = () => {
    if (currentStockIndex < filteredStocks.length - 1) {
      setCurrentStockIndex(currentStockIndex + 1);
    } else {
      setCurrentStockIndex(0);
    }
  };

  const handleFilterOverride = (symbol: string) => {
    setFilters(defaultFilters);
    const stockIndex = mockStocks.findIndex((stock) => stock.symbol === symbol);
    if (stockIndex !== -1) {
      setCurrentStockIndex(stockIndex);
    }
    setShowSearch(false);
  };

  // Reset current stock index when filtered stocks change
  useEffect(() => {
    if (currentStockIndex >= filteredStocks.length) {
      setCurrentStockIndex(0);
    }
  }, [filteredStocks.length, currentStockIndex]);

  // Handle symbol parameter to navigate to specific stock
  useEffect(() => {
    if (symbolParam && filteredStocks.length > 0) {
      const stockIndex = filteredStocks.findIndex(
        (stock) => stock.symbol === symbolParam,
      );
      if (stockIndex !== -1) {
        setCurrentStockIndex(stockIndex);
        setSearchParams((params) => {
          params.delete("symbol");
          return params;
        });
      }
    }
  }, [symbolParam, filteredStocks, setSearchParams]);

  // Move to next stock when current stock gets added to queue
  useEffect(() => {
    if (
      filteredStocks.length > 0 &&
      currentStockIndex < filteredStocks.length
    ) {
      const currentStock = filteredStocks[currentStockIndex];
      if (currentStock && isInQueue(currentStock.symbol)) {
        if (currentStockIndex < filteredStocks.length - 1) {
          setCurrentStockIndex(currentStockIndex + 1);
        } else if (currentStockIndex > 0) {
          setCurrentStockIndex(currentStockIndex - 1);
        } else {
          setCurrentStockIndex(0);
        }
      }
    }
  }, [queue, filteredStocks, currentStockIndex, isInQueue]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mobile-full-height">
      {/* Mobile Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">swap.ai</h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                className="h-10 w-10 rounded-2xl hover:bg-gray-100 touch-manipulation"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10 w-10 rounded-2xl hover:bg-gray-100 touch-manipulation relative"
              >
                <Filter className="h-5 w-5" />
                {Object.values(filters).some(v => v !== "All") && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(true)}
                className="h-10 w-10 rounded-2xl hover:bg-gray-100 touch-manipulation"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Link to="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-2xl hover:bg-gray-100 touch-manipulation"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Portfolio Quick Stats */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500">Portfolio:</span>
                <span className="ml-1 font-semibold text-green-600">+2.4%</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Queue:</span>
                <span className="ml-1 font-semibold">{queue.length}</span>
              </div>
            </div>
            
            {queue.length > 0 && (
              <Button
                size="sm"
                onClick={() => navigate("/queue/review")}
                className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 rounded-xl touch-manipulation"
              >
                Review & Invest
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-white z-50 safe-area-top">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(false)}
                className="h-10 w-10 rounded-2xl touch-manipulation"
              >
                <X className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold">Search Stocks</h2>
            </div>
            <StockSearch onFilterOverride={handleFilterOverride} />
          </div>
        </div>
      )}

      {/* Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 bg-white z-50 safe-area-top">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                  className="h-10 w-10 rounded-2xl touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold">Filter Stocks</h2>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters(defaultFilters);
                  setShowFilters(false);
                }}
                className="h-8 px-3 text-xs rounded-xl touch-manipulation"
              >
                Clear All
              </Button>
            </div>
            
            <StockFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(defaultFilters)}
              className="space-y-6"
            />
            
            <div className="mt-8">
              <Button
                onClick={() => setShowFilters(false)}
                className="w-full h-12 rounded-2xl touch-manipulation"
              >
                Apply Filters ({filteredStocks.length} stocks)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {filteredStocks.length > 0 && filteredStocks[currentStockIndex] ? (
          <div className="space-y-6">
            {/* Stock Counter */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-600">
                <span>{currentStockIndex + 1}</span>
                <span>of</span>
                <span>{filteredStocks.length}</span>
                <span>stocks</span>
              </div>
            </div>

            {/* Stock Card */}
            <div className="max-w-sm mx-auto">
              <StockCard
                stock={filteredStocks[currentStockIndex]}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={watchlist.includes(
                  filteredStocks[currentStockIndex].symbol,
                )}
                onSkip={handleSkip}
                className={cn(
                  "w-full shadow-2xl border-0 rounded-3xl overflow-hidden mobile-optimized",
                  isInQueue(filteredStocks[currentStockIndex].symbol) &&
                    "ring-4 ring-blue-400 bg-blue-50",
                )}
              />
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentStockIndex(Math.max(0, currentStockIndex - 1))
                }
                disabled={currentStockIndex === 0}
                className="h-12 w-12 rounded-2xl border-2 touch-manipulation mobile-icon-button"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentStockIndex(
                    Math.min(filteredStocks.length - 1, currentStockIndex + 1),
                  )
                }
                disabled={currentStockIndex === filteredStocks.length - 1}
                className="h-12 w-12 rounded-2xl border-2 touch-manipulation mobile-icon-button"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Tips for Mobile */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Swipe the card or use arrows to navigate
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No stocks found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters to see more results.
            </p>
            <Button
              onClick={() => setShowFilters(true)}
              variant="outline"
              className="h-12 px-6 rounded-2xl touch-manipulation"
            >
              <Filter className="h-5 w-5 mr-2" />
              Adjust Filters
            </Button>
          </div>
        )}
      </main>

      {/* Help System */}
      {showHelp && <HelpSystem onClose={() => setShowHelp(false)} />}

      {/* Notifications */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 mobile-card">
            <NotificationSystem
              onPreferencesChange={(prefs) =>
                console.log("Preferences updated:", prefs)
              }
            />
            <div className="mt-6">
              <Button
                onClick={() => setShowNotifications(false)}
                className="w-full h-12 rounded-2xl touch-manipulation"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
