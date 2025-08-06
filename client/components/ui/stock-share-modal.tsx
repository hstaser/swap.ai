import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Share2,
  Users,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Send,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

interface StockShareModalProps {
  isOpen: boolean;
  stock: Stock;
  onClose: () => void;
  onShareInternal: (friendIds: string[], message: string) => void;
  onShareExternal: (platform: string, message: string) => void;
}

export function StockShareModal({
  isOpen,
  stock,
  onClose,
  onShareInternal,
  onShareExternal,
}: StockShareModalProps) {
  const [shareMode, setShareMode] = useState<"internal" | "external">(
    "internal",
  );
  const [message, setMessage] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [friendSearch, setFriendSearch] = useState("");

  // Mock friends data - in real app this would come from API
  const mockFriends: Friend[] = [
    { id: "1", name: "Alex Johnson", username: "@alexj" },
    { id: "2", name: "Sarah Chen", username: "@sarahc" },
    { id: "3", name: "Mike Rodriguez", username: "@miker" },
    { id: "4", name: "Emma Wilson", username: "@emmaw" },
    { id: "5", name: "David Kim", username: "@davidk" },
  ];

  const filteredFriends = mockFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(friendSearch.toLowerCase()) ||
      friend.username.toLowerCase().includes(friendSearch.toLowerCase()),
  );

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const handleInternalShare = () => {
    onShareInternal(selectedFriends, message);
    onClose();
  };

  const handleExternalShare = (platform: string) => {
    const shareMessage =
      message ||
      `Check out ${stock.symbol} - ${stock.name} at $${stock.price.toFixed(2)}`;
    onShareExternal(platform, shareMessage);
  };

  const generateShareText = () => {
    const isPositive = stock.change >= 0;
    return `${stock.symbol} - ${stock.name}\n$${stock.price.toFixed(2)} (${isPositive ? "+" : ""}${stock.changePercent.toFixed(2)}%)\n\n${message || "Interesting stock to watch!"}`;
  };

  if (!isOpen) return null;

  const isPositive = stock.change >= 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              Share Stock
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stock Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{stock.symbol}</div>
                <div className="text-sm text-gray-600">{stock.name}</div>
                <div className="text-xs text-gray-500 mt-1">{stock.sector}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">
                  ${stock.price.toFixed(2)}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    isPositive ? "text-green-600" : "text-red-600",
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Mode Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={shareMode === "internal" ? "default" : "ghost"}
              onClick={() => setShareMode("internal")}
              className="flex-1 text-sm"
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Friends
            </Button>
            <Button
              variant={shareMode === "external" ? "default" : "ghost"}
              onClick={() => setShareMode("external")}
              className="flex-1 text-sm"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Social Media
            </Button>
          </div>

          {/* Message Input */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium mb-2 block">
              Add a message <span className="text-gray-400">(Optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder={
                shareMode === "internal"
                  ? "What do you think about this stock? Any insights to share?"
                  : "Why are you sharing this stock?"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={280}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {message.length}/280 characters
            </div>
          </div>

          {shareMode === "internal" ? (
            // Internal Sharing - Friends
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Select Friends
                </Label>

                {/* Friend Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search friends..."
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Friends List */}
                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                        selectedFriends.includes(friend.id)
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50",
                      )}
                      onClick={() => toggleFriend(friend.id)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {friend.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{friend.name}</div>
                        <div className="text-xs text-gray-500">
                          {friend.username}
                        </div>
                      </div>
                      {selectedFriends.includes(friend.id) && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedFriends.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-2">
                      {selectedFriends.length} friend(s) selected
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleInternalShare}
                disabled={selectedFriends.length === 0}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Friends ({selectedFriends.length})
              </Button>
            </div>
          ) : (
            // External Sharing - Social Media
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Share on Social Media
                </Label>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => handleExternalShare("twitter")}
                    className="w-full justify-start"
                  >
                    <Twitter className="h-4 w-4 mr-3 text-blue-500" />
                    Share on Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExternalShare("linkedin")}
                    className="w-full justify-start"
                  >
                    <Linkedin className="h-4 w-4 mr-3 text-blue-700" />
                    Share on LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExternalShare("copy")}
                    className="w-full justify-start"
                  >
                    <Copy className="h-4 w-4 mr-3 text-gray-600" />
                    Copy Link
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs font-medium text-blue-800 mb-2">
                  Preview:
                </div>
                <div className="text-sm text-blue-700 whitespace-pre-line">
                  {generateShareText()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
