import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Eye,
  Plus,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparableCompany {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  pe: number;
  sector: string;
  similarity: number;
  reason: string;
}

interface ComparableCompaniesProps {
  targetSymbol: string;
  targetSector: string;
  onStockSelect?: (symbol: string) => void;
  onAddToWatchlist?: (symbol: string) => void;
  className?: string;
}

// Mock comparable companies data
const getComparableCompanies = (
  symbol: string,
  sector: string,
): ComparableCompany[] => {
  const sectorCompanies: { [key: string]: ComparableCompany[] } = {
    Technology: [
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        price: 378.85,
        change: -1.52,
        changePercent: -0.4,
        marketCap: "2.81T",
        pe: 32.1,
        sector: "Technology",
        similarity: 95,
        reason: "Similar cloud computing focus",
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        price: 138.21,
        change: 3.45,
        changePercent: 2.56,
        marketCap: "1.75T",
        pe: 25.4,
        sector: "Technology",
        similarity: 87,
        reason: "Large tech with AI investments",
      },
      {
        symbol: "META",
        name: "Meta Platforms",
        price: 328.45,
        change: 5.67,
        changePercent: 1.76,
        marketCap: "832B",
        pe: 28.9,
        sector: "Technology",
        similarity: 78,
        reason: "Social media & VR innovation",
      },
    ],
    "Financial Services": [
      {
        symbol: "BAC",
        name: "Bank of America",
        price: 34.56,
        change: -0.23,
        changePercent: -0.66,
        marketCap: "267B",
        pe: 12.3,
        sector: "Financial Services",
        similarity: 92,
        reason: "Major commercial bank",
      },
      {
        symbol: "WFC",
        name: "Wells Fargo",
        price: 45.67,
        change: 0.45,
        changePercent: 1.0,
        marketCap: "156B",
        pe: 11.8,
        sector: "Financial Services",
        similarity: 88,
        reason: "Large retail banking presence",
      },
      {
        symbol: "GS",
        name: "Goldman Sachs",
        price: 387.23,
        change: 2.34,
        changePercent: 0.61,
        marketCap: "133B",
        pe: 14.2,
        sector: "Financial Services",
        similarity: 75,
        reason: "Investment banking focus",
      },
    ],
    Healthcare: [
      {
        symbol: "UNH",
        name: "UnitedHealth Group",
        price: 542.18,
        change: 3.22,
        changePercent: 0.6,
        marketCap: "512B",
        pe: 24.5,
        sector: "Healthcare",
        similarity: 89,
        reason: "Healthcare services leader",
      },
      {
        symbol: "PFE",
        name: "Pfizer Inc.",
        price: 29.87,
        change: -0.34,
        changePercent: -1.13,
        marketCap: "168B",
        pe: 15.2,
        sector: "Healthcare",
        similarity: 82,
        reason: "Large pharmaceutical company",
      },
      {
        symbol: "ABBV",
        name: "AbbVie Inc.",
        price: 156.78,
        change: 1.23,
        changePercent: 0.79,
        marketCap: "277B",
        pe: 16.8,
        sector: "Healthcare",
        similarity: 78,
        reason: "Biopharmaceutical focus",
      },
    ],
  };

  return (
    sectorCompanies[sector] ||
    sectorCompanies.Technology.map((company, index) => ({
      ...company,
      similarity: 90 - index * 5,
      reason: `Similar to ${symbol} in market dynamics`,
    }))
  );
};

export function ComparableCompanies({
  targetSymbol,
  targetSector,
  onStockSelect,
  onAddToWatchlist,
  className,
}: ComparableCompaniesProps) {
  const [comparables] = useState(
    getComparableCompanies(targetSymbol, targetSector),
  );

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Companies Similar to {targetSymbol}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on sector, market cap, and business model
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {comparables.map((company, index) => {
          const isPositive = company.change >= 0;

          return (
            <div key={company.symbol} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{company.symbol}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            company.similarity >= 90
                              ? "bg-green-100 text-green-800 border-green-300"
                              : company.similarity >= 80
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-blue-100 text-blue-800 border-blue-300",
                          )}
                        >
                          {company.similarity}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {company.name}
                      </p>
                      <p className="text-xs text-blue-600">{company.reason}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        ${company.price.toFixed(2)}
                      </div>
                      <div
                        className={cn(
                          "flex items-center justify-end gap-1 text-sm",
                          isPositive ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>
                          {isPositive ? "+" : ""}
                          {company.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-3">
                    <div>
                      <span>Market Cap: </span>
                      <span className="font-medium">{company.marketCap}</span>
                    </div>
                    <div>
                      <span>P/E: </span>
                      <span className="font-medium">{company.pe}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStockSelect?.(company.symbol)}
                      className="flex-1 h-8 text-xs"
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddToWatchlist?.(company.symbol)}
                      className="h-8 text-xs text-blue-600"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              </div>

              {index < comparables.length - 1 && <Separator />}
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-blue-600"
            onClick={() => onStockSelect?.(`sector:${targetSector}`)}
          >
            View All {targetSector} Stocks
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
