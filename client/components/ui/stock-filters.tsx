import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

export interface FilterState {
  sector: string;
  marketCap: string;
  peRange: { min: string; max: string };
  dividendYield: string;
  priceRange: { min: string; max: string };
  searchTerm: string;
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
    filters.peRange.min !== "" ||
    filters.peRange.max !== "" ||
    filters.dividendYield !== "All" ||
    filters.priceRange.min !== "" ||
    filters.priceRange.max !== "" ||
    filters.searchTerm !== "";

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear All
              <X className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Search Stocks
          </Label>
          <Input
            id="search"
            placeholder="Search by symbol or name..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Sector</Label>
          <Select
            value={filters.sector}
            onValueChange={(value) => updateFilter("sector", value)}
          >
            <SelectTrigger className="mt-1">
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
        </div>

        <div>
          <Label className="text-sm font-medium">Market Cap</Label>
          <Select
            value={filters.marketCap}
            onValueChange={(value) => updateFilter("marketCap", value)}
          >
            <SelectTrigger className="mt-1">
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
        </div>

        <div>
          <Label className="text-sm font-medium">P/E Ratio Range</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Input
              placeholder="Min"
              type="number"
              value={filters.peRange.min}
              onChange={(e) =>
                updateFilter("peRange", {
                  ...filters.peRange,
                  min: e.target.value,
                })
              }
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.peRange.max}
              onChange={(e) =>
                updateFilter("peRange", {
                  ...filters.peRange,
                  max: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Input
              placeholder="Min ($)"
              type="number"
              value={filters.priceRange.min}
              onChange={(e) =>
                updateFilter("priceRange", {
                  ...filters.priceRange,
                  min: e.target.value,
                })
              }
            />
            <Input
              placeholder="Max ($)"
              type="number"
              value={filters.priceRange.max}
              onChange={(e) =>
                updateFilter("priceRange", {
                  ...filters.priceRange,
                  max: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Dividend Yield</Label>
          <Select
            value={filters.dividendYield}
            onValueChange={(value) => updateFilter("dividendYield", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="0-2%">0-2%</SelectItem>
              <SelectItem value="2-4%">2-4%</SelectItem>
              <SelectItem value="4%+">4%+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="pt-2">
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.sector !== "All Sectors" && (
                <Badge variant="secondary">
                  {filters.sector}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => updateFilter("sector", "All Sectors")}
                  />
                </Badge>
              )}
              {filters.marketCap !== "All" && (
                <Badge variant="secondary">
                  {filters.marketCap}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => updateFilter("marketCap", "All")}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
