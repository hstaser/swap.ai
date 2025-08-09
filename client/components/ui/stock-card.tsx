import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StockChart } from "./stock-chart";
import { InteractiveChart } from "./interactive-chart";
import { CommunitySentiment } from "./community-sentiment";
import { WatchlistNoteModal } from "./watchlist-note-modal";
import { StockShareModal } from "./stock-share-modal";
import { FriendDashboardShare } from "./friend-dashboard-share";
import { PinnedStockNotification, getPinnedStockInfo } from "./pinned-stock-notification";
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
  Share2,
  Users,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { getStock, validateStock } from "@/data/stocks.catalog";

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
  onAddToWatchlistWithNote?: (
    symbol: string,
    note: string,
    priority: "low" | "medium" | "high",
  ) => void;
  isInWatchlist: boolean;
  className?: string;
  onSkip?: () => void;
}

export function StockCard({
  stock,
  onToggleWatchlist,
  onAddToWatchlistWithNote,
  isInWatchlist,
  className,
  onSkip,
}: StockCardProps) {
  // Validate stock against catalog before rendering
  const catalogStock = getStock(stock.symbol);
  const validation = validateStock(stock.symbol);

  // If stock is not in catalog, don't render the card
  if (!validation.isValid || !catalogStock) {
    console.warn(`Stock ${stock.symbol} not found in catalog, hiding card`);
    return null;
  }

  // Use canonical stock data from catalog
  const canonicalStock = catalogStock;

  const isPositive = canonicalStock.change >= 0;
  const [showChart, setShowChart] = useState(false);
  const [showInteractiveChart, setShowInteractiveChart] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFriendShare, setShowFriendShare] = useState(false);
  const navigate = useNavigate();

  // Check if this stock is pinned by friends
  const pinnedInfo = getPinnedStockInfo(canonicalStock.symbol);

  return (
    <Card
      className={cn(
        "border-0 bg-white/90 backdrop-blur-sm shadow-lg",
        className,
      )}
    >
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Pinned Stock Notification */}
        {pinnedInfo && (
          <PinnedStockNotification
            symbol={canonicalStock.symbol}
            stockName={canonicalStock.name}
            pinnedBy={pinnedInfo.pinnedBy}
            pinnedByAvatar={pinnedInfo.pinnedByAvatar}
            pinnedAt={pinnedInfo.pinnedAt}
            initialNote={pinnedInfo.note}
          />
        )}

        {/* Header */}
        <div className="relative text-center space-y-3">
          {/* Share Button - Top Right */}
          <div className="absolute top-0 right-0 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Download features documentation
                const element = document.createElement('a');
                element.href = '/FEATURES_DOCUMENTATION.md';
                element.download = 'Swipr_Features_Documentation.md';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="h-6 w-6 text-muted-foreground hover:text-green-600"
              title="Download Features Documentation"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShareModal(true)}
              className="h-6 w-6 text-muted-foreground hover:text-blue-600"
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <h3 className="font-bold text-foreground text-4xl">
              {canonicalStock.symbol}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {canonicalStock.sector}
              </Badge>
              {canonicalStock.risk && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2 py-0.5",
                    canonicalStock.risk === "Low" &&
                      "bg-green-100 text-green-800 border-green-300",
                    canonicalStock.risk === "Medium" &&
                      "bg-yellow-100 text-yellow-800 border-yellow-300",
                    canonicalStock.risk === "High" &&
                      "bg-red-100 text-red-800 border-red-300",
                  )}
                >
                  {canonicalStock.risk} Risk
                </Badge>
              )}
            </div>
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            {canonicalStock.name}
          </p>

          {/* Earnings Alert - Moved below name */}
          {canonicalStock.earningsDate && (
            <div className="flex items-center justify-center gap-1 text-yellow-600">
              <AlertCircle className="h-3 w-3 animate-pulse" />
              <span className="text-xs font-medium">
                Earnings: {canonicalStock.earningsDate}
              </span>
            </div>
          )}
        </div>

        {/* Price and Change */}
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-foreground">
            ${canonicalStock.price?.toFixed(2) ?? "0.00"}
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
              {canonicalStock.change?.toFixed(2) ?? "0.00"} ({isPositive ? "+" : ""}
              {canonicalStock.changePercent?.toFixed(2) ?? "0.00"}%)
            </span>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Today
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="font-bold text-lg">{canonicalStock.marketCap}</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">Div Yield</div>
              <div className="font-bold text-lg">
                {canonicalStock.dividendYield
                  ? `${canonicalStock.dividendYield?.toFixed(2) ?? "0.00"}%`
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
                onClick={() => setShowInteractiveChart(true)}
                className="h-6 px-2 text-xs"
              >
                Chart
              </Button>
            </div>
            <div className="flex gap-2">
              {[
                { label: "1M", value: canonicalStock.returns?.oneMonth || 2.4 },
                { label: "6M", value: canonicalStock.returns?.sixMonth || 8.7 },
                { label: "1Y", value: canonicalStock.returns?.oneYear || 15.3 },
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
              {canonicalStock.newsSummary}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/stock/${canonicalStock.symbol}/news`)}
              className="h-6 px-2 text-xs text-blue-600"
            >
              See More
            </Button>
          </div>
        </div>

        <Separator />

        {/* Community Sentiment */}
        <CommunitySentiment symbol={canonicalStock.symbol} />

        {/* Chart Modal */}
        {showChart && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <StockChart
              symbol={canonicalStock.symbol}
              onClose={() => setShowChart(false)}
            />
          </div>
        )}

        {/* Interactive Chart Modal */}
        {showInteractiveChart && (
          <InteractiveChart
            symbol={canonicalStock.symbol}
            onClose={() => setShowInteractiveChart(false)}
          />
        )}

        {/* Watchlist Note Modal */}
        <WatchlistNoteModal
          isOpen={showNoteModal}
          stock={stock}
          onClose={() => setShowNoteModal(false)}
          onSave={(symbol, note) => {
            if (onAddToWatchlistWithNote) {
              onAddToWatchlistWithNote(symbol, note);
            } else {
              onToggleWatchlist(symbol);
            }
            // Auto-advance to next stock after adding to watchlist
            if (onSkip) {
              setTimeout(() => onSkip(), 200);
            }
          }}
        />

        {/* Stock Share Modal */}
        <StockShareModal
          isOpen={showShareModal}
          stock={stock}
          onClose={() => setShowShareModal(false)}
          onShareInternal={(friendIds, message) => {
            console.log("Sharing with friends:", friendIds, message);
            // Navigate to swipe view with this stock
            navigate(`/?symbol=${canonicalStock.symbol}`);
          }}
          onShareExternal={(platform, message) => {
            console.log("External share:", platform, message);
            if (platform === "copy") {
              navigator.clipboard.writeText(
                `Check out ${canonicalStock.symbol} on swipr.ai - ${message}`,
              );
            } else {
              // Open social media sharing
              const url = `https://swipr.ai/stock/${canonicalStock.symbol}`;
              const text = encodeURIComponent(message);
              if (platform === "twitter") {
                window.open(
                  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                );
              } else if (platform === "linkedin") {
                window.open(
                  `https://linkedin.com/sharing/share-offsite/?url=${url}`,
                );
              }
            }
          }}
        />

        {/* Friend Dashboard Share Modal */}
        <FriendDashboardShare
          symbol={canonicalStock.symbol}
          stockName={canonicalStock.name}
          price={canonicalStock.price}
          change={canonicalStock.change}
          changePercent={canonicalStock.changePercent}
          isOpen={showFriendShare}
          onClose={() => setShowFriendShare(false)}
          onShare={(friendIds, message) => {
            console.log("Pinned to friends:", friendIds, "Message:", message);
            // In real app, would send API request to pin stock to friends' dashboards
          }}
        />

        <Separator />

        {/* Friend Sharing */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowFriendShare(true)}
            className="w-full h-12 text-sm font-medium border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Users className="h-4 w-4 mr-2" />
            Pin to Friend's Dashboard
          </Button>
        </div>

        <Separator />

        {/* AI Assistance Button with subtle suggestions */}
        <div className="text-center space-y-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/research?symbol=${canonicalStock.symbol}`)}
            className="w-full h-12 sm:h-14 text-sm sm:text-base font-medium border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              Need help? Ask AI about {canonicalStock.symbol}
            </span>
            <span className="sm:hidden">Ask AI about {canonicalStock.symbol}</span>
          </Button>

          {/* Subtle contextual suggestions */}
          {canonicalStock.symbol === "AAPL" && canonicalStock.risk === "High" && (
            <p className="text-xs text-muted-foreground italic">
              This is high-beta. AI can suggest defensive pairs
            </p>
          )}

          {canonicalStock.changePercent > 5 && (
            <p className="text-xs text-muted-foreground italic">
              Big mover today. AI can explain why & show related plays
            </p>
          )}
        </div>

        <Separator />

        {/* Add to Queue Button */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate(`/queue/add/${canonicalStock.symbol}`)}
            className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Queue
          </Button>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                if (isInWatchlist) {
                  onToggleWatchlist(stock.symbol);
                } else {
                  setShowNoteModal(true);
                }
              }}
              className="h-12 text-xs sm:text-sm font-medium text-muted-foreground"
            >
              {isInWatchlist ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Remove</span>
                  <span className="sm:hidden">Remove</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Save for Later</span>
                  <span className="sm:hidden">Save for Later</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => onSkip && onSkip()}
              className="h-12 text-xs sm:text-sm font-medium text-muted-foreground hover:text-orange-600"
            >
              <span className="hidden sm:inline">Skip</span>
              <span className="sm:hidden">Skip</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
