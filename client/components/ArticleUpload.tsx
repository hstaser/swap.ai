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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";

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
  const [uploadMethod, setUploadMethod] = useState<"file" | "url" | "text" | "news">("url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<"portfolio" | "specific" | string>("portfolio");
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [showStockSelector, setShowStockSelector] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<UploadedArticle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock news articles for drag and drop
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
      setShowSuccess(true);
      if (onAnalyze) {
        onAnalyze(article);
      }
    }, 2000);
  };

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setContent("");
    setShowSuccess(false);
    setCurrentArticle(null);
  };

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload Article for Analysis
            <Badge variant="outline" className="ml-auto text-xs">
              AI-Powered
            </Badge>
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
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              From News
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

          {/* News Articles Section for "From News" method */}
          {uploadMethod === "news" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">
                Select a News Article
              </label>
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
                        setUploadMethod("text"); // Switch to text mode after selection
                      }}
                      className="p-3 bg-white rounded border hover:bg-blue-50 cursor-pointer transition-colors"
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
                    <span>Entire Portfolio ({queue.length} stocks)</span>
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
                  Will analyze impact across your entire portfolio of {queue.length} queued stocks:
                </p>
                <div className="flex flex-wrap gap-1">
                  {queue.slice(0, 8).map((stock) => (
                    <Badge key={stock.symbol} variant="secondary" className="text-xs">
                      {stock.symbol}
                    </Badge>
                  ))}
                  {queue.length > 8 && (
                    <Badge variant="secondary" className="text-xs">
                      +{queue.length - 8} more
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
                  ? `Analyze Portfolio Impact (${queue.length} stocks)`
                  : selectedAnalysis === "specific"
                  ? `Analyze Selected Stocks (${selectedStocks.length})`
                  : `Analyze ${selectedAnalysis} Impact`
                }
              </>
            )}
          </Button>
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
                {selectedStocks.length} of {queue.length} selected
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
                  onClick={() => setSelectedStocks(queue.map(s => s.symbol))}
                  className="text-xs"
                >
                  Select All
                </Button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {queue.map((stock) => (
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
    </>
  );
}
