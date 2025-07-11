import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, TrendingUp, Calculator } from "lucide-react";

export interface FilterState {
  sector: string;
  marketCap: string;
  peRange: string;
  dividendYield: string;
  exchange: string;
  performance: string;
}

interface StockFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  className?: string;
}

const sectors = [
  "All",
  "Technology",
  "Healthcare",
  "Financial Services",
  "Energy",
  "Consumer Discretionary",
  "Industrials",
  "Communication Services",
  "Consumer Staples",
  "Utilities",
  "Real Estate",
  "Materials",
];

const marketCapOptions = [
  "All",
  "Large Cap (>$10B)",
  "Mid Cap ($2B-$10B)",
  "Small Cap (<$2B)",
];

const peRangeOptions = ["All", "0-15", "15-25", "25-40", "40+"];

const exchangeOptions = [
  "All",
  "NASDAQ",
  "NYSE",
  "DOW JONES",
  "S&P 500",
  "Russell 2000",
  "LSE (London)",
  "TSE (Tokyo)",
  "TSX (Toronto)",
  "ASX (Australia)",
  "DAX (Germany)",
  "CAC 40 (France)",
  "Nikkei 225",
  "FTSE 100",
];

const performanceOptions = [
  "All",
  "Today's Gainers (>5%)",
  "Today's Losers (<-5%)",
  "Weekly Gainers (>10%)",
  "Weekly Losers (<-10%)",
  "Monthly Winners (>20%)",
  "Monthly Losers (<-20%)",
  "YTD Winners (>50%)",
  "YTD Losers (<-50%)",
];

const revenueGrowthOptions = [
  "All Growth",
  "High Growth (>20%)",
  "Moderate Growth (10-20%)",
  "Steady Growth (5-10%)",
  "Slow Growth (0-5%)",
  "Declining (<0%)",
];

const profitMarginOptions = [
  "All Margins",
  "High Margin (>20%)",
  "Good Margin (15-20%)",
  "Average Margin (10-15%)",
  "Low Margin (5-10%)",
  "Poor Margin (<5%)",
];

const debtToEquityOptions = [
  "All Debt Levels",
  "Low Debt (<0.3)",
  "Moderate Debt (0.3-0.6)",
  "High Debt (0.6-1.0)",
  "Very High Debt (>1.0)",
];

const roeOptions = [
  "All ROE",
  "Excellent (>20%)",
  "Good (15-20%)",
  "Average (10-15%)",
  "Below Average (5-10%)",
  "Poor (<5%)",
];

export function StockFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className,
}: StockFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.sector !== "All" ||
    filters.marketCap !== "All" ||
    filters.peRange !== "All" ||
    filters.dividendYield !== "All" ||
    filters.exchange !== "All" ||
    filters.performance !== "All";

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.sector}
          onValueChange={(value) => updateFilter("sector", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sectors" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.exchange}
          onValueChange={(value) => updateFilter("exchange", value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Markets" />
          </SelectTrigger>
          <SelectContent>
            {exchangeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.marketCap}
          onValueChange={(value) => updateFilter("marketCap", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Market Cap" />
          </SelectTrigger>
          <SelectContent>
            {marketCapOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.peRange}
          onValueChange={(value) => updateFilter("peRange", value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="P/E Ratio" />
          </SelectTrigger>
          <SelectContent>
            {peRangeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.dividendYield}
          onValueChange={(value) => updateFilter("dividendYield", value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Dividends" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="0-2%">0-2%</SelectItem>
            <SelectItem value="2-4%">2-4%</SelectItem>
            <SelectItem value="4%+">4%+</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.performance}
          onValueChange={(value) => updateFilter("performance", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Performance" />
          </SelectTrigger>
          <SelectContent>
            {performanceOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Filters applied</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Clear filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
