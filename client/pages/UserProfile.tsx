import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Calendar,
  Share,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Users,
  BarChart3,
  Shield,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserProfileData {
  id: string;
  name: string;
  username: string;
  joinedDate: Date;
  friendSince?: Date;
  isPublicProfile: boolean;
  portfolioSharing: "public" | "friends" | "private";
  watchlistSharing: "public" | "friends" | "private";
  portfolio?: {
    totalValue: number;
    totalReturn: number;
    totalReturnPercent: number;
    holdings: Array<{
      symbol: string;
      name: string;
      shares: number;
      value: number;
      allocation: number;
    }>;
  };
  watchlist?: string[];
  overlappingStocks?: Array<{
    symbol: string;
    name: string;
    yourShares?: number;
    theirShares?: number;
  }>;
}

// Create different user data based on userId
const getUserData = (userId: string): UserProfileData => {
  if (userId === "alex_tech") {
    return {
      id: "alex_tech",
      name: "Alex Rodriguez",
      username: "alex_tech",
      joinedDate: new Date("2023-08-10"),
      friendSince: new Date("2023-12-05"),
      isPublicProfile: false,
      portfolioSharing: "private",
      watchlistSharing: "private",
      // No portfolio, watchlist, or overlapping stocks due to privacy
    };
  }

  // Default user (alex_chen)
  return {
    id: "alex_chen",
    name: "Alex Chen",
    username: "alexc_trades",
    joinedDate: new Date("2023-06-15"),
    friendSince: new Date("2023-11-20"),
    isPublicProfile: true,
    portfolioSharing: "friends",
    watchlistSharing: "public",
    portfolio: {
      totalValue: 25640.50,
      totalReturn: 3640.50,
      totalReturnPercent: 16.53,
      holdings: [
        { symbol: "AAPL", name: "Apple Inc.", shares: 50, value: 9126.00, allocation: 35.6 },
        { symbol: "MSFT", name: "Microsoft Corp.", shares: 25, value: 9471.25, allocation: 36.9 },
        { symbol: "GOOGL", name: "Alphabet Inc.", shares: 15, value: 2127.00, allocation: 8.3 },
        { symbol: "NVDA", name: "NVIDIA Corp.", shares: 8, value: 5779.84, allocation: 22.5 },
      ]
    },
    watchlist: ["TSLA", "AMD", "CRM", "NFLX", "META"],
    overlappingStocks: [
      { symbol: "AAPL", name: "Apple Inc.", yourShares: 30, theirShares: 50 },
      { symbol: "MSFT", name: "Microsoft Corp.", yourShares: 15, theirShares: 25 },
      { symbol: "NVDA", name: "NVIDIA Corp.", yourShares: 12, theirShares: 8 },
    ]
  };
};

export default function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userData] = useState<UserProfileData>(getUserData(userId || "alex_chen"));

  const canViewPortfolio = userData.portfolioSharing === "public" ||
    (userData.portfolioSharing === "friends" && userData.friendSince);

  const canViewWatchlist = userData.watchlistSharing === "public" ||
    (userData.watchlistSharing === "friends" && userData.friendSince);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/social")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {userData.name[0]}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{userData.name}</h1>
                  <p className="text-sm text-muted-foreground">@{userData.username}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/social?userId=${userData.id}`)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Friend Info */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Member Since</div>
                <div className="font-semibold">{formatDate(userData.joinedDate)}</div>
              </div>

              {userData.friendSince && (
                <div className="text-center">
                  <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Friends Since</div>
                  <div className="font-semibold">{formatDate(userData.friendSince)}</div>
                </div>
              )}

              {userData.overlappingStocks && userData.overlappingStocks.length > 0 && userData.portfolioSharing !== "private" ? (
                <div className="text-center">
                  <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Stocks in Common</div>
                  <div className="font-semibold">{userData.overlappingStocks.length}</div>
                </div>
              ) : userData.portfolioSharing === "private" ? (
                <div className="text-center">
                  <Shield className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Private Profile</div>
                  <div className="font-semibold text-gray-500">Hidden</div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Overlapping Stocks - Only show if user has shared data and there are overlapping stocks */}
        {userData.overlappingStocks && userData.overlappingStocks.length > 0 && userData.portfolioSharing !== "private" && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Stocks You Both Own
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userData.overlappingStocks.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-bold">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div>You: {stock.yourShares} shares</div>
                      <div>Them: {stock.theirShares} shares</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio and Watchlist Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Portfolio
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {userData.portfolioSharing === "public" ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Public
                        </>
                      ) : userData.portfolioSharing === "friends" ? (
                        <>
                          <Users className="h-3 w-3 mr-1" />
                          Friends Only
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {canViewPortfolio && userData.portfolio ? (
                  <div className="space-y-4">
                    {/* Portfolio Summary */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="text-center">
                        <div className={cn(
                          "text-2xl font-bold",
                          userData.portfolio.totalReturnPercent >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {userData.portfolio.totalReturnPercent >= 0 ? "+" : ""}{userData.portfolio.totalReturnPercent.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Total Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {userData.portfolio.holdings.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Holdings</div>
                      </div>
                    </div>

                    {/* Holdings */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Holdings</h4>
                      {userData.portfolio.holdings.map((holding) => (
                        <div key={holding.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-bold">{holding.symbol}</div>
                            <div className="text-sm text-muted-foreground">{holding.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">{holding.allocation}%</div>
                            <div className="text-sm text-muted-foreground">
                              of portfolio
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Portfolio Private</h3>
                    <p className="text-gray-500">
                      {userData.portfolioSharing === "private"
                        ? "This user keeps their portfolio private"
                        : "You need to be friends to view this portfolio"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchlist">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Watchlist
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {userData.watchlistSharing === "public" ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Public
                      </>
                    ) : userData.watchlistSharing === "friends" ? (
                      <>
                        <Users className="h-3 w-3 mr-1" />
                        Friends Only
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {canViewWatchlist && userData.watchlist ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {userData.watchlist.map((symbol) => (
                      <div key={symbol} className="p-3 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                        <div className="font-bold text-lg">{symbol}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Watchlist Private</h3>
                    <p className="text-gray-500">
                      {userData.watchlistSharing === "private"
                        ? "This user keeps their watchlist private"
                        : "You need to be friends to view this watchlist"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
