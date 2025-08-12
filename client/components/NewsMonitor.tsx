import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Clock,
  ExternalLink,
  MessageCircle,
  Eye,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";
import { useNavigate } from "react-router-dom";

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  relevantSymbols: string[];
  sentiment: "positive" | "negative" | "neutral";
  urgency: "low" | "medium" | "high";
  impactLevel: "minor" | "moderate" | "significant";
  category: "earnings" | "merger" | "regulation" | "market" | "product" | "analyst";
  url: string;
}

interface PortfolioImpactAnalysis {
  symbol: string;
  impact: "positive" | "negative" | "neutral";
  confidence: number;
  reasoning: string;
  priceTarget?: {
    current: number;
    target: number;
    timeframe: string;
  };
}

interface NewsMonitorProps {
  className?: string;
}

export default function NewsMonitor({ className }: NewsMonitorProps) {
  const { queue } = useQueue();
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PortfolioImpactAnalysis[]>([]);

  // Mock news articles - in production this would come from a real news API
  const newsArticles: NewsArticle[] = [
    {
      id: "news_1",
      headline: "Apple Reports Record Q4 Revenue Driven by iPhone 15 Sales",
      summary: "Apple announced Q4 earnings that beat analyst expectations, with iPhone revenue up 15% year-over-year. Strong services growth and international expansion driving results.",
      source: "Reuters",
      timestamp: "2024-01-15T14:30:00Z",
      relevantSymbols: ["AAPL"],
      sentiment: "positive",
      urgency: "high",
      impactLevel: "significant",
      category: "earnings",
      url: "#",
    },
    {
      id: "news_2",
      headline: "Tesla Faces Increased Competition in China EV Market",
      summary: "Local Chinese EV manufacturers gaining market share as Tesla's sales growth slows in key Chinese markets. BYD and NIO showing strong momentum.",
      source: "Bloomberg",
      timestamp: "2024-01-15T13:15:00Z",
      relevantSymbols: ["TSLA", "NIO"],
      sentiment: "negative",
      urgency: "medium",
      impactLevel: "moderate",
      category: "market",
      url: "#",
    },
    {
      id: "news_3",
      headline: "Microsoft Azure Revenue Grows 30% Amid AI Expansion",
      summary: "Microsoft's cloud division continues strong growth with Azure posting 30% revenue increase. Heavy investment in AI infrastructure paying off with enterprise adoption.",
      source: "CNBC",
      timestamp: "2024-01-15T12:45:00Z",
      relevantSymbols: ["MSFT"],
      sentiment: "positive",
      urgency: "medium",
      impactLevel: "moderate",
      category: "earnings",
      url: "#",
    },
    {
      id: "news_4",
      headline: "Fed Signals Potential Rate Cuts in 2024",
      summary: "Federal Reserve officials hint at possible interest rate reductions if inflation continues declining. Market anticipates 2-3 cuts this year.",
      source: "Wall Street Journal",
      timestamp: "2024-01-15T11:20:00Z",
      relevantSymbols: ["SPY", "QQQ", "AAPL", "MSFT", "GOOGL", "AMZN"],
      sentiment: "positive",
      urgency: "high",
      impactLevel: "significant",
      category: "market",
      url: "#",
    },
    {
      id: "news_5",
      headline: "NVIDIA Partners with Major Automakers for AI Chips",
      summary: "NVIDIA announces new partnerships with Ford and GM to supply AI chips for autonomous vehicle development. Multi-billion dollar deals expected.",
      source: "TechCrunch",
      timestamp: "2024-01-15T10:30:00Z",
      relevantSymbols: ["NVDA", "F", "GM"],
      sentiment: "positive",
      urgency: "medium",
      impactLevel: "moderate",
      category: "product",
      url: "#",
    },
  ];

  // Filter articles relevant to user's queue
  const relevantArticles = newsArticles.filter(article =>
    article.relevantSymbols.some(symbol =>
      queue.some(queueItem => queueItem.symbol === symbol)
    )
  );

  const handleAnalyzeImpact = (article: NewsArticle) => {
    setSelectedArticle(article);
    
    // Generate mock portfolio impact analysis
    const analysis: PortfolioImpactAnalysis[] = [];
    
    article.relevantSymbols.forEach(symbol => {
      const queueItem = queue.find(item => item.symbol === symbol);
      if (queueItem) {
        const mockAnalysis: PortfolioImpactAnalysis = {
          symbol,
          impact: article.sentiment === "positive" ? "positive" : article.sentiment === "negative" ? "negative" : "neutral",
          confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
          reasoning: generateMockReasoning(symbol, article),
          priceTarget: {
            current: Math.floor(Math.random() * 200) + 100,
            target: Math.floor(Math.random() * 250) + 125,
            timeframe: "3-6 months"
          }
        };
        analysis.push(mockAnalysis);
      }
    });
    
    setCurrentAnalysis(analysis);
    setShowImpactAnalysis(true);
  };

  const generateMockReasoning = (symbol: string, article: NewsArticle): string => {
    const reasoningMap: Record<string, Record<string, string>> = {
      "AAPL": {
        "earnings": "Strong iPhone sales and services growth directly boost Apple's core revenue streams. Positive earnings surprise typically drives 3-5% stock appreciation.",
        "market": "Market-wide sentiment impacts Apple due to its large market cap weighting in major indices."
      },
      "TSLA": {
        "market": "Increased competition in China, Tesla's second-largest market, could pressure margins and growth targets.",
        "product": "Product announcements and competitive dynamics significantly impact Tesla's premium valuation."
      },
      "MSFT": {
        "earnings": "Azure growth and AI investments position Microsoft well for long-term cloud market leadership.",
        "market": "Enterprise-focused business model provides stability during market volatility."
      },
      "NVDA": {
        "product": "New partnerships expand NVIDIA's addressable market beyond gaming into automotive AI.",
        "market": "AI chip demand remains strong across multiple sectors."
      }
    };

    return reasoningMap[symbol]?.[article.category] || 
           `${article.category} developments for ${symbol} could impact near-term performance based on market reaction patterns.`;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const articleTime = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - articleTime.getTime()) / 60000);
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <>
      <Card className={cn("bg-white/90 backdrop-blur-sm border-0 shadow-lg", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Market Intelligence
            <Badge variant="outline" className="ml-auto text-xs">
              {relevantArticles.length} relevant
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            AI-powered news monitoring for your portfolio
          </p>
        </CardHeader>

        <CardContent>
          {relevantArticles.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {relevantArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(article.sentiment)}
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getUrgencyColor(article.urgency))}
                        >
                          {article.urgency} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(article.timestamp)}
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {article.headline}
                    </h4>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{article.source}</span>
                        <div className="flex gap-1">
                          {article.relevantSymbols.slice(0, 3).map(symbol => (
                            <Badge key={symbol} variant="secondary" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                          {article.relevantSymbols.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{article.relevantSymbols.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(article.url, '_blank')}
                          className="h-7 px-2 text-xs"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAnalyzeImpact(article)}
                          className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          How does this affect my portfolio?
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <h4 className="font-medium">No relevant news found</h4>
                <p className="text-sm">
                  {queue.length === 0 
                    ? "Add stocks to your queue to see relevant market intelligence."
                    : "We're monitoring the markets for news about your queued stocks."
                  }
                </p>
              </div>
              {queue.length === 0 && (
                <Button
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mt-3"
                >
                  Browse Stocks
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Impact Analysis Dialog */}
      <Dialog open={showImpactAnalysis} onOpenChange={setShowImpactAnalysis}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Portfolio Impact Analysis
            </DialogTitle>
            <DialogDescription>
              AI analysis of how this news affects your queued stocks
            </DialogDescription>
          </DialogHeader>

          {selectedArticle && (
            <div className="space-y-4">
              {/* Article Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedArticle.headline}
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedArticle.summary}
                </p>
              </div>

              {/* Impact Analysis */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900">Impact on Your Positions:</h5>
                {currentAnalysis.map((analysis) => (
                  <div
                    key={analysis.symbol}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {analysis.symbol}
                        </Badge>
                        <Badge
                          variant={analysis.impact === "positive" ? "default" : "destructive"}
                          className={cn(
                            analysis.impact === "positive" && "bg-green-100 text-green-800",
                            analysis.impact === "negative" && "bg-red-100 text-red-800",
                            analysis.impact === "neutral" && "bg-gray-100 text-gray-800"
                          )}
                        >
                          {analysis.impact} impact
                        </Badge>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {analysis.confidence}% confidence
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                      {analysis.reasoning}
                    </p>

                    {analysis.priceTarget && (
                      <div className="bg-blue-50 rounded p-3 text-sm">
                        <div className="font-medium text-blue-900 mb-1">
                          Price Target Analysis
                        </div>
                        <div className="text-blue-700">
                          Current: ${analysis.priceTarget.current} → 
                          Target: ${analysis.priceTarget.target} 
                          ({analysis.priceTarget.timeframe})
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowImpactAnalysis(false)}
                  className="flex-1"
                >
                  Continue Monitoring
                </Button>
                <Button
                  onClick={() => {
                    setShowImpactAnalysis(false);
                    navigate('/queue/review');
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Review Queue
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
