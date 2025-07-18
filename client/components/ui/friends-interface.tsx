import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  UserPlus,
  Search,
  MessageCircle,
  TrendingUp,
  Eye,
  Share2,
  Crown,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  watchlistPublic: boolean;
  watchlistCount: number;
  topWatchedStock: string;
  friendshipDate: Date;
  isFollowing: boolean;
  mutualFriends: number;
  recentActivity: string;
}

interface FriendsInterfaceProps {
  onSendMessage?: (friendId: string) => void;
  onViewWatchlist?: (friendId: string) => void;
  onShareStock?: (friendId: string) => void;
  className?: string;
}

const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Alex Chen",
    username: "alexc_trader",
    avatar: "",
    isOnline: true,
    watchlistPublic: true,
    watchlistCount: 12,
    topWatchedStock: "AAPL",
    friendshipDate: new Date("2024-01-15"),
    isFollowing: true,
    mutualFriends: 8,
    recentActivity: "Added NVDA to watchlist",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    username: "sarahj_invest",
    avatar: "",
    isOnline: false,
    watchlistPublic: false,
    watchlistCount: 8,
    topWatchedStock: "TSLA",
    friendshipDate: new Date("2024-01-10"),
    isFollowing: true,
    mutualFriends: 12,
    recentActivity: "Shared MSFT analysis",
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    username: "mike_stocks",
    avatar: "",
    isOnline: true,
    watchlistPublic: true,
    watchlistCount: 15,
    topWatchedStock: "NVDA",
    friendshipDate: new Date("2024-01-05"),
    isFollowing: false,
    mutualFriends: 5,
    recentActivity: "Created tech watchlist",
  },
  {
    id: "4",
    name: "Emma Wilson",
    username: "emmaw_finance",
    avatar: "",
    isOnline: false,
    watchlistPublic: true,
    watchlistCount: 20,
    topWatchedStock: "MSFT",
    friendshipDate: new Date("2023-12-28"),
    isFollowing: true,
    mutualFriends: 15,
    recentActivity: "Liked your GOOGL note",
  },
];

export function FriendsInterface({
  onSendMessage,
  onViewProfile,
  onShareStock,
  className,
}: FriendsInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "leaderboard">(
    "friends",
  );

  const filteredFriends = mockFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const leaderboardFriends = [...mockFriends]
    .filter((friend) => friend.rank)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Friends & Community
          </CardTitle>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-1" />
            Add Friend
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={activeTab === "friends" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("friends")}
            className="flex-1 h-8"
          >
            <Users className="h-3 w-3 mr-1" />
            Friends ({mockFriends.length})
          </Button>
          <Button
            variant={activeTab === "leaderboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("leaderboard")}
            className="flex-1 h-8"
          >
            <Crown className="h-3 w-3 mr-1" />
            Leaderboard
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {activeTab === "friends" ? (
          <>
            {filteredFriends.map((friend, index) => (
              <div key={friend.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(friend.name)}
                      </AvatarFallback>
                    </Avatar>
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{friend.name}</h4>
                      {friend.isFollowing && (
                        <Star className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      @{friend.username}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{friend.mutualFriends} mutual friends</span>
                      <span>•</span>
                      <span>Top pick: {friend.topStock}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      ${(friend.portfolioValue / 1000).toFixed(0)}k
                    </div>
                    <div
                      className={cn(
                        "text-xs flex items-center gap-1",
                        friend.portfolioChange >= 0
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      <TrendingUp
                        className={cn(
                          "h-3 w-3",
                          friend.portfolioChange < 0 && "rotate-180",
                        )}
                      />
                      {friend.portfolioChange >= 0 ? "+" : ""}
                      {friend.portfolioChange.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-13">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSendMessage?.(friend.id)}
                    className="h-7 text-xs"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewProfile?.(friend.id)}
                    className="h-7 text-xs text-blue-600"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShareStock?.(friend.id)}
                    className="h-7 text-xs text-green-600"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>

                {index < filteredFriends.length - 1 && <Separator />}
              </div>
            ))}

            {filteredFriends.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No friends found</p>
              </div>
            )}
          </>
        ) : (
          <>
            {leaderboardFriends.map((friend, index) => (
              <div key={friend.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                    {friend.rank}
                  </div>

                  <Avatar className="w-10 h-10">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(friend.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{friend.name}</h4>
                      {index === 0 && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      @{friend.username}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${(friend.portfolioValue / 1000).toFixed(0)}k
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        friend.portfolioChange >= 0
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {friend.portfolioChange >= 0 ? "+" : ""}
                      {friend.portfolioChange.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {index < leaderboardFriends.length - 1 && <Separator />}
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
