import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StockChart } from "./stock-chart";
import { CommunitySentiment } from "./community-sentiment";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
  AlertCircle,
  MessageCircle,
  X,
  Heart,
  BarChart3,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  summary: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  pe: number | null;
  dividendYield: number | null;
  sector: string;
  isGainer: boolean;
  news: NewsItem[];
  newsSummary: string;
  returns?: {
    oneMonth: number;
    sixMonth: number;
    oneYear: number;
  };
  earningsDate?: string;
  risk?: "Low" | "Medium" | "High";
}

interface StockCardProps {
  stock: Stock;
  onToggleWatchlist: (symbol: string) => void;
  isInWatchlist: boolean;
  className?: string;
  onSkip?: () => void;
}

export function StockCard({
  stock,
  onToggleWatchlist,
  isInWatchlist,
  className,
  onSkip,
}: StockCardProps) {
  const isPositive = stock.change >= 0;
  const [showChart, setShowChart] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  
  // Swipe handling
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX.current;
    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(dragX) > threshold) {
      if (dragX > 0) {
        // Swiped right - add to watchlist
        if (!isInWatchlist) {
          onToggleWatchlist(stock.symbol);
        }
      } else {
        // Swiped left - skip
        onSkip?.();
      }
    }
    
    setDragX(0);
  };

  return (
    <div className="relative">
      {/* Swipe Indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none z-0">
        <div 
          className={cn(
            "w-16 h-16 bg-green-500 rounded-full flex items-center justify-center transition-all duration-200",
            dragX > 50 ? "scale-110 opacity-100" : "scale-90 opacity-50"
          )}
        >
          <Heart className="h-8 w-8 text-white fill-current" />
        </div>
        <div 
          className={cn(
            "w-16 h-16 bg-red-500 rounded-full flex items-center justify-center transition-all duration-200",
            dragX < -50 ? "scale-110 opacity-100" : "scale-90 opacity-50"
          )}
        >
          <X className="h-8 w-8 text-white" />
        </div>
      </div>

      <Card
        ref={cardRef}
        className={cn(
          "border-0 bg-white shadow-2xl relative z-10 touch-manipulation swipe-card mobile-optimized",
          isDragging && "transition-none",
          className,
        )}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX * 0.1}deg)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            {/* Earnings Alert */}
            {stock.earningsDate && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Earnings: {stock.earningsDate}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-5xl tracking-tight">
                {stock.symbol}
              </h3>
              <p className="text-lg text-gray-600 font-medium leading-tight">
                {stock.name}
              </p>
              
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 border-blue-200"
                >
                  {stock.sector}
                </Badge>
                {stock.risk && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-sm px-3 py-1 rounded-full",
                      stock.risk === "Low" &&
                        "bg-green-50 text-green-700 border-green-200",
                      stock.risk === "Medium" &&
                        "bg-yellow-50 text-yellow-700 border-yellow-200",
                      stock.risk === "High" &&
                        "bg-red-50 text-red-700 border-red-200",
                    )}
                  >
                    {stock.risk} Risk
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Price and Change */}
          <div className="text-center space-y-3">
            <div className="text-6xl font-bold text-gray-900">
              ${stock.price.toFixed(2)}
            </div>
            <div
              className={cn(
                "flex items-center justify-center gap-2 text-xl font-semibold",
                isPositive ? "text-green-600" : "text-red-600",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-6 w-6" />
              ) : (
                <TrendingDown className="h-6 w-6" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Market Cap</div>
              <div className="font-bold text-lg text-gray-900">{stock.marketCap}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">P/E Ratio</div>
              <div className="font-bold text-lg text-gray-900">
                {stock.pe ? stock.pe.toFixed(1) : "N/A"}
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Performance</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChart(true)}
                className="h-8 px-3 text-xs text-blue-600 hover:bg-blue-50 rounded-xl"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Chart
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "1M", value: stock.returns?.oneMonth || 2.4 },
                { label: "6M", value: stock.returns?.sixMonth || 8.7 },
                { label: "1Y", value: stock.returns?.oneYear || 15.3 },
              ].map((period) => (
                <div
                  key={period.label}
                  className="bg-gray-50 rounded-xl p-3 text-center"
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {period.label}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-bold",
                      period.value >= 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {period.value >= 0 ? "+" : ""}
                    {period.value.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Summary */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="text-sm font-medium text-blue-900 mb-2">Latest News</div>
            <div className="text-sm text-blue-800 leading-relaxed">
              {stock.newsSummary}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/stock/${stock.symbol}/news`)}
              className="h-8 px-3 mt-2 text-xs text-blue-600 hover:bg-blue-100 rounded-xl"
            >
              Read more →
            </Button>
          </div>

          {/* Expandable Details */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full h-10 text-sm text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              {isExpanded ? "Less details" : "More details"}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Volume</div>
                    <div className="text-sm font-semibold text-gray-900">{stock.volume}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Dividend</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : "N/A"}
                    </div>
                  </div>
                </div>

                <CommunitySentiment symbol={stock.symbol} />
              </div>
            )}
          </div>

          {/* Chart Modal */}
          {showChart && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <StockChart
                symbol={stock.symbol}
                onClose={() => setShowChart(false)}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <Button
              onClick={() => navigate(`/queue/add/${stock.symbol}`)}
              className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl touch-manipulation shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add to Portfolio Queue
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  onToggleWatchlist(stock.symbol);
                  if (!isInWatchlist && onSkip) {
                    setTimeout(() => onSkip(), 300);
                  }
                }}
                className={cn(
                  "h-12 text-sm font-medium rounded-2xl border-2 touch-manipulation",
                  isInWatchlist 
                    ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100" 
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                )}
              >
                {isInWatchlist ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onSkip && onSkip()}
                className="h-12 text-sm font-medium rounded-2xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50 touch-manipulation"
              >
                <X className="h-4 w-4 mr-2" />
                Pass
              </Button>
            </div>

            {/* AI Assistant */}
            <Button
              variant="ghost"
              onClick={() => navigate(`/research?symbol=${stock.symbol}`)}
              className="w-full h-12 text-sm text-blue-600 hover:bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 touch-manipulation"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask AI about {stock.symbol}
            </Button>
          </div>

          {/* Swipe Instructions */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              💡 Swipe right to save • Swipe left to pass
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
