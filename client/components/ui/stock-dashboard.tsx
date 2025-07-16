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
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedPerformance, setSelectedPerformance] = useState<string>("all");
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>("all");

  // Mock stock data with logos
  const stocks: DashboardStock[] = [
    {
      symbol: "AAPL",
      name: "Apple",
      price: 182.52,
      change: 2.31,
      changePercent: 1.28,
      sector: "Technology",
      logo: "🍎",
      marketCap: "$2.9T",
    },
    {
      symbol: "MSFT",
      name: "Microsoft",
      price: 378.85,
      change: -1.52,
      changePercent: -0.4,
      sector: "Technology",
      logo: "🪟",
      marketCap: "$2.8T",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet",
      price: 182.97,
      change: 0.97,
      changePercent: 0.53,
      sector: "Internet & Content",
      logo: "🔍",
      marketCap: "$2.2T",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA",
      price: 722.48,
      change: 12.66,
      changePercent: 1.78,
      sector: "Semiconductors",
      logo: "🔥",
      marketCap: "$1.8T",
    },
    {
      symbol: "TSLA",
      name: "Tesla",
      price: 248.5,
      change: -8.24,
      changePercent: -3.21,
      sector: "Automotive",
      logo: "⚡",
      marketCap: "$791B",
    },
    {
      symbol: "AMZN",
      name: "Amazon",
      price: 155.89,
      change: 2.45,
      changePercent: 1.59,
      sector: "E-commerce",
      logo: "📦",
      marketCap: "$1.6T",
    },
    {
      symbol: "META",
      name: "Meta Platforms",
      price: 485.75,
      change: -5.2,
      changePercent: -1.06,
      sector: "Social Media",
      logo: "👥",
      marketCap: "$1.2T",
    },
    {
      symbol: "NFLX",
      name: "Netflix",
      price: 487.05,
      change: 7.83,
      changePercent: 1.63,
      sector: "Entertainment",
      logo: "🎬",
      marketCap: "$216B",
    },
    {
      symbol: "CRM",
      name: "Salesforce",
      price: 267.53,
      change: -3.47,
      changePercent: -1.28,
      sector: "Software",
      logo: "☁️",
      marketCap: "$258B",
    },
    {
      symbol: "SPOT",
      name: "Spotify",
      price: 289.15,
      change: 12.4,
      changePercent: 4.48,
      sector: "Audio Streaming",
      logo: "🎵",
      marketCap: "$58B",
    },
  ];

  const sectors = ["all", ...Array.from(new Set(stocks.map((s) => s.sector)))];

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch =
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
    selectedSector,
    selectedPerformance,
    selectedMarketCap,
    stocks,
  ]);

  const handleStockClick = (symbol: string) => {
    if (onStockSelect) {
      onStockSelect(symbol);
    } else {
      navigate(`/stock/${symbol}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-lg bg-white/90 backdrop-blur-sm border-0 shadow-sm"
        />
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

      {/* Suggested Header */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {searchQuery
            ? `Search Results (${filteredStocks.length})`
            : "Suggested"}
        </h2>
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
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {stock.logo}
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
