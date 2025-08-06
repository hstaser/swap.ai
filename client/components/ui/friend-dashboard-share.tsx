import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Share2,
  MessageCircle,
  CheckCircle,
  Send,
  Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

interface PinnedStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  pinnedBy: string;
  pinnedAt: Date;
  note?: string;
}

interface FriendDashboardShareProps {
  symbol: string;
  stockName: string;
  price: number;
  change: number;
  changePercent: number;
  isOpen: boolean;
  onClose: () => void;
  onShare: (friendIds: string[], message: string) => void;
}

// Mock friends data
const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Henry Staser",
    username: "@henry",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    isOnline: true,
  },
  {
    id: "2", 
    name: "Josh Martinez",
    username: "@josh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
    isOnline: true,
  },
  {
    id: "3",
    name: "Sarah Chen",
    username: "@sarah",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    isOnline: false,
  },
  {
    id: "4",
    name: "Mike Johnson",
    username: "@mike",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    isOnline: true,
  },
];

// Mock pinned stocks for dashboard
export const mockPinnedStocks: PinnedStock[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 138.45,
    change: 2.31,
    changePercent: 1.69,
    pinnedBy: "Josh",
    pinnedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    note: "AI boom continues - this could be huge!"
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 227.52,
    change: 1.87,
    changePercent: 0.83,
    pinnedBy: "Sarah",
    pinnedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    note: "Earnings next week - expecting strong iPhone sales"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.", 
    price: 422.12,
    change: -8.32,
    changePercent: -1.93,
    pinnedBy: "Mike",
    pinnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    note: "Dip might be a buying opportunity"
  },
];

export function FriendDashboardShare({
  symbol,
  stockName,
  price,
  change,
  changePercent,
  isOpen,
  onClose,
  onShare,
}: FriendDashboardShareProps) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [shareType, setShareType] = useState<"pin" | "message">("pin");
  const [isSharing, setIsSharing] = useState(false);

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleShare = async () => {
    if (selectedFriends.length === 0) return;

    setIsSharing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onShare(selectedFriends, message);
    setIsSharing(false);
    
    // Reset form
    setSelectedFriends([]);
    setMessage("");
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const isPositive = changePercent >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share with Friends
          </DialogTitle>
          <DialogDescription>
            Pin this stock to your friends' dashboards or send them a message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stock Info */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{symbol}</h3>
                  <p className="text-sm text-muted-foreground">{stockName}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(price)}</div>
                  <div className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}>
                    {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Share Type</label>
            <Select value={shareType} onValueChange={(value: "pin" | "message") => setShareType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pin">
                  <div className="flex items-center gap-2">
                    <Pin className="h-4 w-4" />
                    Pin to Dashboard
                  </div>
                </SelectItem>
                <SelectItem value="message">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {shareType === "pin" 
                ? "This stock will appear on your friends' dashboards with a \"pinged by you\" label"
                : "Send this stock as a message to your friends"
              }
            </p>
          </div>

          {/* Friend Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Friends</label>
            <div className="space-y-2">
              {mockFriends.map((friend) => (
                <div
                  key={friend.id}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                    selectedFriends.includes(friend.id)
                      ? "bg-blue-50 border-blue-300"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleFriendToggle(friend.id)}
                >
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {friend.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{friend.name}</div>
                    <div className="text-xs text-muted-foreground">{friend.username}</div>
                  </div>
                  {friend.isOnline && (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Online
                    </Badge>
                  )}
                  {selectedFriends.includes(friend.id) && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {shareType === "pin" ? "Note (Optional)" : "Message"}
            </label>
            <Textarea
              placeholder={
                shareType === "pin" 
                  ? "Add a note about why you're sharing this stock..."
                  : "Write a message to your friends..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={selectedFriends.length === 0 || isSharing}
            >
              {isSharing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {shareType === "pin" ? "Pin to Dashboard" : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Component to display pinned stocks on dashboard
export function PinnedStocksSection() {
  const [pinnedStocks] = useState<PinnedStock[]>(mockPinnedStocks);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (pinnedStocks.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Pin className="h-5 w-5" />
          Pinged by Friends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pinnedStocks.map((stock) => {
          const isPositive = stock.changePercent >= 0;
          return (
            <div
              key={`${stock.symbol}-${stock.pinnedBy}`}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{stock.symbol}</span>
                  <Badge variant="outline" className="text-xs text-purple-600">
                    from {stock.pinnedBy}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
                {stock.note && (
                  <div className="text-xs text-purple-700 mt-1 italic">
                    "{stock.note}"
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(stock.pinnedAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatCurrency(stock.price)}</div>
                <div className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
