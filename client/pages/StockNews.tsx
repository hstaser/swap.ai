import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown,
  Share,
  Bookmark,
  Filter,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author: string;
  publishedAt: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
  impact: "high" | "medium" | "low";
  category: "earnings" | "product" | "regulation" | "market" | "analyst";
  imageUrl?: string;
}

interface StockNewsData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  articles: NewsArticle[];
}

const mockNewsData: { [key: string]: StockNewsData } = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 182.52,
    change: 2.31,
    changePercent: 1.28,
    articles: [
      {
        id: "1",
        title: "Apple's iPhone 15 Pro Titanium Design Drives Strong Q4 Sales",
        summary:
          "Apple reports better-than-expected iPhone sales as premium titanium design attracts consumers despite higher pricing.",
        content:
          "Apple Inc. has exceeded market expectations with its Q4 iPhone sales, largely driven by the premium iPhone 15 Pro models featuring titanium construction. The new design, while commanding higher prices, has resonated strongly with consumers seeking premium build quality and durability. Analysts note that the titanium models are showing higher attach rates for accessories and services, contributing to Apple's growing services revenue. The company's supply chain has also adapted well to the new materials, with production meeting demand despite initial concerns about titanium sourcing.",
        source: "Bloomberg",
        author: "Sarah Chen",
        publishedAt: "2024-01-15T14:30:00Z",
        url: "https://bloomberg.com/apple-iphone-15-titanium",
        sentiment: "positive",
        impact: "high",
        category: "product",
      },
      {
        id: "2",
        title: "Apple Services Revenue Reaches New Heights with AI Integration",
        summary:
          "The tech giant's services division continues robust growth as AI features drive user engagement across platforms.",
        content:
          "Apple's Services division has posted record quarterly revenue, fueled by increased user engagement driven by new AI-powered features across iOS and macOS. The company's strategic integration of machine learning capabilities into core services like Siri, Apple Music, and the App Store has resulted in higher user retention and increased spending per user. Apple's approach to on-device AI processing has also differentiated it from competitors, addressing privacy concerns while delivering personalized experiences.",
        source: "TechCrunch",
        author: "Maria Rodriguez",
        publishedAt: "2024-01-14T09:15:00Z",
        url: "https://techcrunch.com/apple-services-ai",
        sentiment: "positive",
        impact: "medium",
        category: "earnings",
      },
      {
        id: "3",
        title:
          "Morgan Stanley Raises Apple Price Target to $200 on AI Momentum",
        summary:
          "Wall Street analysts increasingly bullish on Apple's AI strategy and potential revenue impact from new features.",
        content:
          "Morgan Stanley has raised its price target for Apple shares to $200, citing the company's strong positioning in the AI race and potential for new revenue streams. The investment bank's analysts believe Apple's privacy-focused approach to AI will become a key differentiator, particularly in enterprise markets. They project that AI-enhanced features could drive a new iPhone upgrade cycle and increase services attachment rates significantly over the next 18 months.",
        source: "MarketWatch",
        author: "David Kim",
        publishedAt: "2024-01-13T16:45:00Z",
        url: "https://marketwatch.com/morgan-stanley-apple",
        sentiment: "positive",
        impact: "medium",
        category: "analyst",
      },
      {
        id: "4",
        title: "EU Regulatory Scrutiny Intensifies Over App Store Policies",
        summary:
          "European regulators push for further App Store changes as competition concerns persist.",
        content:
          "The European Union is intensifying its scrutiny of Apple's App Store practices, with new investigations into the company's compliance with the Digital Markets Act. Regulators are particularly focused on Apple's implementation of alternative app stores and payment systems. While Apple has made some concessions, EU officials argue that the changes don't go far enough in promoting fair competition. This ongoing regulatory pressure could impact Apple's services revenue growth in the European market.",
        source: "Financial Times",
        author: "Emma Thompson",
        publishedAt: "2024-01-12T11:20:00Z",
        url: "https://ft.com/apple-eu-regulation",
        sentiment: "negative",
        impact: "medium",
        category: "regulation",
      },
    ],
  },
};

export default function StockNews() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");

  const stockData = symbol ? mockNewsData[symbol] : null;

  useEffect(() => {
    if (!stockData) {
      navigate("/");
    }
  }, [stockData, navigate]);

  if (!stockData) {
    return null;
  }

  const filteredArticles = stockData.articles.filter((article) => {
    const categoryMatch =
      selectedCategory === "all" || article.category === selectedCategory;
    const sentimentMatch =
      selectedSentiment === "all" || article.sentiment === selectedSentiment;
    return categoryMatch && sentimentMatch;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100";
      case "negative":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isPositive = stockData.change >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {stockData.symbol}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {stockData.name} • News & Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="font-bold">
                  ${stockData.currentPrice.toFixed(2)}
                </div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-success" : "text-destructive",
                  )}
                >
                  {isPositive ? "+" : ""}
                  {stockData.change.toFixed(2)} ({isPositive ? "+" : ""}
                  {stockData.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filter Controls */}
        <Card className="bg-white/90 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                {["earnings", "product", "analyst", "regulation", "market"].map(
                  (category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ),
                )}
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex gap-2">
                <Button
                  variant={selectedSentiment === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSentiment("all")}
                >
                  All Sentiment
                </Button>
                <Button
                  variant={
                    selectedSentiment === "positive" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedSentiment("positive")}
                  className="text-green-600"
                >
                  Positive
                </Button>
                <Button
                  variant={
                    selectedSentiment === "negative" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedSentiment("negative")}
                  className="text-red-600"
                >
                  Negative
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Articles */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Article Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold leading-tight mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={getSentimentColor(article.sentiment)}
                        >
                          {article.sentiment}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getImpactColor(article.impact)}
                        >
                          {article.impact} impact
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Article Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.publishedAt)}
                    </div>
                    <span>•</span>
                    <span className="font-medium">{article.source}</span>
                    <span>•</span>
                    <span>By {article.author}</span>
                  </div>

                  {/* Article Summary */}
                  <p className="text-muted-foreground leading-relaxed">
                    {article.summary}
                  </p>

                  {/* Article Content */}
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed">{article.content}</p>
                  </div>

                  {/* Article Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Full Article
                      </a>
                    </Button>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Related to {stockData.symbol}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more news articles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
