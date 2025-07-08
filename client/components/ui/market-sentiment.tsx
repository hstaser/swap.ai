import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Volume2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingStock {
  symbol: string;
  name: string;
  change: number;
  changePercent: number;
  volume: string;
  reason: string;
}

interface MarketSentimentData {
  bullish: number;
  bearish: number;
  neutral: number;
  fearGreedIndex: number;
  vix: number;
  sentiment: "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed";
}

const marketSentiment: MarketSentimentData = {
  bullish: 68,
  bearish: 22,
  neutral: 10,
  fearGreedIndex: 67,
  vix: 18.45,
  sentiment: "Greed",
};

const topGainers: TrendingStock[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    change: 12.66,
    changePercent: 1.78,
    volume: "67.8M",
    reason: "AI earnings beat",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    change: 8.23,
    changePercent: 2.15,
    volume: "45.2M",
    reason: "Chip demand surge",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc",
    change: 3.45,
    changePercent: 2.56,
    volume: "31.2M",
    reason: "Cloud growth",
  },
];

const topLosers: TrendingStock[] = [
  {
    symbol: "TSLA",
    name: "Tesla Inc",
    change: -8.32,
    changePercent: -3.37,
    volume: "89.7M",
    reason: "Production concerns",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc",
    change: -6.78,
    changePercent: -2.14,
    volume: "22.1M",
    reason: "Subscriber miss",
  },
  {
    symbol: "PYPL",
    name: "PayPal Holdings",
    change: -4.56,
    changePercent: -1.87,
    volume: "18.9M",
    reason: "Competition fears",
  },
];

const mostWatched: TrendingStock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc",
    change: 2.31,
    changePercent: 1.28,
    volume: "52.4M",
    reason: "iPhone 15 launch",
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    change: 1.23,
    changePercent: 0.54,
    volume: "78.9M",
    reason: "Index tracking",
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    change: 2.14,
    changePercent: 0.71,
    volume: "45.6M",
    reason: "Tech exposure",
  },
];

export function MarketSentiment() {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Extreme Fear":
        return "text-red-600";
      case "Fear":
        return "text-orange-600";
      case "Neutral":
        return "text-gray-600";
      case "Greed":
        return "text-green-600";
      case "Extreme Greed":
        return "text-green-700";
      default:
        return "text-gray-600";
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case "Extreme Fear":
        return "bg-red-50 border-red-200";
      case "Fear":
        return "bg-orange-50 border-orange-200";
      case "Neutral":
        return "bg-gray-50 border-gray-200";
      case "Greed":
        return "bg-green-50 border-green-200";
      case "Extreme Greed":
        return "bg-green-100 border-green-300";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Market Sentiment Overview */}
      <Card className="bg-white/90 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "p-4 rounded-lg border-2 text-center",
              getSentimentBg(marketSentiment.sentiment),
            )}
          >
            <div className="text-2xl font-bold mb-1">
              {marketSentiment.fearGreedIndex}
            </div>
            <div
              className={cn(
                "font-semibold",
                getSentimentColor(marketSentiment.sentiment),
              )}
            >
              {marketSentiment.sentiment}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Fear & Greed Index
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-success">
                {marketSentiment.bullish}%
              </div>
              <div className="text-xs text-muted-foreground">Bullish</div>
            </div>
            <div>
              <div className="text-lg font-bold text-muted-foreground">
                {marketSentiment.neutral}%
              </div>
              <div className="text-xs text-muted-foreground">Neutral</div>
            </div>
            <div>
              <div className="text-lg font-bold text-destructive">
                {marketSentiment.bearish}%
              </div>
              <div className="text-xs text-muted-foreground">Bearish</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>VIX (Fear Index)</span>
              <span className="font-medium">{marketSentiment.vix}</span>
            </div>
            <Progress value={marketSentiment.vix} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Top Gainers */}
      <Card className="bg-white/90 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Top Gainers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topGainers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
            >
              <div>
                <div className="font-semibold text-sm">{stock.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {stock.reason}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-success">
                  +{stock.changePercent.toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Vol: {stock.volume}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card className="bg-white/90 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            Top Losers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topLosers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
            >
              <div>
                <div className="font-semibold text-sm">{stock.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {stock.reason}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-destructive">
                  {stock.changePercent.toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Vol: {stock.volume}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Most Watched */}
      <Card className="bg-white/90 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Most Watched
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mostWatched.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
            >
              <div>
                <div className="font-semibold text-sm">{stock.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {stock.reason}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "font-bold",
                    stock.change >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Vol: {stock.volume}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
