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
  priceRange: string;
  exchange: string;
  performance: string;
  // Financials
  revenueGrowth: string;
  profitMargin: string;
  debtToEquity: string;
  roe: string;
}

interface StockFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  className?: string;
}

const sectors = [
  "All Sectors",
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

const peRangeOptions = ["All P/E", "0-15", "15-25", "25-40", "40+"];

const priceRangeOptions = [
  "All Prices",
  "$0-$50",
  "$50-$200",
  "$200-$500",
  "$500+",
];

const exchangeOptions = [
  "All Markets",
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
  "All Performance",
  "Top Gainers (>5%)",
  "Strong Performers (2-5%)",
  "Stable (-2% to 2%)",
  "Declining (-5% to -2%)",
  "Top Losers (<-5%)",
  "1M Winners (>10%)",
  "1M Losers (<-10%)",
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
    filters.sector !== "All Sectors" ||
    filters.marketCap !== "All" ||
    filters.peRange !== "All P/E" ||
    filters.dividendYield !== "All" ||
    filters.priceRange !== "All Prices" ||
    filters.performance !== "All Performance" ||
    filters.revenueGrowth !== "All Growth" ||
    filters.profitMargin !== "All Margins" ||
    filters.debtToEquity !== "All Debt Levels" ||
    filters.roe !== "All ROE";

  return (
    <div className={className}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Basic Filters
          </TabsTrigger>
          <TabsTrigger value="financials" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Financials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.sector}
              onValueChange={(value) => updateFilter("sector", value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
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
                <SelectValue />
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
              <SelectTrigger className="w-[160px]">
                <SelectValue />
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
              <SelectTrigger className="w-[100px]">
                <SelectValue />
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
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceRangeOptions.map((option) => (
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
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Div</SelectItem>
                <SelectItem value="0-2%">0-2%</SelectItem>
                <SelectItem value="2-4%">2-4%</SelectItem>
                <SelectItem value="4%+">4%+</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.performance}
              onValueChange={(value) => updateFilter("performance", value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
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
        </TabsContent>

        <TabsContent value="financials" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Revenue Growth</Label>
              <Select
                value={filters.revenueGrowth}
                onValueChange={(value) => updateFilter("revenueGrowth", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {revenueGrowthOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Profit Margin</Label>
              <Select
                value={filters.profitMargin}
                onValueChange={(value) => updateFilter("profitMargin", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {profitMarginOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Debt to Equity</Label>
              <Select
                value={filters.debtToEquity}
                onValueChange={(value) => updateFilter("debtToEquity", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {debtToEquityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Return on Equity</Label>
              <Select
                value={filters.roe}
                onValueChange={(value) => updateFilter("roe", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
