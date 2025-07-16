import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DashboardStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  logo: string;
  marketCap: string;
}

interface StockDashboardProps {
  onStockSelect?: (symbol: string) => void;
}

export function StockDashboard({ onStockSelect }: StockDashboardProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [showAiSearch, setShowAiSearch] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedPerformance, setSelectedPerformance] = useState<string>("all");
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>("all");

  // Function to get company logo URL
  const getLogoUrl = (symbol: string) => {
    return `https://logo.clearbit.com/${getCompanyDomain(symbol)}`;
  };

  const getCompanyDomain = (symbol: string) => {
    const domains: { [key: string]: string } = {
      AAPL: "apple.com",
      MSFT: "microsoft.com",
      GOOGL: "google.com",
      NVDA: "nvidia.com",
      TSLA: "tesla.com",
      AMZN: "amazon.com",
      META: "meta.com",
      NFLX: "netflix.com",
      CRM: "salesforce.com",
      SPOT: "spotify.com",
    };
    return domains[symbol] || `${symbol.toLowerCase()}.com`;
  };

  // Mock stock data
  const stocks: DashboardStock[] = [
    {
      symbol: "AAPL",
      name: "Apple",
      price: 182.52,
      change: 2.31,
      changePercent: 1.28,
      sector: "Technology",
      logo: getLogoUrl("AAPL"),
      marketCap: "$2.9T",
    },
    {
      symbol: "MSFT",
      name: "Microsoft",
      price: 378.85,
      change: -1.52,
      changePercent: -0.4,
      sector: "Technology",
      logo: getLogoUrl("MSFT"),
      marketCap: "$2.8T",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet",
      price: 182.97,
      change: 0.97,
      changePercent: 0.53,
      sector: "Internet & Content",
      logo: getLogoUrl("GOOGL"),
      marketCap: "$2.2T",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA",
      price: 722.48,
      change: 12.66,
      changePercent: 1.78,
      sector: "Semiconductors",
      logo: getLogoUrl("NVDA"),
      marketCap: "$1.8T",
    },
    {
      symbol: "TSLA",
      name: "Tesla",
      price: 248.5,
      change: -8.24,
      changePercent: -3.21,
      sector: "Automotive",
      logo: getLogoUrl("TSLA"),
      marketCap: "$791B",
    },
    {
      symbol: "AMZN",
      name: "Amazon",
      price: 155.89,
      change: 2.45,
      changePercent: 1.59,
      sector: "E-commerce",
      logo: getLogoUrl("AMZN"),
      marketCap: "$1.6T",
    },
    {
      symbol: "META",
      name: "Meta Platforms",
      price: 485.75,
      change: -5.2,
      changePercent: -1.06,
      sector: "Social Media",
      logo: getLogoUrl("META"),
      marketCap: "$1.2T",
    },
    {
      symbol: "NFLX",
      name: "Netflix",
      price: 487.05,
      change: 7.83,
      changePercent: 1.63,
      sector: "Entertainment",
      logo: getLogoUrl("NFLX"),
      marketCap: "$216B",
    },
    {
      symbol: "CRM",
      name: "Salesforce",
      price: 267.53,
      change: -3.47,
      changePercent: -1.28,
      sector: "Software",
      logo: getLogoUrl("CRM"),
      marketCap: "$258B",
    },
    {
      symbol: "SPOT",
      name: "Spotify",
      price: 289.15,
      change: 12.4,
      changePercent: 4.48,
      sector: "Audio Streaming",
      logo: getLogoUrl("SPOT"),
      marketCap: "$58B",
    },
  ];

  const sectors = ["all", ...Array.from(new Set(stocks.map((s) => s.sector)))];

  // AI Search function
  const processAiSearch = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    const results: DashboardStock[] = [];

    // Simple AI-like matching - in real app this would use an LLM
    stocks.forEach((stock) => {
      let score = 0;

      // Direct matches
      if (
        normalizedQuery.includes(stock.name.toLowerCase()) ||
        normalizedQuery.includes(stock.symbol.toLowerCase())
      ) {
        score += 100;
      }

      // Business description matches
      if (normalizedQuery.includes("electric") && stock.symbol === "TSLA")
        score += 80;
      if (normalizedQuery.includes("search") && stock.symbol === "GOOGL")
        score += 80;
      if (normalizedQuery.includes("social") && stock.symbol === "META")
        score += 80;
      if (
        normalizedQuery.includes("streaming") &&
        (stock.symbol === "NFLX" || stock.symbol === "SPOT")
      )
        score += 80;
      if (
        normalizedQuery.includes("cloud") &&
        (stock.symbol === "MSFT" ||
          stock.symbol === "AMZN" ||
          stock.symbol === "CRM")
      )
        score += 80;
      if (normalizedQuery.includes("gaming") && stock.symbol === "NVDA")
        score += 80;
      if (
        normalizedQuery.includes("ai") &&
        (stock.symbol === "NVDA" ||
          stock.symbol === "GOOGL" ||
          stock.symbol === "MSFT")
      )
        score += 80;
      if (normalizedQuery.includes("phone") && stock.symbol === "AAPL")
        score += 80;
      if (normalizedQuery.includes("ecommerce") && stock.symbol === "AMZN")
        score += 80;

      // Sector matches
      if (
        normalizedQuery.includes("tech") &&
        stock.sector.toLowerCase().includes("tech")
      )
        score += 60;
      if (
        normalizedQuery.includes("software") &&
        stock.sector.toLowerCase().includes("software")
      )
        score += 60;

      if (score > 0) {
        results.push(stock);
      }
    });

    return results.sort((a, b) => b.changePercent - a.changePercent); // Sort by performance
  };

  const filteredStocks = useMemo(() => {
    let baseStocks = stocks;

    // Apply AI search if active
    if (aiSearchQuery.trim()) {
      baseStocks = processAiSearch(aiSearchQuery);
    }

    return baseStocks.filter((stock) => {
      const matchesSearch =
        !searchQuery ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector =
        selectedSector === "all" || stock.sector === selectedSector;
      const matchesPerformance =
        selectedPerformance === "all" ||
        (selectedPerformance === "gainers" && stock.changePercent > 0) ||
        (selectedPerformance === "losers" && stock.changePercent < 0);
      const matchesMarketCap =
        selectedMarketCap === "all" ||
        (selectedMarketCap === "large" &&
          parseFloat(stock.marketCap.replace(/[$TB]/g, "")) >= 1000) ||
        (selectedMarketCap === "mid" &&
          parseFloat(stock.marketCap.replace(/[$TB]/g, "")) >= 10 &&
          parseFloat(stock.marketCap.replace(/[$TB]/g, "")) < 1000) ||
        (selectedMarketCap === "small" &&
          parseFloat(stock.marketCap.replace(/[$TB]/g, "")) < 10);

      return (
        matchesSearch && matchesSector && matchesPerformance && matchesMarketCap
      );
    });
  }, [
    searchQuery,
    aiSearchQuery,
    selectedSector,
    selectedPerformance,
    selectedMarketCap,
    stocks,
  ]);

  const handleStockClick = (symbol: string) => {
    if (onStockSelect) {
      onStockSelect(symbol);
    } else {
      // Navigate to home page with the specific stock symbol to show in swipe view
      navigate(`/?symbol=${symbol}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 h-12 text-lg bg-white/90 backdrop-blur-sm border-0 shadow-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAiSearch(!showAiSearch)}
            className={cn(
              "absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10",
              showAiSearch && "bg-blue-100 text-blue-600",
            )}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>

        {/* AI Search Bar */}
        {showAiSearch && (
          <div className="relative">
            <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
            <Input
              placeholder="Describe what you're looking for... (e.g., 'electric car companies', 'AI and machine learning stocks')"
              value={aiSearchQuery}
              onChange={(e) => setAiSearchQuery(e.target.value)}
              className="pl-10 pr-12 h-12 text-sm bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm"
            />
            {aiSearchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAiSearchQuery("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="px-3 py-2 bg-white/90 backdrop-blur-sm border-0 shadow-sm rounded-lg text-sm font-medium min-w-fit"
        >
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector === "all" ? "All Sectors" : sector}
            </option>
          ))}
        </select>

        <select
          value={selectedPerformance}
          onChange={(e) => setSelectedPerformance(e.target.value)}
          className="px-3 py-2 bg-white/90 backdrop-blur-sm border-0 shadow-sm rounded-lg text-sm font-medium min-w-fit"
        >
          <option value="all">All Performance</option>
          <option value="gainers">Gainers</option>
          <option value="losers">Losers</option>
        </select>

        <select
          value={selectedMarketCap}
          onChange={(e) => setSelectedMarketCap(e.target.value)}
          className="px-3 py-2 bg-white/90 backdrop-blur-sm border-0 shadow-sm rounded-lg text-sm font-medium min-w-fit"
        >
          <option value="all">All Cap</option>
          <option value="large">Large Cap</option>
          <option value="mid">Mid Cap</option>
          <option value="small">Small Cap</option>
        </select>
      </div>

      {/* Results Header */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {aiSearchQuery
            ? `AI Search Results (${filteredStocks.length})`
            : searchQuery
              ? `Search Results (${filteredStocks.length})`
              : "Suggested"}
        </h2>
        {aiSearchQuery && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>AI Interpretation:</strong> "{aiSearchQuery}"
                <br />
                <span className="text-blue-600">
                  Showing companies that match your description
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stock List */}
      <div className="space-y-3">
        {filteredStocks.map((stock) => {
          const isPositive = stock.changePercent >= 0;

          return (
            <Card
              key={stock.symbol}
              className="bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleStockClick(stock.symbol)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={stock.logo}
                        alt={`${stock.name} logo`}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          // Fallback to first letter if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.parentElement!.innerHTML = `<div class="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold">${stock.symbol[0]}</div>`;
                        }}
                      />
                    </div>

                    {/* Stock Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          {stock.symbol}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {stock.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">
                        {stock.sector}
                      </div>
                    </div>
                  </div>

                  {/* Price and Change */}
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">
                      ${stock.price.toFixed(2)}
                    </div>
                    <Badge
                      className={cn(
                        "mt-1 font-medium",
                        isPositive
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100",
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </Badge>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredStocks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No stocks found</div>
          <div className="text-gray-400 text-sm">
            Try adjusting your search or filters
          </div>
        </div>
      )}
    </div>
  );
}
