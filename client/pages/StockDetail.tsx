import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComparableCompanies } from "@/components/ui/comparable-companies";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
  BarChart3,
  DollarSign,
  Calendar,
  Users,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailedStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  marketCap: string;
  volume: string;
  pe: number | null;
  dividendYield: number | null;
  week52High: number;
  week52Low: number;
  avgVolume: string;
  beta: number;
  eps: number;
  revenue: string;
  employees: string;
  founded: string;
  headquarters: string;
  description: string;
  news: Array<{
    title: string;
    source: string;
    time: string;
    summary: string;
  }>;
  financials: {
    revenue: string;
    netIncome: string;
    grossMargin: string;
    operatingMargin: string;
    profitMargin: string;
    roe: string;
    roa: string;
    debtToEquity: string;
  };
  keyStats: {
    sharesOutstanding: string;
    institutionalOwnership: string;
  };
}

const mockDetailedStocks: { [key: string]: DetailedStock } = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 182.52,
    change: 2.31,
    changePercent: 1.28,
    sector: "Technology",
    marketCap: "2.85T",
    volume: "52.4M",
    pe: 29.8,
    dividendYield: 0.5,
    week52High: 199.62,
    week52Low: 164.08,
    avgVolume: "57.2M",
    beta: 1.24,
    eps: 6.13,
    revenue: "394.3B",
    employees: "164,000",
    founded: "1976",
    headquarters: "Cupertino, CA",
    description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets.",
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
    financials: {
      revenue: "394.3B",
      netIncome: "99.8B",
      grossMargin: "44.1%",
      operatingMargin: "29.8%",
      profitMargin: "25.3%",
      roe: "160.1%",
      roa: "22.4%",
      debtToEquity: "1.73",
    },
    keyStats: {
      sharesOutstanding: "15.6B",
      institutionalOwnership: "59.8%",
    },
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 238.77,
    change: -8.32,
    changePercent: -3.37,
    sector: "Consumer Discretionary",
    marketCap: "759.8B",
    volume: "89.7M",
    pe: 73.2,
    dividendYield: null,
    week52High: 299.29,
    week52Low: 152.37,
    avgVolume: "85.4M",
    beta: 2.31,
    eps: 3.26,
    revenue: "96.8B",
    employees: "140,473",
    founded: "2003",
    headquarters: "Austin, TX",
    description:
      "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.",
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
    financials: {
      revenue: "96.8B",
      netIncome: "15.0B",
      grossMargin: "19.3%",
      operatingMargin: "9.6%",
      profitMargin: "15.5%",
      roe: "28.1%",
      roa: "12.3%",
      debtToEquity: "0.17",
    },
    keyStats: {
      sharesOutstanding: "3.18B",
      institutionalOwnership: "44.2%",
    },
  },
  COIN: {
    symbol: "COIN",
    name: "Coinbase Global, Inc.",
    price: 156.78,
    change: 4.23,
    changePercent: 2.77,
    sector: "Financial Services",
    marketCap: "37.8B",
    volume: "12.3M",
    pe: 51.2,
    dividendYield: null,
    week52High: 429.54,
    week52Low: 31.55,
    avgVolume: "18.7M",
    beta: 3.51,
    eps: 3.06,
    revenue: "7.4B",
    employees: "4,948",
    founded: "2012",
    headquarters: "San Francisco, CA",
    description:
      "Coinbase Global, Inc. operates a cryptocurrency exchange platform that allows users to buy, sell, and store cryptocurrencies. The company provides institutional trading, custody, and other services to professional investors.",
    news: [
      {
        title: "Coinbase announces new institutional custody services",
        source: "CoinDesk",
        time: "3h ago",
        summary:
          "The crypto exchange expands its institutional offerings with enhanced custody solutions for large investors.",
      },
      {
        title: "SEC approves Bitcoin ETF applications",
        source: "Reuters",
        time: "5h ago",
        summary:
          "Regulatory approval for Bitcoin ETFs could drive increased trading volume on Coinbase's platform.",
      },
      {
        title: "Coinbase reports strong Q4 trading volumes",
        source: "Bloomberg",
        time: "1d ago",
        summary:
          "Cryptocurrency trading activity surged in the fourth quarter, boosting revenue expectations.",
      },
    ],
    financials: {
      revenue: "7.4B",
      netIncome: "1.6B",
      grossMargin: "85.2%",
      operatingMargin: "21.8%",
      profitMargin: "21.6%",
      roe: "8.9%",
      roa: "6.1%",
      debtToEquity: "0.09",
    },
    keyStats: {
      sharesOutstanding: "241M",
      institutionalOwnership: "58.3%",
    },
  },
  AMD: {
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
    price: 142.18,
    change: 3.45,
    changePercent: 2.49,
    sector: "Technology",
    marketCap: "230.1B",
    volume: "45.2M",
    pe: 58.7,
    dividendYield: null,
    week52High: 227.3,
    week52Low: 89.02,
    avgVolume: "52.8M",
    beta: 1.97,
    eps: 2.42,
    revenue: "23.6B",
    employees: "26,000",
    founded: "1969",
    headquarters: "Santa Clara, CA",
    description:
      "Advanced Micro Devices, Inc. operates as a semiconductor company worldwide. The company operates in two segments, Computing and Graphics; and Enterprise, Embedded and Semi-Custom.",
    news: [
      {
        title: "AMD announces next-gen Ryzen processors",
        source: "AnandTech",
        time: "2h ago",
        summary:
          "New Ryzen 8000 series promises significant performance improvements for gaming and content creation.",
      },
      {
        title: "Data center revenue grows 38% year-over-year",
        source: "MarketWatch",
        time: "4h ago",
        summary:
          "Strong demand for server processors drives AMD's data center business growth.",
      },
    ],
    financials: {
      revenue: "23.6B",
      netIncome: "1.3B",
      grossMargin: "45.7%",
      operatingMargin: "5.7%",
      profitMargin: "5.5%",
      roe: "3.2%",
      roa: "2.1%",
      debtToEquity: "0.04",
    },
    keyStats: {
      sharesOutstanding: "1.62B",
      institutionalOwnership: "67.8%",
    },
  },
  PLTR: {
    symbol: "PLTR",
    name: "Palantir Technologies Inc.",
    price: 16.42,
    change: 0.87,
    changePercent: 5.59,
    sector: "Technology",
    marketCap: "35.8B",
    volume: "28.4M",
    pe: 189.5,
    dividendYield: null,
    week52High: 39.5,
    week52Low: 6.44,
    avgVolume: "45.6M",
    beta: 4.35,
    eps: 0.09,
    revenue: "2.2B",
    employees: "3,500",
    founded: "2003",
    headquarters: "Denver, CO",
    description:
      "Palantir Technologies Inc. builds and deploys software platforms for the intelligence community and commercial enterprises. The company operates through two segments: Palantir Gotham and Palantir Foundry.",
    news: [
      {
        title: "Palantir wins major government contract",
        source: "Defense News",
        time: "1h ago",
        summary:
          "Multi-year contract with defense agency expands Palantir's government presence.",
      },
      {
        title: "Commercial customer growth accelerates",
        source: "TechCrunch",
        time: "3h ago",
        summary:
          "Enterprise adoption of Foundry platform drives commercial revenue growth.",
      },
    ],
    financials: {
      revenue: "2.2B",
      netIncome: "0.18B",
      grossMargin: "81.4%",
      operatingMargin: "8.1%",
      profitMargin: "8.2%",
      roe: "3.8%",
      roa: "2.9%",
      debtToEquity: "0.00",
    },
    keyStats: {
      sharesOutstanding: "2.18B",
      institutionalOwnership: "32.1%",
    },
  },
  RIVN: {
    symbol: "RIVN",
    name: "Rivian Automotive, Inc.",
    price: 18.73,
    change: -0.94,
    changePercent: -4.78,
    sector: "Consumer Discretionary",
    marketCap: "17.2B",
    volume: "15.8M",
    pe: null,
    dividendYield: null,
    week52High: 67.52,
    week52Low: 8.26,
    avgVolume: "22.4M",
    beta: 1.87,
    eps: -5.42,
    revenue: "4.4B",
    employees: "14,000",
    founded: "2009",
    headquarters: "Irvine, CA",
    description:
      "Rivian Automotive, Inc. designs, develops, manufactures, and sells electric vehicles and accessories. The company offers pickup trucks and delivery vans.",
    news: [
      {
        title: "Rivian increases production guidance for 2024",
        source: "Automotive News",
        time: "2h ago",
        summary:
          "Company raises annual production target following manufacturing improvements.",
      },
      {
        title: "Amazon partnership delivers first commercial vans",
        source: "Reuters",
        time: "5h ago",
        summary:
          "Electric delivery vans begin rollout to Amazon logistics network.",
      },
    ],
    financials: {
      revenue: "4.4B",
      netIncome: "-5.4B",
      grossMargin: "-39.4%",
      operatingMargin: "-122.7%",
      profitMargin: "-122.7%",
      roe: "-68.4%",
      roa: "-45.2%",
      debtToEquity: "0.12",
    },
    keyStats: {
      sharesOutstanding: "918M",
      institutionalOwnership: "52.7%",
    },
  },
};

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [isInWatchlist, setIsInWatchlist] = useState(true);
  const [isInPortfolio, setIsInPortfolio] = useState(false);

  const stock = symbol ? mockDetailedStocks[symbol] : null;

  useEffect(() => {
    if (!stock) {
      navigate("/watchlist");
    }
  }, [stock, navigate]);

  if (!stock) {
    return null;
  }

  const isPositive = stock.change >= 0;

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  const addToPortfolio = () => {
    setIsInPortfolio(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-bold">{stock.symbol}</h1>
              <p className="text-sm text-muted-foreground">{stock.sector}</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Main Stock Info */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <h3 className="font-bold text-foreground text-4xl">
                  {stock.symbol}
                </h3>
                <Badge variant="outline" className="text-sm">
                  {stock.sector}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground font-medium">
                {stock.name}
              </p>
            </div>

            {/* Price and Change */}
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-foreground">
                ${stock.price.toFixed(2)}
              </div>
              <div
                className={cn(
                  "flex items-center justify-center gap-2 text-xl font-semibold",
                  isPositive ? "text-success" : "text-destructive",
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={addToPortfolio}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
                disabled={isInPortfolio}
              >
                <Plus className="h-5 w-5 mr-2" />
                {isInPortfolio ? "Added to Portfolio" : "Add to Portfolio"}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={toggleWatchlist}
                  className="h-12 font-semibold"
                  size="lg"
                >
                  {isInWatchlist ? (
                    <EyeOff className="h-5 w-5 mr-2" />
                  ) : (
                    <Eye className="h-5 w-5 mr-2" />
                  )}
                  {isInWatchlist ? "Remove" : "Watchlist"}
                </Button>

                <Button
                  variant="outline"
                  className="h-12 font-semibold"
                  size="lg"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Market Cap
                    </span>
                    <div className="font-semibold">{stock.marketCap}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Volume
                    </span>
                    <div className="font-semibold">{stock.volume}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      P/E Ratio
                    </span>
                    <div className="font-semibold">
                      {stock.pe?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Dividend Yield
                    </span>
                    <div className="font-semibold">
                      {stock.dividendYield
                        ? `${stock.dividendYield.toFixed(2)}%`
                        : "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      52W High
                    </span>
                    <div className="font-semibold">
                      ${stock.week52High.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      52W Low
                    </span>
                    <div className="font-semibold">
                      ${stock.week52Low.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Beta</span>
                    <div className="font-semibold">{stock.beta.toFixed(2)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">EPS</span>
                    <div className="font-semibold">${stock.eps.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4">Company Information</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Founded
                        </div>
                        <div className="font-medium">{stock.founded}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Headquarters
                        </div>
                        <div className="font-medium">{stock.headquarters}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Employees
                        </div>
                        <div className="font-medium">{stock.employees}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Revenue
                        </div>
                        <div className="font-medium">{stock.revenue}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Description
                    </div>
                    <p className="text-sm leading-relaxed">
                      {stock.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4">Financial Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Financial Metrics */}
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Revenue
                    </span>
                    <div className="font-semibold">
                      {stock.financials.revenue}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Net Income
                    </span>
                    <div className="font-semibold">
                      {stock.financials.netIncome}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Gross Margin
                    </span>
                    <div className="font-semibold">
                      {stock.financials.grossMargin}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Profit Margin
                    </span>
                    <div className="font-semibold">
                      {stock.financials.profitMargin}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">ROE</span>
                    <div className="font-semibold">{stock.financials.roe}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Debt to Equity
                    </span>
                    <div className="font-semibold">
                      {stock.financials.debtToEquity}
                    </div>
                  </div>

                  {/* Basic Stock Stats */}
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Shares Outstanding
                    </span>
                    <div className="font-semibold">
                      {stock.keyStats.sharesOutstanding}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Average Volume
                    </span>
                    <div className="font-semibold">{stock.avgVolume}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Institutional Ownership
                    </span>
                    <div className="font-semibold">
                      {stock.keyStats.institutionalOwnership}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Beta</span>
                    <div className="font-semibold">{stock.beta.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similar" className="space-y-4">
            <ComparableCompanies
              targetSymbol={stock.symbol}
              targetSector={stock.sector}
              onStockSelect={(symbol) => {
                navigate(`/stock/${symbol}`);
              }}
              onAddToWatchlist={(symbol) => {
                console.log(`Adding ${symbol} to watchlist`);
                // Could add toast notification here
              }}
              className="bg-white/90 backdrop-blur-sm border-0"
            />
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            {stock.news.map((newsItem, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-0"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h5 className="font-semibold text-sm leading-tight flex-1">
                      {newsItem.title}
                    </h5>
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="font-medium">{newsItem.source}</span>
                    <span>•</span>
                    <span>{newsItem.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {newsItem.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
