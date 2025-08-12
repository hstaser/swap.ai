import { useState, useMemo, useEffect } from "react";
import { StockCard, type Stock } from "@/components/ui/stock-card";
import { StockFilters, type FilterState } from "@/components/ui/stock-filters";
import { MarketSentiment } from "@/components/ui/market-sentiment";
import { StockDashboard } from "@/components/ui/stock-dashboard";
import { DashboardWithAssistant } from "@/components/ui/dashboard-with-assistant";
import { AIInterventions } from "@/components/ui/ai-intervention";
import { AIChat } from "@/components/ui/ai-chat";
import { SmartPromptCard } from "@/components/ui/smart-prompt-card";
import { RiskInterventionSystem, generateSampleInterventions, defaultRiskSettings } from "@/components/ui/risk-intervention-system";
import { StockListConstructor } from "@/components/ui/stock-list-constructor";
import { useQueue } from "@/hooks/use-queue";
import { useAIAgent } from "@/hooks/use-ai-agent";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import { ALL_SYMBOLS, getStock, type Stock as CatalogStock } from "../data/stocks.catalog";
import { extendedStockDatabase } from "../data/extended-stocks";
import { STOCKS, STOCK_LOOKUP, type StockCard } from "../data/stocks";
import { addToQueue, isInQueue } from "../store/queue";
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from "../store/watchlist";

// Helper function to determine risk level based on sector and other factors
const calculateRiskLevel = (stock: any): "Low" | "Medium" | "High" => {
  // Simple risk calculation based on sector and volatility indicators
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

// Create 31 stocks from the specified list with enriched data
const createStockWithDefaults = (stockCard: StockCard): Stock => {
  // Find matching data from extended database if available
  const extendedData = extendedStockDatabase.find(s => s.symbol === stockCard.symbol);

  return {
    symbol: stockCard.symbol,
    name: stockCard.name,
    price: extendedData?.price ?? Math.random() * 500 + 50, // Fallback random price
    change: extendedData?.change ?? (Math.random() - 0.5) * 10,
    changePercent: extendedData?.changePercent ?? (Math.random() - 0.5) * 5,
    volume: extendedData?.volume ?? `${(Math.random() * 100 + 10).toFixed(1)}M`,
    marketCap: extendedData?.marketCap ?? stockCard.marketCap ?? `${(Math.random() * 2000 + 100).toFixed(0)}B`,
    pe: extendedData?.pe ?? Math.random() * 30 + 10,
    dividendYield: extendedData?.dividendYield ?? (Math.random() < 0.3 ? null : Math.random() * 4),
    sector: stockCard.sector ?? extendedData?.sector ?? "Technology",
    isGainer: extendedData?.isGainer ?? Math.random() > 0.5,
    news: [],
    newsSummary: extendedData?.newsSummary ?? `${stockCard.name} continues to show strong market performance with strategic growth initiatives.`,
    returns: extendedData?.returns ?? {
      oneMonth: (Math.random() - 0.5) * 10,
      sixMonth: (Math.random() - 0.5) * 20,
      oneYear: (Math.random() - 0.5) * 40,
    },
    earningsDate: extendedData?.earningsDate ?? "TBD",
    risk: stockCard.risk ?? calculateRiskLevel({ sector: stockCard.sector ?? "Technology" }),
  };
};

const catalogStocks: Stock[] = STOCKS.map(createStockWithDefaults);

// Legacy mock data for comparison
const legacyMockStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 182.52,
    change: 2.31,
    changePercent: 1.28,
    volume: "52.4M",
    marketCap: "2.85T",
    pe: 29.8,
    dividendYield: 0.5,
    sector: "Technology",
    isGainer: true,
    newsSummary: "Strong iPhone sales, AI momentum",
    returns: { oneMonth: 3.2, sixMonth: 12.7, oneYear: 18.4 },
    earningsDate: "Dec 19, 2025",
    news: [
      {
        title: "Apple unveils new iPhone 15 Pro with titanium design",
        source: "TechCrunch",
        time: "2h ago",
        summary:
          "Apple's latest flagship phone features a titanium build and improved camera system, driving analyst optimism.",
      },
      {
        title: "Apple Services revenue hits record high",
        source: "Reuters",
        time: "4h ago",
        summary:
          "The company's services division continues to show strong growth, boosting overall quarterly results.",
      },
      {
        title: "Analyst upgrades AAPL price target to $200",
        source: "MarketWatch",
        time: "6h ago",
        summary:
          "Morgan Stanley raises Apple's price target citing strong iPhone demand and services growth.",
      },
    ],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.85,
    change: -1.52,
    changePercent: -0.4,
    volume: "28.1M",
    marketCap: "2.81T",
    pe: 32.1,
    dividendYield: 0.7,
    sector: "Technology",
    isGainer: false,
    newsSummary: "Cloud growth slowing, costs rising",
    returns: { oneMonth: 1.8, sixMonth: 9.2, oneYear: 14.6 },
    news: [
      {
        title: "Microsoft Azure sees 30% revenue growth",
        source: "Bloomberg",
        time: "1h ago",
        summary:
          "Cloud computing division continues strong performance amid enterprise digital transformation.",
      },
      {
        title: "Teams integration with AI capabilities announced",
        source: "The Verge",
        time: "3h ago",
        summary:
          "Microsoft unveils new AI-powered features for Teams collaboration platform.",
      },
    ],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 138.21,
    change: 3.45,
    changePercent: 2.56,
    volume: "31.2M",
    marketCap: "1.75T",
    pe: 25.4,
    dividendYield: null,
    sector: "Communication Services",
    isGainer: true,
    newsSummary: "Search dominance, AI investments",
    returns: { oneMonth: 4.1, sixMonth: 15.3, oneYear: 22.8 },
    news: [
      {
        title: "Google Search updates combat AI-generated content",
        source: "Search Engine Land",
        time: "2h ago",
        summary:
          "New algorithm updates aim to prioritize authentic content over AI-generated material.",
      },
      {
        title: "Waymo expands autonomous vehicle testing",
        source: "TechCrunch",
        time: "5h ago",
        summary:
          "Alphabet's self-driving car unit increases testing in major metropolitan areas.",
      },
    ],
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 238.77,
    change: -8.32,
    changePercent: -3.37,
    volume: "89.7M",
    marketCap: "759.8B",
    pe: 73.2,
    dividendYield: null,
    sector: "Consumer Discretionary",
    isGainer: false,
    newsSummary: "Production delays, competition fears",
    news: [
      {
        title: "Tesla recalls Model S vehicles over brake concerns",
        source: "CNN Business",
        time: "1h ago",
        summary:
          "NHTSA investigation prompts voluntary recall affecting thousands of vehicles.",
      },
      {
        title: "Cybertruck production delays extended to 2025",
        source: "Electrek",
        time: "4h ago",
        summary:
          "Manufacturing challenges push back delivery timeline for electric pickup truck.",
      },
    ],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 144.05,
    change: 1.88,
    changePercent: 1.32,
    volume: "44.3M",
    marketCap: "1.50T",
    pe: 45.6,
    dividendYield: null,
    sector: "Consumer Discretionary",
    isGainer: true,
    newsSummary: "AWS growth, retail margins up",
    news: [
      {
        title: "Amazon Prime Day breaks sales records",
        source: "CNBC",
        time: "3h ago",
        summary:
          "Annual shopping event generates record revenue with strong electronics and home goods sales.",
      },
      {
        title: "AWS launches new AI development tools",
        source: "VentureBeat",
        time: "6h ago",
        summary:
          "Amazon Web Services introduces machine learning platform for enterprise developers.",
      },
    ],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 722.48,
    change: 12.66,
    changePercent: 1.78,
    volume: "67.8M",
    marketCap: "1.78T",
    pe: 68.9,
    dividendYield: 0.3,
    sector: "Technology",
    isGainer: true,
    newsSummary: "AI chip demand surging, earnings beat",
    news: [
      {
        title: "NVIDIA announces next-gen AI chips for data centers",
        source: "Forbes",
        time: "1h ago",
        summary:
          "New H200 chips promise 2x performance improvement for AI training workloads.",
      },
      {
        title: "Gaming revenue shows resilience amid market challenges",
        source: "GameIndustry.biz",
        time: "4h ago",
        summary:
          "GeForce RTX series maintains strong demand despite broader PC market slowdown.",
      },
    ],
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 154.23,
    change: -0.87,
    changePercent: -0.56,
    volume: "12.4M",
    marketCap: "452.1B",
    pe: 12.8,
    dividendYield: 2.4,
    sector: "Financial Services",
    isGainer: false,
    newsSummary: "Rate concerns, lending slowdown",
    news: [
      {
        title: "JPMorgan raises interest rate outlook for 2025",
        source: "Financial Times",
        time: "2h ago",
        summary:
          "Bank adjusts economic forecasts citing persistent inflation and Fed policy.",
      },
      {
        title: "Investment banking fees decline in Q3",
        source: "Wall Street Journal",
        time: "5h ago",
        summary:
          "Reduced M&A activity impacts revenue from advisory and underwriting services.",
      },
    ],
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 161.42,
    change: 0.34,
    changePercent: 0.21,
    volume: "8.9M",
    marketCap: "427.3B",
    pe: 15.2,
    dividendYield: 3.1,
    sector: "Healthcare",
    isGainer: true,
    newsSummary: "Drug approvals, dividend stable",
    news: [
      {
        title: "FDA approves new Johnson & Johnson cancer treatment",
        source: "BioPharma Dive",
        time: "3h ago",
        summary:
          "Innovative therapy receives approval for rare blood cancer, expanding oncology portfolio.",
      },
      {
        title: "J&J increases R&D spending for 2025",
        source: "Pharmaceutical Executive",
        time: "7h ago",
        summary:
          "Company commits additional $2B to drug development and clinical trials.",
      },
    ],
  },
  {
    symbol: "PFE",
    name: "Pfizer Inc.",
    price: 41.23,
    change: 0.87,
    changePercent: 2.15,
    volume: "15.2M",
    marketCap: "232.1B",
    pe: 12.8,
    dividendYield: 5.2,
    sector: "Healthcare",
    isGainer: true,
    newsSummary: "Vaccine revenue stable, pipeline strong",
    news: [
      {
        title: "Pfizer reports strong Q4 vaccine sales",
        source: "Reuters",
        time: "2h ago",
        summary: "COVID vaccine sales remain steady while RSV vaccine shows promise.",
      },
    ],
  },
  {
    symbol: "UNH",
    name: "UnitedHealth Group Inc.",
    price: 542.18,
    change: 4.32,
    changePercent: 0.80,
    volume: "3.1M",
    marketCap: "508.7B",
    pe: 24.1,
    dividendYield: 1.3,
    sector: "Healthcare",
    isGainer: true,
    newsSummary: "Insurance enrollment up, cost controls effective",
    news: [
      {
        title: "UnitedHealth beats earnings expectations",
        source: "MarketWatch",
        time: "1h ago",
        summary: "Strong enrollment growth drives revenue beat in Q4 results.",
      },
    ],
  },
];

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
  const [watchlistNotes, setWatchlistNotes] = useState<{
    [symbol: string]: { note: string; addedAt: Date };
  }>({});
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewMode, setViewMode] = useState<"swipe" | "dashboard" | "list">("swipe");
  const [showAIChat, setShowAIChat] = useState(false);
  const [riskSettings, setRiskSettings] = useState(defaultRiskSettings);

  // AI Agent
  const { isSetup, interventions, trackSwipe, dismissIntervention } = useAIAgent();

  // Generate sample risk interventions
  const riskInterventions = generateSampleInterventions([], queue);

  const filteredStocks = useMemo(() => {
    // For swipe mode, always show all 31 stocks in exact order (no filtering)
    if (viewMode === "swipe") {
      return catalogStocks; // Exact 31 stocks in specified order
    }

    // For dashboard mode, apply filters
    let filtered = catalogStocks.filter((stock) => {
      // Sector filter
      if (filters.sector !== "All" && stock.sector !== filters.sector) {
        return false;
      }

      // Market cap filter
      if (filters.marketCap !== "All") {
        // Simple logic - in real app would use actual market cap numbers
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
            // Using changePercent as proxy for weekly performance
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
  }, [filters, viewMode]);

  // Handle URL parameters
  useEffect(() => {
    const sectorParam = searchParams.get("sector");
    const indexParam = searchParams.get("index");

    // Handle sector filter from URL params (from AI insights)
    if (sectorParam) {
      const sectorMap: Record<string, string> = {
        "healthcare": "Healthcare",
        "financials": "Financial Services",
        "international": "International"
      };
      const mappedSector = sectorMap[sectorParam] || sectorParam;
      setFilters(prev => ({ ...prev, sector: mappedSector }));
      setViewMode("dashboard"); // Switch to dashboard view to see filters
    }

    // Handle index parameter to navigate to specific slide
    if (indexParam && filteredStocks.length > 0) {
      const targetIndex = parseInt(indexParam, 10);
      if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < filteredStocks.length) {
        setCurrentStockIndex(targetIndex);
        // Clear the index parameter after navigation
        setSearchParams((params) => {
          params.delete("index");
          return params;
        });
      }
    }
  }, [searchParams, filteredStocks.length, setSearchParams]);

  const toggleWatchlist = (symbol: string) => {
    const isCurrentlyInWatchlist = isInWatchlist(symbol);
    const currentStock = filteredStocks.find(s => s.symbol === symbol) || catalogStocks.find(s => s.symbol === symbol);

    if (isCurrentlyInWatchlist) {
      // Remove from watchlist using store
      removeFromWatchlist(symbol);
      // Remove note when removing from watchlist
      setWatchlistNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[symbol];
        return newNotes;
      });
    } else {
      // Add to watchlist using store
      addToWatchlist(symbol);
    }

    // Track behavior for AI agent
    if (isSetup && currentStock) {
      trackSwipe(symbol, isCurrentlyInWatchlist ? "skip" : "watchlist", {
        sector: currentStock.sector,
        risk: currentStock.risk || "Medium"
      });
    }
  };

  const addToWatchlistWithNote = (symbol: string, note: string) => {
    if (!isInWatchlist(symbol)) {
      addToWatchlist(symbol);
    }
    setWatchlistNotes((prev) => ({
      ...prev,
      [symbol]: { note, addedAt: new Date() },
    }));

    // Track as watchlist action for AI agent
    const currentStock = filteredStocks.find(s => s.symbol === symbol) || catalogStocks.find(s => s.symbol === symbol);
    if (isSetup && currentStock) {
      trackSwipe(symbol, "watchlist", {
        sector: currentStock.sector,
        risk: currentStock.risk || "Medium"
      });
    }
  };

  const handleAIInterventionAction = (intervention: any) => {
    if (intervention.actionType === "view_suggestions") {
      // Navigate to suggestions or show additional info
      console.log("Showing suggestions for:", intervention.type);
    } else if (intervention.actionType === "adjust_strategy") {
      // Open AI chat for strategy discussion
      setShowAIChat(true);
    } else if (intervention.actionType === "rebalance") {
      // Navigate to portfolio rebalancing
      navigate("/portfolio");
    }
  };

  const handleSkip = () => {
    if (filteredStocks.length === 0) return;

    const currentStock = filteredStocks[currentStockIndex];
    if (isSetup && currentStock) {
      trackSwipe(currentStock.symbol, "skip", {
        sector: currentStock.sector,
        risk: currentStock.risk || "Medium"
      });
    }

    // Move exactly one slide forward, no wrapping at end
    setCurrentStockIndex(i => Math.min(i + 1, filteredStocks.length - 1));
  };

  const handleFilterOverride = (symbol: string) => {
    // Reset filters to default
    setFilters(defaultFilters);

    // Find the stock in the full database and navigate to it
    const stockIndex = catalogStocks.findIndex((stock) => stock.symbol === symbol);
    if (stockIndex !== -1) {
      // After resetting filters, we need to wait for the filteredStocks to update
      // So we'll use setTimeout to delay the index setting
      setTimeout(() => {
        const newFilteredIndex = filteredStocks.findIndex((stock) => stock.symbol === symbol);
        if (newFilteredIndex !== -1) {
          setCurrentStockIndex(newFilteredIndex);
        }
      }, 100);
    }
  };

  // Reset current stock index when filtered stocks change
  useEffect(() => {
    if (filteredStocks.length > 0) {
      if (currentStockIndex >= filteredStocks.length) {
        setCurrentStockIndex(Math.max(0, filteredStocks.length - 1));
      }
      if (currentStockIndex < 0) {
        setCurrentStockIndex(0);
      }
    } else {
      // If no stocks available, reset to 0
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
        // Clear the symbol parameter after navigation
        setSearchParams((params) => {
          params.delete("symbol");
          return params;
        });
      }
    }
  }, [symbolParam, filteredStocks, setSearchParams]);

  // Removed automatic queue-based navigation - slides now move sequentially only

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F8274926fadf9406c8e2d75b7a56de814%2Fb4bd10ed53bc440984088afabc0f8891?format=webp&width=800"
                    alt="swipr.ai logo"
                    className="h-10 w-auto"
                  />
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/markets">Markets</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/research">AI Assistant</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/watchlist">Watchlist</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/social">Social</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/rewards">Rewards</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/banking">Banking</Link>
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/queue/review" className="hidden md:block">
                <Badge
                  variant="outline"
                  className="bg-white/50 cursor-pointer hover:bg-white/70 transition-colors"
                >
                  Queue: {queue.length}{" "}
                  {queue.length === 1 ? "stock" : "stocks"}
                </Badge>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHelp(true)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Clear all auth data and return to landing
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = "/";
                }}
                className="text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                Dev: Sign Out
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="sm" asChild className="relative">
                <Link to="/portfolio">
                  <Wallet className="h-4 w-4 mr-2" />
                  Portfolio
                  {/* AI indicator for portfolio that needs attention */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 border-2 border-white rounded-full animate-pulse" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20 md:pb-6">
        {/* View Mode Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 max-w-md mx-auto">
            <Button
              variant={viewMode === "swipe" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("swipe")}
              className="text-sm px-4 flex-1"
            >
              Swipe
            </Button>
            <Button
              variant={viewMode === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("dashboard")}
              className="text-sm px-4 flex-1"
            >
              Dashboard
            </Button>
          </div>
        </div>

        {/* Mobile Filters - show for swipe mode */}
        {viewMode === "swipe" && (
          <div className="mb-4">
            <StockFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(defaultFilters)}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-3"
            />
          </div>
        )}

        {/* Content Display */}
        {viewMode === "dashboard" ? (
          <div className="max-w-7xl mx-auto">
            <DashboardWithAssistant
              onStockSelect={(symbol) => {
                // Switch to swipe view and navigate to specific stock
                setViewMode("swipe");
                // Find the stock index and set it
                const stockIndex = filteredStocks.findIndex(
                  (stock) => stock.symbol === symbol,
                );
                if (stockIndex !== -1) {
                  setCurrentStockIndex(stockIndex);
                } else {
                  // If not in filtered stocks, navigate with URL param
                  navigate(`/?symbol=${symbol}`);
                }
              }}
            />

            {/* Queue Button for Dashboard View */}
            {queue.length > 0 && (
              <div className="fixed bottom-4 right-4 z-40">
                <Button
                  onClick={() => navigate("/queue/review")}
                  className="h-12 px-6 text-sm font-medium bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                >
                  Review & Invest ({queue.length})
                </Button>
              </div>
            )}
          </div>
        ) : /* Swipe View */
        filteredStocks.length > 0 &&
        currentStockIndex >= 0 &&
        currentStockIndex < filteredStocks.length &&
        filteredStocks[currentStockIndex] ? (
          <div className="space-y-4">
            {/* AI Risk Intervention System */}
            {isSetup && riskSettings.aiAssistanceLevel !== "off" && (
              <div className="max-w-lg mx-auto space-y-3">
                <RiskInterventionSystem
                  interventions={riskInterventions}
                  onDismiss={(id) => console.log("Dismissed intervention:", id)}
                  onUpdateSettings={setRiskSettings}
                  userSettings={riskSettings}
                />

                {/* Legacy Smart Prompt for AAPL */}
                {filteredStocks.length > 0 &&
                 currentStockIndex >= 0 &&
                 currentStockIndex < filteredStocks.length &&
                 filteredStocks[currentStockIndex]?.symbol === "AAPL" && (
                  <SmartPromptCard
                    prompt={{
                      id: "aapl_concentration",
                      title: "This stock is getting heavy in your portfolio",
                      description: "AAPL represents 15% of your holdings. Consider keeping individual stocks under 12% for better diversification.",
                      type: "suggestion",
                      priority: "medium",
                      actions: [
                        {
                          label: "See Alternatives",
                          action: "primary",
                          onClick: () => console.log("Show similar stocks in different sectors"),
                        },
                        {
                          label: "Add Anyway",
                          action: "secondary",
                          onClick: () => console.log("Add to queue"),
                        },
                        {
                          label: "Got It",
                          action: "dismiss",
                          onClick: () => console.log("Dismiss"),
                        },
                      ],
                      dismissible: true,
                      collapsible: true,
                    }}
                    onDismiss={() => console.log("Dismissed AAPL prompt")}
                  />
                )}
              </div>
            )}
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentStockIndex(i => Math.max(i - 1, 0))}
                disabled={currentStockIndex === 0}
                aria-label="Previous stock"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {currentStockIndex + 1} of {filteredStocks.length}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentStockIndex(i => Math.min(i + 1, filteredStocks.length - 1))}
                disabled={currentStockIndex >= filteredStocks.length - 1}
                aria-label="Next stock"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Stock */}
            <div className="max-w-lg mx-auto space-y-4">
              {filteredStocks[currentStockIndex] && (
                <StockCard
                  stock={filteredStocks[currentStockIndex]}
                  onToggleWatchlist={toggleWatchlist}
                  onAddToWatchlistWithNote={addToWatchlistWithNote}
                  isInWatchlist={isInWatchlist(
                    filteredStocks[currentStockIndex].symbol,
                  )}
                  onSkip={handleSkip}
                  currentIndex={currentStockIndex}
                  className={cn(
                    "w-full",
                    isInQueue(filteredStocks[currentStockIndex].symbol) &&
                      "ring-2 ring-blue-400 bg-blue-50",
                  )}
                />
              )}
            </div>
          </div>
        ) : null}

        {/* No Stocks Found - for swipe and list view (dashboard handles its own) */}
        {filteredStocks.length === 0 && (viewMode === "swipe" || viewMode === "list") && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No stocks found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Help System */}
      {showHelp && <HelpSystem onClose={() => setShowHelp(false)} />}

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

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
