import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Globe,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

interface SectorPerformance {
  sector: string;
  change: number;
  changePercent: number;
  marketCap: string;
  leaders: string[];
}

interface EconomicEvent {
  time: string;
  event: string;
  importance: "High" | "Medium" | "Low";
  previous: string;
  forecast: string;
  actual?: string;
}

interface MarketNews {
  title: string;
  source: string;
  time: string;
  summary: string;
  impact: "Positive" | "Negative" | "Neutral";
}

const marketIndices: MarketIndex[] = [
  {
    name: "S&P 500",
    symbol: "SPX",
    value: 4384.63,
    change: 23.45,
    changePercent: 0.54,
  },
  {
    name: "Dow Jones",
    symbol: "DJI",
    value: 34152.01,
    change: -127.83,
    changePercent: -0.37,
  },
  {
    name: "NASDAQ",
    symbol: "IXIC",
    value: 13500.67,
    change: 95.22,
    changePercent: 0.71,
  },
  {
    name: "Russell 2000",
    symbol: "RUT",
    value: 1876.23,
    change: 12.34,
    changePercent: 0.66,
  },
];

const globalMarkets: MarketIndex[] = [
  {
    name: "FTSE 100",
    symbol: "UKX",
    value: 7683.45,
    change: -34.21,
    changePercent: -0.44,
  },
  {
    name: "DAX",
    symbol: "DAX",
    value: 15876.23,
    change: 67.89,
    changePercent: 0.43,
  },
  {
    name: "Nikkei 225",
    symbol: "N225",
    value: 32145.67,
    change: 234.56,
    changePercent: 0.74,
  },
  {
    name: "Shanghai",
    symbol: "SHCOMP",
    value: 3245.78,
    change: -45.23,
    changePercent: -1.37,
  },
];

const sectorPerformance: SectorPerformance[] = [
  {
    sector: "Technology",
    change: 1.23,
    changePercent: 1.45,
    marketCap: "12.4T",
    leaders: ["AAPL", "MSFT", "GOOGL"],
  },
  {
    sector: "Healthcare",
    change: 0.87,
    changePercent: 0.92,
    marketCap: "6.7T",
    leaders: ["JNJ", "PFE", "UNH"],
  },
  {
    sector: "Financial Services",
    change: -0.34,
    changePercent: -0.45,
    marketCap: "8.9T",
    leaders: ["JPM", "BAC", "WFC"],
  },
  {
    sector: "Energy",
    change: 2.15,
    changePercent: 2.87,
    marketCap: "4.2T",
    leaders: ["XOM", "CVX", "COP"],
  },
  {
    sector: "Consumer Discretionary",
    change: -1.12,
    changePercent: -1.34,
    marketCap: "5.8T",
    leaders: ["AMZN", "TSLA", "HD"],
  },
];

const economicEvents: EconomicEvent[] = [
  {
    time: "09:30",
    event: "Initial Jobless Claims",
    importance: "High",
    previous: "230K",
    forecast: "225K",
    actual: "218K",
  },
  {
    time: "14:00",
    event: "Fed Interest Rate Decision",
    importance: "High",
    previous: "5.25%",
    forecast: "5.50%",
  },
  {
    time: "15:30",
    event: "GDP Growth Rate",
    importance: "Medium",
    previous: "2.1%",
    forecast: "2.3%",
  },
];

const marketNews: MarketNews[] = [
  {
    title: "Federal Reserve Signals Potential Rate Cut in Q4",
    source: "Reuters",
    time: "2h ago",
    summary: "Fed officials hint at dovish stance amid cooling inflation data",
    impact: "Positive",
  },
  {
    title: "Tech Earnings Beat Expectations Across the Board",
    source: "CNBC",
    time: "3h ago",
    summary:
      "Major technology companies report strong quarterly results driven by AI investments",
    impact: "Positive",
  },
  {
    title: "Oil Prices Surge on Middle East Tensions",
    source: "Bloomberg",
    time: "4h ago",
    summary: "Crude oil futures jump 3% as geopolitical concerns mount",
    impact: "Negative",
  },
  {
    title: "Consumer Confidence Hits 6-Month Low",
    source: "MarketWatch",
    time: "5h ago",
    summary:
      "Economic uncertainty weighs on consumer sentiment despite strong job market",
    impact: "Negative",
  },
];

export default function Markets() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Markets</h1>
                <p className="text-sm text-muted-foreground">
                  Updated {formatTime(lastUpdated)}
                </p>
              </div>
            </div>
            <Button
              onClick={refreshData}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Market Overview */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Market Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {marketIndices.map((index) => (
                <div
                  key={index.symbol}
                  className="p-3 bg-gray-50 rounded-lg space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{index.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {index.symbol}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold">
                    {index.value.toLocaleString()}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      index.change >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {index.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>
                      {index.change >= 0 ? "+" : ""}
                      {index.change.toFixed(2)} ({index.change >= 0 ? "+" : ""}
                      {index.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Markets Tabs */}
        <Tabs defaultValue="sectors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          {/* Sector Performance */}
          <TabsContent value="sectors" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Sector Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sectorPerformance.map((sector) => (
                  <div key={sector.sector} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{sector.sector}</span>
                        <div className="text-sm text-muted-foreground">
                          Market Cap: {sector.marketCap}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-semibold",
                            sector.change >= 0
                              ? "text-success"
                              : "text-destructive",
                          )}
                        >
                          {sector.change >= 0 ? "+" : ""}
                          {sector.changePercent.toFixed(2)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Leaders: {sector.leaders.join(", ")}
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={Math.abs(sector.changePercent) * 10}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Global Markets */}
          <TabsContent value="global" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Global Markets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {globalMarkets.map((market) => (
                  <div
                    key={market.symbol}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{market.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {market.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {market.value.toLocaleString()}
                      </div>
                      <div
                        className={cn(
                          "text-sm font-medium",
                          market.change >= 0
                            ? "text-success"
                            : "text-destructive",
                        )}
                      >
                        {market.change >= 0 ? "+" : ""}
                        {market.change.toFixed(2)} (
                        {market.change >= 0 ? "+" : ""}
                        {market.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market News */}
          <TabsContent value="news" className="space-y-4">
            {marketNews.map((news, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-0"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-sm leading-tight flex-1">
                      {news.title}
                    </h4>
                    <Badge
                      variant={
                        news.impact === "Positive"
                          ? "secondary"
                          : news.impact === "Negative"
                            ? "destructive"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {news.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="font-medium">{news.source}</span>
                    <span>•</span>
                    <span>{news.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {news.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12" asChild>
            <Link to="/">
              <Activity className="h-5 w-5 mr-2" />
              Stock Screener
            </Link>
          </Button>
          <Button variant="outline" className="h-12" asChild>
            <Link to="/portfolio">
              <BarChart3 className="h-5 w-5 mr-2" />
              Portfolio Analysis
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
