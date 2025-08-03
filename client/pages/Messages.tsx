import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MessageCircle,
  Users,
  Search,
  Send,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Clock,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  message: string;
  timestamp: Date;
  stockSymbol?: string;
  stockData?: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  };
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

export default function Social() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: "1",
      userId: "alex_j",
      userName: "Alex Johnson",
      lastMessage: "NVDA is looking really strong with the AI boom!",
      lastMessageTime: new Date("2024-01-15T10:30:00"),
      unreadCount: 2,
      messages: [
        {
          id: "msg1",
          fromUserId: "alex_j",
          fromUserName: "Alex Johnson",
          message: "Hey! Just shared NVDA with you",
          timestamp: new Date("2024-01-15T10:25:00"),
          stockSymbol: "NVDA",
          stockData: {
            symbol: "NVDA",
            name: "NVIDIA Corporation",
            price: 722.48,
            change: 12.66,
            changePercent: 1.78,
          },
        },
        {
          id: "msg2",
          fromUserId: "alex_j",
          fromUserName: "Alex Johnson",
          message: "NVDA is looking really strong with the AI boom!",
          timestamp: new Date("2024-01-15T10:30:00"),
        },
      ],
    },
    {
      id: "2",
      userId: "sarah_c",
      userName: "Sarah Chen",
      lastMessage: "What do you think about Tesla's recent drop?",
      lastMessageTime: new Date("2024-01-14T16:45:00"),
      unreadCount: 0,
      messages: [
        {
          id: "msg3",
          fromUserId: "sarah_c",
          fromUserName: "Sarah Chen",
          message: "Shared TSLA - thoughts?",
          timestamp: new Date("2024-01-14T16:40:00"),
          stockSymbol: "TSLA",
          stockData: {
            symbol: "TSLA",
            name: "Tesla, Inc.",
            price: 238.77,
            change: -8.32,
            changePercent: -3.37,
          },
        },
        {
          id: "msg4",
          fromUserId: "sarah_c",
          fromUserName: "Sarah Chen",
          message: "What do you think about Tesla's recent drop?",
          timestamp: new Date("2024-01-14T16:45:00"),
        },
      ],
    },
    {
      id: "3",
      userId: "mike_r",
      userName: "Mike Rodriguez",
      lastMessage: "Thanks for the Apple recommendation!",
      lastMessageTime: new Date("2024-01-13T14:20:00"),
      unreadCount: 0,
      messages: [
        {
          id: "msg5",
          fromUserId: "mike_r",
          fromUserName: "Mike Rodriguez",
          message: "Thanks for the Apple recommendation!",
          timestamp: new Date("2024-01-13T14:20:00"),
        },
      ],
    },
  ];

  const activeConv = conversations.find((c) => c.id === activeConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In real app, send message to backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleStockClick = (stockData: any) => {
    // Navigate to stock swiper page
    navigate(`/?symbol=${stockData.symbol}`);
  };

  // Auto-select conversation if coming from Message button
  useEffect(() => {
    const userIdParam = searchParams.get("userId");
    if (userIdParam) {
      const conversation = conversations.find(conv => conv.userId === userIdParam);
      if (conversation) {
        setActiveConversation(conversation.id);
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Social</h1>
                <p className="text-sm text-muted-foreground">
                  Connect with friends and other investors
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/settings">
                  Privacy Settings
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/friends">
                  <Users className="h-4 w-4 mr-2" />
                  Find Friends
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                        activeConversation === conv.id && "bg-blue-50",
                      )}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/user/${conv.userId}`);
                          }}
                        >
                          {conv.userName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm truncate">
                              {conv.userName}
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {conv.lastMessage}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {conv.lastMessageTime.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/add-friends")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Conversation */}
          <div className="md:col-span-2">
            {activeConv ? (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                      onClick={() => navigate(`/user/${activeConv.userId}`)}
                    >
                      {activeConv.userName[0]}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {activeConv.userName}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        @{activeConv.userId}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {activeConv.messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {message.fromUserName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {message.fromUserName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>

                          {/* Stock Share Card */}
                          {message.stockData && (
                            <Card
                              className="bg-blue-50 border-blue-200 mb-2 cursor-pointer hover:bg-blue-100 transition-colors"
                              onClick={() =>
                                handleStockClick(message.stockData)
                              }
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-bold text-sm">
                                      {message.stockData.symbol}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {message.stockData.name}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-sm">
                                      ${message.stockData.price.toFixed(2)}
                                    </div>
                                    <div
                                      className={cn(
                                        "flex items-center gap-1 text-xs",
                                        message.stockData.changePercent >= 0
                                          ? "text-green-600"
                                          : "text-red-600",
                                      )}
                                    >
                                      {message.stockData.changePercent >= 0 ? (
                                        <TrendingUp className="h-3 w-3" />
                                      ) : (
                                        <TrendingDown className="h-3 w-3" />
                                      )}
                                      {message.stockData.changePercent >= 0
                                        ? "+"
                                        : ""}
                                      {message.stockData.changePercent.toFixed(
                                        2,
                                      )}
                                      %
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-blue-600 mt-2">
                                  Tap to view in stock screener →
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          <div className="bg-gray-100 rounded-lg p-3 text-sm">
                            {message.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a friend to start discussing stocks
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
