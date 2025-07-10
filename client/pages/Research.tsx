import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  TrendingUp,
  BarChart3,
  DollarSign,
  Clock,
  Globe,
  Sparkles,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  stockMentioned?: string;
  suggestions?: string[];
}

const suggestedQuestions = [
  "What is Apple's current business model?",
  "Tell me about NVIDIA's competitive advantages",
  "How does Tesla's revenue compare to traditional automakers?",
  "What are the key financial metrics for Microsoft?",
  "Explain Amazon's different business segments",
  "What factors affect Google's advertising revenue?",
];

const stockResponses: Record<string, string> = {
  AAPL: "Apple Inc. is a multinational technology company that designs, manufactures, and markets consumer electronics, computer software, and online services. Key business segments include iPhone (largest revenue driver), Mac computers, iPad, Services (App Store, iCloud, Apple Music), and Wearables (Apple Watch, AirPods). The company is known for its premium pricing strategy, strong brand loyalty, and integrated ecosystem approach. Apple generates revenue through hardware sales, digital services, and accessories.",

  NVDA: "NVIDIA Corporation is a technology company that designs graphics processing units (GPUs) and system-on-chip units (SoCs). Originally focused on gaming graphics, NVIDIA has become a leader in AI and data center computing. Key business segments include Data Center (AI training and inference), Gaming (consumer graphics cards), Professional Visualization, and Automotive (self-driving technology). The company's CUDA software platform and AI chip architecture have created strong competitive moats in machine learning applications.",

  TSLA: "Tesla Inc. is an electric vehicle and clean energy company. Primary business segments include Automotive (Model S, 3, X, Y), Energy Generation and Storage (solar panels, Powerwall, Megapack), and Services. Tesla operates with a direct-sales model, bypassing traditional dealerships. The company also develops autonomous driving technology and operates a growing network of Supercharger stations. Tesla's integrated approach combines vehicle manufacturing, battery technology, and charging infrastructure.",

  MSFT: "Microsoft Corporation is a multinational technology company offering software, services, devices, and solutions. Key business segments include Productivity and Business Processes (Office 365, Microsoft Teams), Intelligent Cloud (Azure, Windows Server), and More Personal Computing (Windows, Xbox, Surface devices). Microsoft has successfully transitioned to a cloud-first, subscription-based model with Azure being a major growth driver competing with Amazon Web Services.",

  AMZN: "Amazon.com Inc. operates diverse business segments including North America e-commerce, International e-commerce, and Amazon Web Services (AWS). AWS is the highly profitable cloud computing division providing infrastructure, platform, and software services. Other segments include advertising services, Amazon Prime subscription services, and physical stores (Whole Foods). The company is known for its long-term investment approach and customer-centric philosophy.",

  GOOGL:
    "Alphabet Inc. (Google) is primarily an advertising and technology company. Main revenue sources include Google Search advertising, YouTube advertising, Google Network (AdSense), Google Cloud, and Other Bets (experimental projects). The company dominates digital advertising through its search engine and vast data collection capabilities. Google Cloud competes in the enterprise cloud market, while Other Bets includes ventures like Waymo (autonomous vehicles).",
};

export default function Research() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const symbolParam = searchParams.get("symbol");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: symbolParam
        ? `Hello! I see you're interested in learning about ${symbolParam}. I can help you understand the company's business model, financial metrics, and market position. What would you like to know about ${symbolParam}?`
        : "Hello! I'm your AI research assistant. I can help you understand companies, their business models, financial metrics, and market position. What would you like to learn about?",
      timestamp: new Date(),
      suggestions: symbolParam
        ? [
            `Tell me about ${symbolParam}'s business model`,
            `What are ${symbolParam}'s key revenue sources?`,
            `How does ${symbolParam} compare to competitors?`,
          ]
        : suggestedQuestions.slice(0, 3),
    },
  ]);
  const [inputValue, setInputValue] = useState(
    symbolParam ? `Tell me about ${symbolParam}` : "",
  );
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const upperMessage = userMessage.toUpperCase();

    // Check for stock symbols
    for (const [symbol, info] of Object.entries(stockResponses)) {
      if (
        upperMessage.includes(symbol) ||
        upperMessage.includes(symbol.toLowerCase())
      ) {
        return info;
      }
    }

    // Check for company names
    if (upperMessage.includes("APPLE") || upperMessage.includes("IPHONE")) {
      return stockResponses.AAPL;
    }
    if (upperMessage.includes("NVIDIA") || upperMessage.includes("GPU")) {
      return stockResponses.NVDA;
    }
    if (upperMessage.includes("TESLA") || upperMessage.includes("ELECTRIC")) {
      return stockResponses.TSLA;
    }
    if (upperMessage.includes("MICROSOFT") || upperMessage.includes("AZURE")) {
      return stockResponses.MSFT;
    }
    if (upperMessage.includes("AMAZON") || upperMessage.includes("AWS")) {
      return stockResponses.AMZN;
    }
    if (upperMessage.includes("GOOGLE") || upperMessage.includes("ALPHABET")) {
      return stockResponses.GOOGL;
    }

    // Generic responses for different types of questions
    if (
      upperMessage.includes("FINANCIAL") ||
      upperMessage.includes("METRICS")
    ) {
      return "I can help you understand financial metrics like revenue, profit margins, debt levels, and cash flow. However, I cannot provide investment advice or specific buy/sell recommendations. For detailed financial analysis, I'd recommend reviewing the company's latest quarterly reports and SEC filings.";
    }

    if (
      upperMessage.includes("INVEST") ||
      upperMessage.includes("BUY") ||
      upperMessage.includes("SELL")
    ) {
      return "I cannot provide investment advice or recommendations on whether to buy or sell securities. However, I can help you understand company fundamentals, business models, competitive positioning, and industry trends to support your own research and decision-making process.";
    }

    if (
      upperMessage.includes("PRICE") ||
      upperMessage.includes("TARGET") ||
      upperMessage.includes("FORECAST")
    ) {
      return "I cannot predict stock prices or provide price targets. Stock prices are influenced by numerous factors including market sentiment, economic conditions, company performance, and global events. I can help you understand the factors that typically influence a company's valuation.";
    }

    // Default response
    return "I'd be happy to help you learn about specific companies, their business models, competitive advantages, or industry trends. Try asking about a specific company like Apple, Microsoft, Tesla, or NVIDIA, or ask about business concepts you'd like to understand better.";
  };

  const extractStockSymbol = (message: string): string | undefined => {
    const symbols = ["AAPL", "NVDA", "TSLA", "MSFT", "AMZN", "GOOGL"];
    const upperMessage = message.toUpperCase();
    return symbols.find((symbol) => upperMessage.includes(symbol));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000),
    );

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: generateResponse(inputValue),
      timestamp: new Date(),
      stockMentioned: extractStockSymbol(inputValue),
      suggestions:
        Math.random() > 0.5
          ? suggestedQuestions.slice(
              Math.floor(Math.random() * 3),
              Math.floor(Math.random() * 3) + 3,
            )
          : undefined,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Research Chat
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-white/50 flex items-center gap-1"
              >
                <Bot className="h-3 w-3" />
                AI Assistant Active
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Educational Only
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Disclaimer */}
        <Card className="bg-yellow-50 border-yellow-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-yellow-800">
                  Educational Information Only
                </h3>
                <p className="text-sm text-yellow-700">
                  This AI assistant provides educational information about
                  companies and markets. It does not provide investment advice,
                  price predictions, or buy/sell recommendations. Always conduct
                  your own research and consult with financial professionals
                  before making investment decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Stock Research Assistant
            </CardTitle>
          </CardHeader>

          {/* Messages */}
          <CardContent className="p-0">
            <div className="h-[600px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.type === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex gap-3 max-w-[80%]",
                      message.type === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        message.type === "user"
                          ? "bg-blue-500"
                          : "bg-gradient-to-r from-purple-500 to-blue-500",
                      )}
                    >
                      {message.type === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div
                        className={cn(
                          "p-3 rounded-lg",
                          message.type === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900",
                        )}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>

                      {message.stockMentioned && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/stock/${message.stockMentioned}`}>
                              <BarChart3 className="h-3 w-3 mr-1" />
                              View {message.stockMentioned} Details
                            </Link>
                          </Button>
                        </div>
                      )}

                      {message.suggestions && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Suggested questions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-auto p-2 text-left"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about any stock or company..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground mr-2">
                  Quick questions:
                </span>
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto p-1 text-blue-600"
                    onClick={() => handleSuggestionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Topics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-sm">Popular Companies</h4>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-green-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "Tell me about Apple's business model and revenue sources",
                    )
                  }
                >
                  • Apple (AAPL) - Consumer Electronics
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-green-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "What makes Microsoft's cloud business competitive?",
                    )
                  }
                >
                  • Microsoft (MSFT) - Cloud & Software
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-green-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "How is NVIDIA positioned in the AI chip market?",
                    )
                  }
                >
                  • NVIDIA (NVDA) - AI & Graphics
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-sm">Key Metrics</h4>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-blue-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "Explain revenue growth rates and what they indicate",
                    )
                  }
                >
                  • Revenue & Growth Rates
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-blue-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "What are profit margins and how do they show efficiency?",
                    )
                  }
                >
                  • Profit Margins & Efficiency
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-blue-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "How do you analyze market position and competitive advantages?",
                    )
                  }
                >
                  • Market Position & Competition
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-sm">Industry Analysis</h4>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-purple-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "What are the current trends in the technology sector?",
                    )
                  }
                >
                  • Technology Sector Trends
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-purple-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "Tell me about recent healthcare innovations and opportunities",
                    )
                  }
                >
                  • Healthcare Innovations
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-purple-50"
                  onClick={() =>
                    handleSuggestionClick(
                      "How are financial services evolving with technology?",
                    )
                  }
                >
                  • Financial Services Evolution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
