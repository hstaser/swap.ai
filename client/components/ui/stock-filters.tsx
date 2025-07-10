import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export interface FilterState {
  sector: string;
  marketCap: string;
  peRange: string;
  dividendYield: string;
  priceRange: string;
  exchange: string;
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

const exchangeOptions = [
  "All Markets",
  "NASDAQ",
  "NYSE",
  "DOW JONES",
  "S&P 500",
  "Russell 2000",
];

const priceRangeOptions = [
  "All Prices",
  "$0-$50",
  "$50-$200",
  "$200-$500",
  "$500+",
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
    filters.priceRange !== "All Prices";

  return (
    <div className={className}>
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

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
