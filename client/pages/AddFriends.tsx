import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Search,
  Users,
  UserPlus,
  TrendingUp,
  BarChart3,
  Eye,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  mutualFriends: number;
  commonStocks: string[];
  portfolioReturn?: number;
  isPublic: boolean;
  isRequested?: boolean;
  isFriend?: boolean;
}

const suggestedUsers: SuggestedUser[] = [
  {
    id: "sarah_investor",
    name: "Sarah Johnson",
    username: "sarah_investor",
    mutualFriends: 3,
    commonStocks: ["AAPL", "MSFT", "GOOGL"],
    portfolioReturn: 18.4,
    isPublic: true,
  },
  {
    id: "mike_trades",
    name: "Mike Chen",
    username: "mike_trades", 
    mutualFriends: 1,
    commonStocks: ["NVDA", "TSLA"],
    portfolioReturn: 12.8,
    isPublic: true,
  },
  {
    id: "alex_tech",
    name: "Alex Rodriguez",
    username: "alex_tech",
    mutualFriends: 2,
    commonStocks: ["AAPL", "NVDA", "AMD"],
    portfolioReturn: 25.6,
    isPublic: false,
  },
  {
    id: "jenny_growth",
    name: "Jenny Kim",
    username: "jenny_growth",
    mutualFriends: 0,
    commonStocks: ["TSLA", "CRM", "NFLX"],
    portfolioReturn: 8.3,
    isPublic: true,
  },
];

export default function AddFriends() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(suggestedUsers);

  const handleSendRequest = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isRequested: true } : user
    ));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div>
                <h1 className="text-2xl font-bold text-foreground">Add Friends</h1>
                <p className="text-sm text-muted-foreground">
                  Discover and connect with other investors
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Search */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Suggested Users */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Suggested for You</h2>
          </div>

          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                      onClick={() => navigate(`/user/${user.id}`)}
                    >
                      {user.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        {user.isPublic && (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">@{user.username}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        {user.mutualFriends > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {user.mutualFriends} mutual friends
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {user.commonStocks.length} stocks in common
                        </div>
                        {user.portfolioReturn && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {user.portfolioReturn > 0 ? "+" : ""}{user.portfolioReturn}% return
                          </div>
                        )}
                      </div>

                      {user.commonStocks.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-1">Common stocks:</div>
                          <div className="flex gap-2">
                            {user.commonStocks.slice(0, 3).map((stock) => (
                              <Badge key={stock} variant="outline" className="text-xs">
                                {stock}
                              </Badge>
                            ))}
                            {user.commonStocks.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.commonStocks.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/user/${user.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    {user.isRequested ? (
                      <Button disabled size="sm" className="bg-gray-400">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Requested
                      </Button>
                    ) : user.isFriend ? (
                      <Button disabled size="sm" className="bg-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Friends
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(user.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Friend
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUsers.length === 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No users found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms to find more investors.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200 mt-8">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Tips for Finding Friends</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Look for users with similar investment styles or common stocks</li>
              <li>• Check mutual friends to expand your network</li>
              <li>• View profiles to see portfolio performance and strategies</li>
              <li>• Start conversations about shared investment interests</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
