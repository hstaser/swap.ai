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
  onViewWatchlist,
  onShareStock,
  className,
}: FriendsInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = mockFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

        <p className="text-sm text-muted-foreground">
          Connect with friends and share stock ideas
        </p>
      </CardHeader>

      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
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
                  {friend.watchlistPublic ? (
                    <Unlock className="h-3 w-3 text-green-600" />
                  ) : (
                    <Lock className="h-3 w-3 text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  @{friend.username}
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  {friend.recentActivity}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold">
                  {friend.watchlistCount} stocks
                </div>
                <div className="text-xs text-muted-foreground">
                  watching {friend.topWatchedStock}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {friend.watchlistPublic ? "Public watchlist" : "Private"}
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
                onClick={() => onViewWatchlist?.(friend.id)}
                disabled={!friend.watchlistPublic}
                className="h-7 text-xs text-blue-600 disabled:opacity-50"
              >
                <Eye className="h-3 w-3 mr-1" />
                Watchlist
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
      </CardContent>
    </Card>
  );
}
