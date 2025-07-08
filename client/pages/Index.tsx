import { useState, useMemo } from "react";
import { StockCard, type Stock } from "@/components/ui/stock-card";
import { StockFilters, type FilterState } from "@/components/ui/stock-filters";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock stock data - in a real app this would come from an API
const mockStocks: Stock[] = [
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
    news: [
      {
        title: "Tesla recalls Model S vehicles over brake concerns",
        source: "CNN Business",
        time: "1h ago",
        summary:
          "NHTSA investigation prompts voluntary recall affecting thousands of vehicles.",
      },
      {
        title: "Cybertruck production delays extended to 2024",
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
    news: [
      {
        title: "JPMorgan raises interest rate outlook for 2024",
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
    news: [
      {
        title: "FDA approves new Johnson & Johnson cancer treatment",
        source: "BioPharma Dive",
        time: "3h ago",
        summary:
          "Innovative therapy receives approval for rare blood cancer, expanding oncology portfolio.",
      },
      {
        title: "J&J increases R&D spending for 2024",
        source: "Pharmaceutical Executive",
        time: "7h ago",
        summary:
          "Company commits additional $2B to drug development and clinical trials.",
      },
    ],
  },
];

const defaultFilters: FilterState = {
  sector: "All Sectors",
  marketCap: "All",
  peRange: "All P/E",
  dividendYield: "All",
  priceRange: "All Prices",
};

export default function Index() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [currentStockIndex, setCurrentStockIndex] = useState(0);

  const filteredStocks = useMemo(() => {
    let filtered = mockStocks.filter((stock) => {
      // Sector filter
      if (filters.sector !== "All Sectors" && stock.sector !== filters.sector) {
        return false;
      }

      // Market cap filter
      if (filters.marketCap !== "All") {
        // Simple logic - in real app would use actual market cap numbers
        return true;
      }

      // Price range filter
      if (filters.priceRange !== "All Prices") {
        const [min, max] = filters.priceRange.includes("-")
          ? filters.priceRange
              .split("-")
              .map((p) => Number(p.replace(/[^\d]/g, "")))
          : [500, Infinity];

        if (filters.priceRange === "$500+") {
          if (stock.price < 500) return false;
        } else if (min && max) {
          if (stock.price < min || stock.price > max) return false;
        }
      }

      // P/E range filter
      if (filters.peRange !== "All P/E" && stock.pe) {
        const [min, max] = filters.peRange.includes("-")
          ? filters.peRange.split("-").map(Number)
          : [40, Infinity];

        if (filters.peRange === "40+") {
          if (stock.pe < 40) return false;
        } else if (min && max) {
          if (stock.pe < min || stock.pe > max) return false;
        }
      }

      return true;
    });

    return filtered;
  }, [filters]);

  const addToPortfolio = (symbol: string) => {
    if (!portfolio.includes(symbol)) {
      setPortfolio([...portfolio, symbol]);
    }
  };

  const toggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  StockScope
                </h1>
              </div>
              <nav className="hidden md:flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  Markets
                </Button>
                <Button variant="ghost" size="sm">
                  Watchlist
                </Button>
                <Button variant="ghost" size="sm">
                  Research
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/50">
                Portfolio: {portfolio.length} stocks
              </Badge>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filters */}
        <div className="mb-4">
          <StockFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={() => setFilters(defaultFilters)}
            className="bg-white/60 backdrop-blur-sm rounded-lg p-3"
          />
        </div>

        {/* Single Stock Display */}
        {filteredStocks.length > 0 ? (
          <div className="space-y-4">
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentStockIndex(Math.max(0, currentStockIndex - 1))
                }
                disabled={currentStockIndex === 0}
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
                onClick={() =>
                  setCurrentStockIndex(
                    Math.min(filteredStocks.length - 1, currentStockIndex + 1),
                  )
                }
                disabled={currentStockIndex === filteredStocks.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Stock */}
            <div className="max-w-lg mx-auto">
              <StockCard
                stock={filteredStocks[currentStockIndex]}
                onAddToPortfolio={addToPortfolio}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={watchlist.includes(
                  filteredStocks[currentStockIndex].symbol,
                )}
                className={cn(
                  "w-full",
                  portfolio.includes(
                    filteredStocks[currentStockIndex].symbol,
                  ) && "ring-2 ring-primary bg-primary/5",
                )}
              />
            </div>
          </div>
        ) : (
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
    </div>
  );
}
