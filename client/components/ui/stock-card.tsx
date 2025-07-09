import { useState } from "react";
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
  StickyNote,
  Edit3,
  Save,
  X,
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
}

interface StockCardProps {
  stock: Stock;
  onConfidenceSelect: (
    symbol: string,
    confidence: "not-interested" | "conservative" | "bullish" | "very-bullish",
  ) => void;
  onToggleWatchlist: (symbol: string) => void;
  onSaveNote: (symbol: string, note: string) => void;
  isInWatchlist: boolean;
  personalNote?: string;
  className?: string;
}

export function StockCard({
  stock,
  onConfidenceSelect,
  onToggleWatchlist,
  onSaveNote,
  isInWatchlist,
  personalNote = "",
  className,
}: StockCardProps) {
  const isPositive = stock.change >= 0;
  const [showChart, setShowChart] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(personalNote);
  const navigate = useNavigate();

  const handleSaveNote = () => {
    onSaveNote(stock.symbol, noteText);
    setIsEditingNote(false);
  };

  const handleCancelNote = () => {
    setNoteText(personalNote);
    setIsEditingNote(false);
  };

  return (
    <Card
      className={cn(
        "border-0 bg-white/90 backdrop-blur-sm shadow-lg",
        className,
      )}
    >
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

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="font-bold text-lg">{stock.marketCap}</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">Div Yield</div>
              <div className="font-bold text-lg">
                {stock.dividendYield
                  ? `${stock.dividendYield.toFixed(2)}%`
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Returns Section with Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Recent Returns
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChart(true)}
                className="h-6 px-2 text-xs"
              >
                Chart
              </Button>
            </div>
            <div className="flex gap-2">
              {[
                { label: "1M", value: stock.returns?.oneMonth || 2.4 },
                { label: "6M", value: stock.returns?.sixMonth || 8.7 },
                { label: "1Y", value: stock.returns?.oneYear || 15.3 },
              ].map((period) => (
                <div
                  key={period.label}
                  className="flex-1 p-2 bg-gray-50 rounded text-center"
                >
                  <div className="text-xs text-muted-foreground">
                    {period.label}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      period.value >= 0 ? "text-success" : "text-destructive",
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
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">News Summary</div>
            <div className="font-bold text-sm text-primary leading-tight">
              {stock.newsSummary}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/stock/${stock.symbol}/news`)}
              className="h-6 px-2 text-xs text-blue-600"
            >
              See More
            </Button>
          </div>

          {/* Earnings Date */}
          {stock.earningsDate && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm font-medium text-yellow-800">
                📅 Earnings: {stock.earningsDate}
              </div>
              <div className="text-xs text-yellow-600">
                Less than 2 weeks away
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Community Sentiment */}
        <CommunitySentiment symbol={stock.symbol} />

        <Separator />

        {/* Personal Notes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Personal Note</span>
            </div>
            {!isEditingNote && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNote(true)}
                className="h-6 px-2 text-xs"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                {personalNote ? "Edit" : "Add"}
              </Button>
            )}
          </div>

          {isEditingNote ? (
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add your thoughts about this stock..."
                className="w-full p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveNote}
                  size="sm"
                  className="flex-1 h-8"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelNote}
                  size="sm"
                  className="flex-1 h-8"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="min-h-[2rem] p-3 bg-gray-50 rounded-lg">
              {personalNote ? (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {personalNote}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No notes yet. Click 'Add' to jot down your thoughts.
                </p>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Confidence Level Buttons */}
        <div className="space-y-4">
          <h4 className="font-semibold text-center text-sm text-muted-foreground">
            Your Confidence Level
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onConfidenceSelect(stock.symbol, "not-interested")}
              className="h-12 text-sm font-semibold border-red-200 text-red-700 hover:bg-red-50"
            >
              Not Interested
            </Button>
            <Button
              variant="outline"
              onClick={() => onConfidenceSelect(stock.symbol, "conservative")}
              className="h-12 text-sm font-semibold border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              Conservative
            </Button>
            <Button
              variant="outline"
              onClick={() => onConfidenceSelect(stock.symbol, "bullish")}
              className="h-12 text-sm font-semibold border-green-200 text-green-700 hover:bg-green-50"
            >
              Bullish
            </Button>
            <Button
              variant="outline"
              onClick={() => onConfidenceSelect(stock.symbol, "very-bullish")}
              className="h-12 text-sm font-semibold border-green-300 text-green-800 hover:bg-green-100"
            >
              Very Bullish
            </Button>
          </div>

          {/* Watchlist Button */}
          <Button
            variant="ghost"
            onClick={() => onToggleWatchlist(stock.symbol)}
            className="w-full h-12 text-sm font-medium text-muted-foreground"
          >
            {isInWatchlist ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Remove from Watchlist
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Not sure? Add to Watchlist
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
