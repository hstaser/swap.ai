import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageCircle,
  Heart,
  Share,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityFlag {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  sentiment: "bullish" | "bearish";
  reason: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  isFriend: boolean;
}

interface CommunitySentimentProps {
  symbol: string;
  className?: string;
}

const mockCommunityFlags: CommunityFlag[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Sarah M.",
    userAvatar: "",
    sentiment: "bullish",
    reason: "Love the AI momentum and strong earnings 🚀",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 12,
    isLiked: false,
    isFriend: true,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Mike R.",
    userAvatar: "",
    sentiment: "bullish",
    reason: "iPhone sales crushing it this quarter",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 8,
    isLiked: true,
    isFriend: true,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Alex K.",
    userAvatar: "",
    sentiment: "bearish",
    reason: "Overvalued at current prices, waiting for dip",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 3,
    isLiked: false,
    isFriend: false,
  },
];

export function CommunitySentiment({
  symbol,
  className,
}: CommunitySentimentProps) {
  const [flags, setFlags] = useState<CommunityFlag[]>(mockCommunityFlags);
  const [userSentiment, setUserSentiment] = useState<
    "bullish" | "bearish" | null
  >(null);
  const [reason, setReason] = useState("");
  const [showFlagForm, setShowFlagForm] = useState(false);

  const bullishCount = flags.filter((f) => f.sentiment === "bullish").length;
  const bearishCount = flags.filter((f) => f.sentiment === "bearish").length;
  const totalFlags = bullishCount + bearishCount;
  const bullishPercentage =
    totalFlags > 0 ? (bullishCount / totalFlags) * 100 : 50;

  const handleFlag = (sentiment: "bullish" | "bearish") => {
    if (!reason.trim()) return;

    const newFlag: CommunityFlag = {
      id: Date.now().toString(),
      userId: "currentUser",
      userName: "You",
      sentiment,
      reason,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isFriend: false,
    };

    setFlags([newFlag, ...flags]);
    setUserSentiment(sentiment);
    setReason("");
    setShowFlagForm(false);
  };

  const toggleLike = (flagId: string) => {
    setFlags(
      flags.map((flag) =>
        flag.id === flagId
          ? {
              ...flag,
              likes: flag.isLiked ? flag.likes - 1 : flag.likes + 1,
              isLiked: !flag.isLiked,
            }
          : flag,
      ),
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={cn("bg-white/90 backdrop-blur-sm border-0", className)}>
      <CardContent className="p-4 space-y-4">
        {/* Community Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Community Sentiment</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {totalFlags} flags
            </Badge>
          </div>

          {/* Sentiment Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                {bullishCount} Bullish
              </span>
              <span className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-red-600" />
                {bearishCount} Bearish
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                style={{ width: `${bullishPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Your Flag */}
        {!userSentiment && !showFlagForm && (
          <Button
            variant="outline"
            onClick={() => setShowFlagForm(true)}
            className="w-full h-10 text-sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Share your take
          </Button>
        )}

        {/* Flag Form */}
        {showFlagForm && (
          <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <textarea
              placeholder="Why are you bullish or bearish on this stock?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 text-sm border rounded-md resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleFlag("bullish")}
                disabled={!reason.trim()}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Bullish
              </Button>
              <Button
                onClick={() => handleFlag("bearish")}
                disabled={!reason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                size="sm"
              >
                <TrendingDown className="h-4 w-4 mr-1" />
                Bearish
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowFlagForm(false)}
              className="w-full text-xs"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Community Flags */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {flags.slice(0, 3).map((flag) => (
            <div key={flag.id} className="space-y-2">
              <div className="flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={flag.userAvatar} />
                  <AvatarFallback className="text-xs">
                    {flag.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{flag.userName}</span>
                    {flag.isFriend && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        Friend
                      </Badge>
                    )}
                    <Badge
                      variant={
                        flag.sentiment === "bullish" ? "default" : "destructive"
                      }
                      className={cn(
                        "text-xs px-1 py-0",
                        flag.sentiment === "bullish"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800",
                      )}
                    >
                      {flag.sentiment === "bullish" ? (
                        <TrendingUp className="h-2 w-2 mr-1" />
                      ) : (
                        <TrendingDown className="h-2 w-2 mr-1" />
                      )}
                      {flag.sentiment}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatTime(flag.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-tight">
                    {flag.reason}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => toggleLike(flag.id)}
                      className={cn(
                        "flex items-center gap-1 text-xs transition-colors",
                        flag.isLiked
                          ? "text-red-600"
                          : "text-muted-foreground hover:text-red-600",
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-3 w-3",
                          flag.isLiked && "fill-current",
                        )}
                      />
                      {flag.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 transition-colors">
                      <Share className="h-3 w-3" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {flags.length > 3 && (
          <Button variant="ghost" className="w-full text-xs" size="sm">
            View all {flags.length} community flags
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
