import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Percent,
  Users,
  Target,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectorStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  dividendYield?: number;
  description: string;
}

interface ETF {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  expenseRatio: number;
  aum: string;
  description: string;
  holdings: string[];
}

interface SectorExplorerProps {
  sector: "Healthcare" | "Financial Services" | "International";
  onClose: () => void;
  onAddToQueue: (symbol: string) => void;
}

const mockData = {
  Healthcare: {
    overview: {
      description: "Healthcare sector focusing on pharmaceuticals, medical devices, and healthcare services. Generally defensive with steady growth potential.",
      marketCap: "$4.2T",
      avgPE: "18.5",
      avgDividendYield: "2.1%",
      ytdReturn: "+8.3%"
    },
    stocks: [
      {
        symbol: "JNJ",
        name: "Johnson & Johnson",
        price: 161.42,
        change: 0.34,
        changePercent: 0.21,
        marketCap: "427.3B",
        peRatio: 15.2,
        dividendYield: 3.1,
        description: "Diversified healthcare conglomerate with pharmaceuticals, medical devices, and consumer products"
      },
      {
        symbol: "PFE",
        name: "Pfizer Inc.",
        price: 41.23,
        change: 0.87,
        changePercent: 2.15,
        marketCap: "232.1B",
        peRatio: 12.8,
        dividendYield: 5.2,
        description: "Global pharmaceutical company known for vaccines and specialty medicines"
      },
      {
        symbol: "UNH",
        name: "UnitedHealth Group",
        price: 542.18,
        change: 4.32,
        changePercent: 0.80,
        marketCap: "508.7B",
        peRatio: 24.1,
        dividendYield: 1.3,
        description: "Health insurance and healthcare services provider"
      },
      {
        symbol: "ABBV",
        name: "AbbVie Inc.",
        price: 156.78,
        change: -1.23,
        changePercent: -0.78,
        marketCap: "276.8B",
        peRatio: 16.4,
        dividendYield: 3.8,
        description: "Biopharmaceutical company focused on immunology and oncology"
      }
    ] as SectorStock[],
    etfs: [
      {
        symbol: "XLV",
        name: "Health Care Select Sector SPDR Fund",
        price: 134.56,
        change: 0.89,
        changePercent: 0.67,
        expenseRatio: 0.10,
        aum: "$31.2B",
        description: "Tracks S&P 500 healthcare companies",
        holdings: ["UNH", "JNJ", "PFE", "ABBV", "LLY"]
      },
      {
        symbol: "VHT",
        name: "Vanguard Health Care ETF",
        price: 243.21,
        change: 1.45,
        changePercent: 0.60,
        expenseRatio: 0.10,
        aum: "$14.8B",
        description: "Broad healthcare sector exposure with low fees",
        holdings: ["UNH", "JNJ", "ABBV", "PFE", "TMO"]
      }
    ] as ETF[]
  },
  "Financial Services": {
    overview: {
      description: "Banks, insurance companies, and financial services. Benefits from rising interest rates but sensitive to economic cycles.",
      marketCap: "$3.8T",
      avgPE: "12.8",
      avgDividendYield: "2.8%",
      ytdReturn: "+12.7%"
    },
    stocks: [
      {
        symbol: "JPM",
        name: "JPMorgan Chase & Co.",
        price: 154.23,
        change: -0.87,
        changePercent: -0.56,
        marketCap: "452.1B",
        peRatio: 12.8,
        dividendYield: 2.4,
        description: "Largest U.S. bank by assets, strong investment banking division"
      },
      {
        symbol: "BAC",
        name: "Bank of America Corp.",
        price: 33.47,
        change: 0.23,
        changePercent: 0.69,
        marketCap: "274.2B",
        peRatio: 11.5,
        dividendYield: 2.8,
        description: "Second-largest bank in the U.S. with extensive retail network"
      },
      {
        symbol: "WFC",
        name: "Wells Fargo & Company",
        price: 42.18,
        change: -0.34,
        changePercent: -0.80,
        marketCap: "159.8B",
        peRatio: 10.2,
        dividendYield: 3.1,
        description: "Major U.S. bank focusing on retail and commercial banking"
      },
      {
        symbol: "GS",
        name: "Goldman Sachs Group",
        price: 387.65,
        change: 2.45,
        changePercent: 0.64,
        marketCap: "132.7B",
        peRatio: 14.1,
        dividendYield: 2.2,
        description: "Leading investment bank and financial services company"
      }
    ] as SectorStock[],
    etfs: [
      {
        symbol: "XLF",
        name: "Financial Select Sector SPDR Fund",
        price: 38.92,
        change: 0.15,
        changePercent: 0.39,
        expenseRatio: 0.10,
        aum: "$13.7B",
        description: "Tracks S&P 500 financial companies",
        holdings: ["BRK.B", "JPM", "V", "MA", "BAC"]
      },
      {
        symbol: "VFH",
        name: "Vanguard Financials ETF",
        price: 95.34,
        change: 0.67,
        changePercent: 0.71,
        expenseRatio: 0.10,
        aum: "$6.2B",
        description: "Broad financials sector exposure",
        holdings: ["BRK.B", "JPM", "V", "BAC", "WFC"]
      }
    ] as ETF[]
  },
  International: {
    overview: {
      description: "International and emerging market exposure for global diversification. Includes developed and emerging markets.",
      marketCap: "$2.1T",
      avgPE: "14.2",
      avgDividendYield: "3.4%",
      ytdReturn: "+6.8%"
    },
    stocks: [
      {
        symbol: "TSM",
        name: "Taiwan Semiconductor",
        price: 98.45,
        change: 1.23,
        changePercent: 1.27,
        marketCap: "510.2B",
        peRatio: 18.5,
        dividendYield: 1.8,
        description: "World's largest contract semiconductor manufacturer"
      },
      {
        symbol: "ASML",
        name: "ASML Holding N.V.",
        price: 756.23,
        change: -4.67,
        changePercent: -0.61,
        marketCap: "309.4B",
        peRatio: 38.2,
        dividendYield: 0.9,
        description: "Dutch semiconductor equipment manufacturer"
      },
      {
        symbol: "NESN",
        name: "Nestle S.A.",
        price: 112.34,
        change: 0.45,
        changePercent: 0.40,
        marketCap: "342.1B",
        peRatio: 19.8,
        dividendYield: 3.2,
        description: "Swiss multinational food and beverage company"
      },
      {
        symbol: "TM",
        name: "Toyota Motor Corp.",
        price: 197.89,
        change: -1.12,
        changePercent: -0.56,
        marketCap: "268.5B",
        peRatio: 9.4,
        dividendYield: 2.4,
        description: "Japanese automotive manufacturer"
      }
    ] as SectorStock[],
    etfs: [
      {
        symbol: "VXUS",
        name: "Vanguard Total International Stock ETF",
        price: 58.67,
        change: 0.23,
        changePercent: 0.39,
        expenseRatio: 0.08,
        aum: "$178.9B",
        description: "Broad international stock market exposure",
        holdings: ["TSLA", "ASML", "NESN", "TM", "RHHBY"]
      },
      {
        symbol: "VEA",
        name: "Vanguard FTSE Developed Markets ETF",
        price: 48.92,
        change: 0.18,
        changePercent: 0.37,
        expenseRatio: 0.05,
        aum: "$104.3B",
        description: "Developed international markets excluding U.S.",
        holdings: ["NESN", "ASML", "TM", "NOVN", "ROG"]
      },
      {
        symbol: "VWO",
        name: "Vanguard Emerging Markets Stock ETF",
        price: 42.15,
        change: 0.34,
        changePercent: 0.81,
        expenseRatio: 0.10,
        aum: "$69.7B",
        description: "Emerging markets stock exposure",
        holdings: ["TSM", "TCEHY", "BABA", "INFY", "PDD"]
      }
    ] as ETF[]
  }
};

export function SectorExplorer({ sector, onClose, onAddToQueue }: SectorExplorerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "stocks" | "etfs">("overview");
  const data = mockData[sector];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-xl">Explore {sector}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {data.overview.description}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="flex border-b">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "stocks" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("stocks")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Individual Stocks
          </Button>
          <Button
            variant={activeTab === "etfs" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("etfs")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            ETFs
          </Button>
        </div>

        {/* Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{data.overview.marketCap}</div>
                  <div className="text-sm text-muted-foreground">Total Market Cap</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{data.overview.avgPE}</div>
                  <div className="text-sm text-muted-foreground">Avg P/E Ratio</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Percent className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{data.overview.avgDividendYield}</div>
                  <div className="text-sm text-muted-foreground">Avg Dividend Yield</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{data.overview.ytdReturn}</div>
                  <div className="text-sm text-muted-foreground">YTD Return</div>
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Investment Considerations</h3>
                  <p className="text-sm text-blue-700">
                    {data.overview.description}
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Stocks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {data.stocks.slice(0, 3).map((stock) => (
                      <div key={stock.symbol} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{formatCurrency(stock.price)}</div>
                        </div>
                        <div className={cn(
                          "text-sm font-medium",
                          stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular ETFs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {data.etfs.slice(0, 3).map((etf) => (
                      <div key={etf.symbol} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{etf.symbol}</div>
                          <div className="text-sm text-muted-foreground">{formatCurrency(etf.price)}</div>
                        </div>
                        <div className={cn(
                          "text-sm font-medium",
                          etf.changePercent >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {etf.changePercent >= 0 ? "+" : ""}{etf.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "stocks" && (
            <div className="space-y-4">
              {data.stocks.map((stock) => (
                <Card key={stock.symbol} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{stock.symbol}</h3>
                          <Badge variant="outline">{stock.marketCap}</Badge>
                        </div>
                        <h4 className="font-medium text-lg mb-2">{stock.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{stock.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <div className="font-bold">{formatCurrency(stock.price)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">P/E Ratio:</span>
                            <div className="font-bold">{stock.peRatio}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Dividend:</span>
                            <div className="font-bold">{stock.dividendYield ? `${stock.dividendYield}%` : "N/A"}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Today:</span>
                            <div className={cn(
                              "font-bold",
                              stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => onAddToQueue(stock.symbol)}
                        className="ml-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Queue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "etfs" && (
            <div className="space-y-4">
              {data.etfs.map((etf) => (
                <Card key={etf.symbol} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{etf.symbol}</h3>
                          <Badge variant="outline">ETF</Badge>
                          <Badge variant="secondary">{etf.aum} AUM</Badge>
                        </div>
                        <h4 className="font-medium text-lg mb-2">{etf.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{etf.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <div className="font-bold">{formatCurrency(etf.price)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expense Ratio:</span>
                            <div className="font-bold">{etf.expenseRatio}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">AUM:</span>
                            <div className="font-bold">{etf.aum}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Today:</span>
                            <div className={cn(
                              "font-bold",
                              etf.changePercent >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {etf.changePercent >= 0 ? "+" : ""}{etf.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-muted-foreground">Top Holdings:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {etf.holdings.map((holding) => (
                              <Badge key={holding} variant="outline" className="text-xs">
                                {holding}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => onAddToQueue(etf.symbol)}
                        className="ml-4 bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Queue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
