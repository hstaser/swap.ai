import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Upload,
  Link as LinkIcon,
  FileText,
  Sparkles,
  MessageCircle,
  X,
  CheckCircle,
  AlertTriangle,
  Target,
  Settings,
  Users,
  TrendingUp,
  Filter,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";
import { useLocation } from "react-router-dom";
import { CustomNewsSourceManager, type SourceBlock } from "./CustomNewsSourceManager";

// Mock portfolio data - in production this would come from a portfolio hook/store
const mockPortfolioStocks = [
  { symbol: "AAPL", name: "Apple Inc.", allocation: 28.5 },
  { symbol: "MSFT", name: "Microsoft Corporation", allocation: 24.1 },
  { symbol: "JNJ", name: "Johnson & Johnson", allocation: 15.3 },
  { symbol: "GOOGL", name: "Alphabet Inc.", allocation: 12.7 },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc.", allocation: 8.9 },
  { symbol: "V", name: "Visa Inc.", allocation: 6.2 },
  { symbol: "PG", name: "Procter & Gamble Co.", allocation: 4.3 }
];

interface ArticleUploadProps {
  onAnalyze?: (article: UploadedArticle) => void;
}

interface UploadedArticle {
  id: string;
  title: string;
  content: string;
  url?: string;
  uploadMethod: "file" | "url" | "text";
  timestamp: string;
}

export default function ArticleUpload({ onAnalyze }: ArticleUploadProps) {
  const { queue } = useQueue();
  const portfolio = mockPortfolioStocks; // Use portfolio instead of queue
  const location = useLocation();
  const prefilledArticle = location.state?.prefilledArticle;
  const [uploadMethod, setUploadMethod] = useState<"file" | "url" | "text" | "news">(prefilledArticle ? "text" : "url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState(prefilledArticle?.title || "");
  const [content, setContent] = useState(prefilledArticle?.content || "");
  const [selectedAnalysis, setSelectedAnalysis] = useState<"portfolio" | "specific" | string>("portfolio");
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [showStockSelector, setShowStockSelector] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<UploadedArticle | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showNewsSourceManager, setShowNewsSourceManager] = useState(false);
  const [sourceBlocks, setSourceBlocks] = useState<SourceBlock[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock news articles for drag and drop
  // Helper function to generate simulated content from source blocks
  const generateBlockContent = (block: SourceBlock) => {
    const contentTypes = [
      {
        title: `${block.name} Update: Market-Moving News Detected`,
        content: `Latest analysis from ${block.name} sources shows significant market developments. ${block.description}`,
        source: "Custom Block",
        time: "15m ago"
      },
      {
        title: `Breaking: Key Figures in ${block.name} Make Strategic Moves`,
        content: `Important updates from tracked sources in ${block.name}. This could impact your portfolio positions.`,
        source: "Tracked Sources",
        time: "1h ago"
      },
      {
        title: `${block.name} Intelligence: Weekly Summary`,
        content: `Compiled insights from ${block.figures.length} figures and ${block.sources.length} sources tracked in this block.`,
        source: "AI Summary",
        time: "2h ago"
      }
    ];
    return contentTypes.slice(0, 2); // Return first 2 items
  };

  const handleSourcesUpdate = (blocks: SourceBlock[]) => {
    setSourceBlocks(blocks);
  };

  const newsArticles = [
    {
      id: "news_1",
      headline: "Apple Reports Record Q4 Revenue Driven by iPhone 15 Sales",
      source: "Reuters",
      timestamp: "2h ago",
      category: "Earnings"
    },
    {
      id: "news_2",
      headline: "Tesla Faces Increased Competition in China EV Market",
      source: "Bloomberg",
      timestamp: "4h ago",
      category: "Market"
    },
    {
      id: "news_3",
      headline: "Microsoft Azure Revenue Grows 30% Amid AI Expansion",
      source: "CNBC",
      timestamp: "6h ago",
      category: "Earnings"
    },
    {
      id: "news_4",
      headline: "Fed Signals Potential Rate Cuts in 2024",
      source: "WSJ",
      timestamp: "8h ago",
      category: "Economic"
    },
    {
      id: "news_5",
      headline: "NVIDIA Partners with Major Automakers for AI Chips",
      source: "TechCrunch",
      timestamp: "10h ago",
      category: "Business"
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text.substring(0, 5000)); // Limit content length
        setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!title || (!url && !content)) return;

    setIsAnalyzing(true);

    const article: UploadedArticle = {
      id: `upload_${Date.now()}`,
      title,
      content: content || `Article from ${url}`,
      url: url || undefined,
      uploadMethod,
      timestamp: new Date().toISOString(),
    };

    // Simulate analysis delay
    setTimeout(() => {
      setCurrentArticle(article);
      setIsAnalyzing(false);
      setShowAnalysis(true);
      if (onAnalyze) {
        onAnalyze(article);
      }
    }, 2000);
  };

  const handleChatMessage = (message?: string) => {
    const userMessage = message || chatInput.trim();
    if (!userMessage) return;

    // Add user message
    const userMsg = {
      id: `user_${Date.now()}`,
      type: "user" as const,
      content: userMessage
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "";

      if (userMessage.toLowerCase().includes("aapl") || userMessage.toLowerCase().includes("apple")) {
        response = "Apple's 4.2% projected gain comes from strong iPhone 15 sales momentum and services revenue growth. The company's ecosystem continues to drive customer loyalty, and their move into AI capabilities positions them well for future growth.";
      } else if (userMessage.toLowerCase().includes("risk")) {
        response = "Main risks to consider: potential market volatility, interest rate changes affecting tech valuations, and competitive pressures in key markets. I'd recommend diversifying across sectors and monitoring earnings closely.";
      } else if (userMessage.toLowerCase().includes("buy") || userMessage.toLowerCase().includes("more")) {
        response = "I can't provide specific investment advice, but the analysis shows positive momentum. Consider your risk tolerance, current allocation, and investment timeline. Dollar-cost averaging could be a good strategy if you're bullish long-term.";
      } else if (userMessage.toLowerCase().includes("expand")) {
        response = "The tech sector's momentum is driven by AI adoption, cloud growth, and strong consumer demand. Microsoft's Azure gains reflect enterprise digital transformation, while NVIDIA benefits from the AI chip boom. This creates a positive feedback loop across your portfolio.";
      } else {
        response = "That's a great question! Based on the analysis, the overall market sentiment is positive due to strong fundamentals and growth momentum in the tech sector. The key factors driving this include consumer demand, enterprise spending, and technological innovation.";
      }

      const aiMsg = {
        id: `ai_${Date.now()}`,
        type: "assistant" as const,
        content: response
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1500);
  };

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setContent("");
    setShowSuccess(false);
    setCurrentArticle(null);
    setChatMessages([]);
    setChatInput("");
  };

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload Article for Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload news articles, reports, or analysis to understand their impact on your portfolio
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Upload Method Selector */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={uploadMethod === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("url")}
              className="flex-1"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              URL
            </Button>
            <Button
              variant={uploadMethod === "file" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("file")}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              File
            </Button>
            <Button
              variant={uploadMethod === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("text")}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button
              variant={uploadMethod === "news" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("news")}
              className="flex-1 relative"
            >
              <Upload className="h-4 w-4 mr-2" />
              From News
              {sourceBlocks.filter(b => b.isActive).length > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-green-500 text-white"
                >
                  {sourceBlocks.filter(b => b.isActive).length}
                </Badge>
              )}
            </Button>
          </div>

          {/* URL Input */}
          {uploadMethod === "url" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Article URL
                </label>
                <Input
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Article Title (Optional)
                </label>
                <Input
                  placeholder="Enter article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === "file" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              {title && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    File Preview
                  </label>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <strong>{title}</strong>
                    <p className="text-gray-600 mt-1 line-clamp-3">
                      {content.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Input */}
          {uploadMethod === "text" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Article Title
                </label>
                <Input
                  placeholder="Enter article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Article Content
                </label>
                <Textarea
                  placeholder="Paste article content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[120px]"
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length}/5000 characters
                </p>
              </div>
            </div>
          )}

          {/* Enhanced News Sources Section for "From News" method */}
          {uploadMethod === "news" && (
            <div className="space-y-4">
              {/* News Source Tabs */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Choose News Source
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewsSourceManager(true)}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Manage Sources
                </Button>
              </div>

              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant="default"
                  size="sm"
                  disabled
                  className="flex-1 text-xs"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Curated News
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewsSourceManager(true)}
                  className="flex-1 text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Custom Sources
                </Button>
              </div>

              {/* Curated News Tab */}
              <div className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                <p className="text-xs text-gray-600 mb-3">
                  Click on any article below to analyze its impact on your portfolio:
                </p>
                <div className="space-y-2">
                  {newsArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => {
                        setTitle(article.headline);
                        setContent(`News article from ${article.source}: ${article.headline}`);
                        setSelectedArticleId(article.id);
                      }}
                      className={cn(
                        "p-3 rounded border cursor-pointer transition-colors",
                        selectedArticleId === article.id
                          ? "bg-blue-100 border-blue-300"
                          : "bg-white hover:bg-blue-50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {article.headline}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{article.source}</span>
                            <span>•</span>
                            <span>{article.timestamp}</span>
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs px-2">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analysis Target Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">
              What would you like to analyze?
            </label>
            <Select
              value={selectedAnalysis}
              onValueChange={(value) => {
                setSelectedAnalysis(value);
                if (value === "specific") {
                  setShowStockSelector(true);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose analysis target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portfolio">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span>Entire Portfolio ({portfolio.length} stocks)</span>
                  </div>
                </SelectItem>
                <SelectItem value="specific">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Select Specific Stocks</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {selectedAnalysis === "portfolio" ? (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Portfolio Analysis
                  </span>
                </div>
                <p className="text-xs text-blue-700 mb-2">
                  Will analyze impact across your entire portfolio of {portfolio.length} stocks:
                </p>
                <div className="flex flex-wrap gap-1">
                  {portfolio.slice(0, 8).map((stock) => (
                    <Badge key={stock.symbol} variant="secondary" className="text-xs">
                      {stock.symbol}
                    </Badge>
                  ))}
                  {portfolio.length > 8 && (
                    <Badge variant="secondary" className="text-xs">
                      +{portfolio.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            ) : selectedAnalysis === "specific" ? (
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Selected Stocks Analysis
                  </span>
                </div>
                <p className="text-xs text-purple-700 mb-2">
                  {selectedStocks.length > 0
                    ? `Will analyze impact on ${selectedStocks.length} selected stocks:`
                    : "Click 'Select Specific Stocks' to choose which stocks to analyze"
                  }
                </p>
                {selectedStocks.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedStocks.map((symbol) => (
                      <Badge key={symbol} variant="secondary" className="text-xs">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStockSelector(true)}
                  className="mt-2 text-xs"
                >
                  {selectedStocks.length > 0 ? "Change Selection" : "Select Stocks"}
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-green-900">
                    Single Stock Analysis
                  </span>
                </div>
                <p className="text-xs text-green-700">
                  Will analyze impact specifically on <Badge variant="secondary" className="text-xs mx-1">{selectedAnalysis}</Badge>
                </p>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !title || (!url && !content) || (selectedAnalysis === "specific" && selectedStocks.length === 0)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Impact...
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                {selectedAnalysis === "portfolio"
                  ? `Analyze Portfolio Impact (${portfolio.length} stocks)`
                  : selectedAnalysis === "specific"
                  ? `Analyze Selected Stocks (${selectedStocks.length})`
                  : `Analyze ${selectedAnalysis} Impact`
                }
              </>
            )}
          </Button>

          {/* Mock Analysis Results */}
          {showAnalysis && currentArticle && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Analysis Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Friendly Prose Introduction */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Great choice on this article! I've analyzed how <strong>"{currentArticle.title}"</strong> could impact your portfolio.
                    The news looks quite promising for your tech-heavy holdings, especially with the current market momentum we're seeing.
                    Here's what I found that might interest you as an investor.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    📊 Portfolio Impact Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Overall Sentiment:</span>
                      <div className="font-medium text-green-600">Positive (+2.3%)</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <div className="font-medium text-blue-600">Moderate</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    📈 Top Stock Impacts
                  </h4>
                  <div className="space-y-2">
                    {[
                      { symbol: "AAPL", impact: "+4.2%", reason: "iPhone sales surge drives revenue growth" },
                      { symbol: "MSFT", impact: "+2.8%", reason: "Azure expansion boosts cloud revenue" },
                      { symbol: "NVDA", impact: "+3.1%", reason: "AI chip demand continues accelerating" },
                    ].map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{stock.symbol}</Badge>
                          <span className="text-gray-600">{stock.reason}</span>
                        </div>
                        <span className="font-medium text-green-600">{stock.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🎯 Key Insights
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Technology sector shows strong momentum (+3.2% avg)</li>
                    <li>• Consumer spending patterns remain robust</li>
                    <li>• Interest rate environment favors growth stocks</li>
                    <li>• Recommend monitoring Q1 earnings for confirmation</li>
                  </ul>
                </div>

                {/* Conversational Interface */}
                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      Ask me anything about this analysis
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Try: "Why is AAPL expected to gain 4.2%?" or "What are the risks I should consider?"
                    </p>
                  </div>

                  {/* Chat Messages */}
                  {chatMessages.length > 0 && (
                    <div className="max-h-48 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={cn(
                          "flex gap-3",
                          message.type === "user" ? "justify-end" : "justify-start"
                        )}>
                          {message.type === "assistant" && (
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageCircle className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className={cn(
                            "rounded-lg px-3 py-2 max-w-xs text-sm",
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          )}>
                            {message.content}
                          </div>
                          {message.type === "user" && (
                            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-white font-medium">U</span>
                            </div>
                          )}
                        </div>
                      ))}

                      {isThinking && (
                        <div className="flex gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about the analysis..."
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !isThinking && chatInput.trim()) {
                            handleChatMessage();
                          }
                        }}
                        disabled={isThinking}
                      />
                      <Button
                        onClick={handleChatMessage}
                        disabled={!chatInput.trim() || isThinking}
                        size="sm"
                        className="px-3"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quick Questions */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        "Why is AAPL up 4.2%?",
                        "What are the risks?",
                        "Should I buy more?",
                        "Expand on this analysis"
                      ].map((question) => (
                        <Button
                          key={question}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setChatInput(question);
                            handleChatMessage(question);
                          }}
                          disabled={isThinking}
                          className="text-xs h-7"
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAnalysis(false);
                      setChatMessages([]);
                      setChatInput("");
                    }}
                    className="flex-1"
                  >
                    Close Analysis
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAnalysis(false);
                      setChatMessages([]);
                      setChatInput("");
                      // Reset for new analysis
                      setTitle("");
                      setContent("");
                      setSelectedArticleId(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Analyze Another Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Analysis Complete!
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Your article has been analyzed for portfolio impact
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {currentArticle && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-1">
                  {currentArticle.title}
                </h4>
                <p className="text-xs text-gray-600">
                  Uploaded via {currentArticle.uploadMethod}
                </p>
              </div>

              <div className="bg-blue-50 rounded p-3 text-sm border border-blue-200">
                <div className="font-medium text-blue-900 mb-1">
                  AI Analysis Results
                </div>
                <div className="text-blue-700">
                  {selectedAnalysis === "portfolio"
                    ? `Portfolio-wide impact analysis completed for ${queue.length} stocks.`
                    : selectedAnalysis === "specific"
                    ? `Specific impact analysis completed for ${selectedStocks.length} selected stocks.`
                    : `Specific impact analysis completed for ${selectedAnalysis}.`
                  }
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Upload Another
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccess(false);
                    resetForm();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  View Analysis
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stock Selector Modal */}
      <Dialog open={showStockSelector} onOpenChange={setShowStockSelector}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Select Stocks to Analyze
            </DialogTitle>
            <DialogDescription>
              Choose which stocks from your portfolio to analyze
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedStocks.length} of {portfolio.length} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStocks([])}
                  className="text-xs"
                >
                  Clear All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStocks(portfolio.map(s => s.symbol))}
                  className="text-xs"
                >
                  Select All
                </Button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {portfolio.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    id={`stock-${stock.symbol}`}
                    checked={selectedStocks.includes(stock.symbol)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStocks([...selectedStocks, stock.symbol]);
                      } else {
                        setSelectedStocks(selectedStocks.filter(s => s !== stock.symbol));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label
                    htmlFor={`stock-${stock.symbol}`}
                    className="flex-1 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {stock.symbol}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowStockSelector(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowStockSelector(false);
                  if (selectedStocks.length === 0) {
                    setSelectedAnalysis("portfolio");
                  }
                }}
                disabled={selectedStocks.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Analyze {selectedStocks.length} Stocks
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom News Source Manager Modal */}
      <CustomNewsSourceManager
        isOpen={showNewsSourceManager}
        onClose={() => setShowNewsSourceManager(false)}
        onSourcesUpdate={handleSourcesUpdate}
      />
    </>
  );
}
