import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Crown,
  Users,
  Gamepad2,
  Zap,
  Leaf,
  ExternalLink,
  Brain,
  CheckCircle,
  X,
  Target,
  Shield,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  stockMentioned?: string;
  suggestions?: string[];
  showQueueButton?: boolean;
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

const themes = [
  { id: "Politics", label: "Politics", icon: Crown, prompts: [
    "Nancy Pelosi's Congressional Portfolio",
    "Senate Voting Simulator",
    "The Lobby List - Heavy Spenders"
  ]},
  { id: "Sports", label: "Sports", icon: Gamepad2, prompts: [
    "LeBron's Brand Empire",
    "Super Bowl Advertisers 2024",
    "NFL's Biggest Partners"
  ]},
  { id: "Social Media", label: "Social Media", icon: Users, prompts: [
    "r/WallStreetBets - Hedged",
    "TikTok's Current Stock Crushes",
    "Elon Musk Tweet Tracker"
  ]},
  { id: "Tech", label: "Tech", icon: Zap, prompts: [
    "Apple Competitor Basket",
    "AI Revolution Beneficiaries",
    "Cloud Wars Winners"
  ]},
  { id: "ESG", label: "ESG", icon: Leaf, prompts: [
    "Clean Energy Transition",
    "Sustainable Investing Leaders",
    "ESG Score Champions"
  ]},
];

export default function Research() {
  const navigate = useNavigate();
  const { queue, addToQueue, clearQueue } = useQueue();
  const [searchParams] = useSearchParams();
  const symbolParam = searchParams.get("symbol");

  // Store the referring page when component mounts
  useEffect(() => {
    if (document.referrer && !sessionStorage.getItem("research_referrer")) {
      sessionStorage.setItem("research_referrer", document.referrer);
    }
  }, []);

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
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showThemePrompts, setShowThemePrompts] = useState(false);
  const [createdQueueName, setCreatedQueueName] = useState<string | null>(null);
  const [deepResearchMode, setDeepResearchMode] = useState(false);
  const [researchContext, setResearchContext] = useState<string>("");
  const [showAllocationDialog, setShowAllocationDialog] = useState(false);
  const [pendingQueueType, setPendingQueueType] = useState<string | null>(null);

  // Insights data
  const insights = [
    {
      id: "1",
      type: "opportunity",
      title: "Add healthcare exposure",
      description: "Your portfolio has no exposure to Healthcare sector - consider defensive positioning",
      action: "Explore Healthcare",
      actionType: "explore_sector",
      sector: "Healthcare"
    },
    {
      id: "2",
      type: "optimization",
      title: "Rebalance portfolio",
      description: "Technology is 45% of your portfolio (target: 30%) - optimization recommended",
      action: "Rebalance Now",
      actionType: "rebalance"
    },
    {
      id: "3",
      type: "opportunity",
      title: "Consider financial services ETFs",
      description: "No exposure to Financial Services - diversify with sector ETFs",
      action: "Explore Financials",
      actionType: "explore_sector",
      sector: "Financial Services"
    },
    {
      id: "4",
      type: "opportunity",
      title: "Add international exposure",
      description: "Portfolio is US-heavy - consider international ETFs for global diversification",
      action: "Explore International",
      actionType: "explore_sector",
      sector: "International"
    }
  ];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const upperMessage = userMessage.toUpperCase();

    // Check for Alpha Prompts / Queue Construction queries
    if (upperMessage.includes("NANCY PELOSI") || upperMessage.includes("PELOSI")) {
      // Create the queue
      createQueue("pelosi");
      return "Queue created! Based on congressional trading disclosures, I've built Nancy Pelosi's portfolio with NVIDIA (recent large purchases), Apple (consistent holding), Microsoft (cloud exposure), Google (growth position), and Salesforce (software exposure). This strategy focuses on technology leaders with strong government relationships and regulatory moats. Remember: Congressional trades are disclosed with delays and this is educational information only.";
    }

    if (upperMessage.includes("LEBRON") || upperMessage.includes("BRAND EMPIRE")) {
      // Create the queue
      createQueue("lebron");
      return "Queue created! I've built LeBron's Brand Empire with Nike (lifetime deal), PepsiCo (Blaze Pizza investment), Walmart (SpringHill partnership), Beats by Dre (early investor), and Netflix (content deals). This strategy focuses on consumer brands that leverage celebrity endorsements and have strong brand loyalty. Celebrity-backed strategies can be volatile based on public perception.";
    }

    if (upperMessage.includes("WARREN BUFFETT") || upperMessage.includes("BUFFETT") || upperMessage.includes("BERKSHIRE")) {
      // Create the queue
      createQueue("buffett");
      return "Queue created! I've built Warren Buffett's strategy with Apple (40% allocation - largest position), Bank of America (banking sector bet), Coca-Cola (classic consumer brand), American Express (financial services moat), and Kraft Heinz (consumer staples). This value-oriented approach emphasizes cash flow, brand strength, and long-term holding periods.";
    }

    if (upperMessage.includes("QUEUE") || upperMessage.includes("BUILD") || upperMessage.includes("CREATE")) {
      return "I can help you build investment queues based on proven strategies! Popular options include following political disclosures (Nancy Pelosi's tech-heavy picks), celebrity brand empires (LeBron's endorsement portfolio), or legendary investor strategies (Buffett's value approach). Each queue comes with 5-7 stocks, allocation suggestions, and educational context about the investment thesis. What type of strategy interests you?";
    }

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

    // Deep research mode responses
    // Deep research mode responses
    if (upperMessage.includes("DEEP RESEARCH") || upperMessage.includes("DETAILED ANALYSIS")) {
      setDeepResearchMode(true);
      return "I'll provide you with comprehensive research. To personalize this analysis, I can focus on specific aspects that matter most to you. Would you like me to emphasize: fundamental analysis, technical patterns, competitive positioning, ESG factors, or market sentiment? You can also skip this and get a general overview.";
    }

    // Handle deep research personalization
    if (deepResearchMode) {
      if (upperMessage.includes("FUNDAMENTAL")) {
        setResearchContext("fundamental");
        setDeepResearchMode(false);
        return "Perfect! I'll focus on fundamental analysis. For any stock you mention, I'll dive deep into revenue growth, profit margins, debt levels, cash flow, and valuation metrics. I'll also compare these fundamentals to industry averages and historical trends. What company would you like me to analyze?";
      } else if (upperMessage.includes("COMPETITIVE")) {
        setResearchContext("competitive");
        setDeepResearchMode(false);
        return "Great choice! I'll emphasize competitive positioning analysis. I'll examine market share, competitive advantages, moats, industry dynamics, and how companies stack up against rivals. Which company or sector interests you?";
      } else if (upperMessage.includes("ESG")) {
        setResearchContext("esg");
        setDeepResearchMode(false);
        return "Excellent! I'll include ESG (Environmental, Social, Governance) factors in my analysis. I'll look at sustainability practices, social impact, governance quality, and how these factors might affect long-term performance. What company should we research?";
      } else if (upperMessage.includes("SKIP") || upperMessage.includes("EVERYTHING")) {
        setResearchContext("comprehensive");
        setDeepResearchMode(false);
        return "Got it! I'll provide comprehensive analysis covering all aspects - fundamentals, technicals, competitive position, market sentiment, and ESG factors. This gives you the complete picture. What stock or company would you like me to research?";
      }
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

    // Generate appropriate suggestions based on message content
    let suggestions: string[] | undefined;
    let showQueueButton = false;
    const upperInput = inputValue.toUpperCase();

    if (upperInput.includes("PELOSI")) {
      showQueueButton = true;
      suggestions = [
        "Show me the specific stocks in Nancy Pelosi's portfolio",
        "How do congressional trading patterns affect markets?",
        "Explain the risks of following political portfolios"
      ];
    } else if (upperInput.includes("LEBRON")) {
      showQueueButton = true;
      suggestions = [
        "What other athletes have successful investment portfolios?",
        "How do celebrity endorsements impact stock performance?",
        "Show me more sports-themed investment strategies"
      ];
    } else if (upperInput.includes("BUFFETT")) {
      showQueueButton = true;
      suggestions = [
        "What makes Berkshire Hathaway's strategy successful?",
        "Show me other value investing approaches",
        "Explain Buffett's investment philosophy"
      ];
    } else if (upperInput.includes("QUEUE") || upperInput.includes("BUILD")) {
      suggestions = [
        "Show me trending Alpha Prompts",
        "What's the difference between themes?",
        "How do you optimize queue allocations?"
      ];
    } else if (deepResearchMode) {
      suggestions = [
        "Focus on fundamental analysis",
        "Emphasize competitive positioning",
        "Include ESG factors",
        "Skip personalization - give me everything"
      ];
    } else {
      // Add deep research option to regular suggestions
      const deepResearchSuggestion = "Start deep research mode for detailed analysis";
      const regularSuggestions = suggestedQuestions.slice(
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3) + 2,
      );
      suggestions = Math.random() > 0.5
        ? [deepResearchSuggestion, ...regularSuggestions]
        : regularSuggestions;
    }

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: generateResponse(inputValue),
      timestamp: new Date(),
      stockMentioned: extractStockSymbol(inputValue),
      suggestions,
      showQueueButton,
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

  const createQueue = async (queueType: string) => {
    // Check if user has existing queue first
    if (queue.length > 0) {
      const confirmReplace = window.confirm(
        "Your existing queue will be erased. Continue?"
      );
      if (!confirmReplace) return;
    }

    // Show allocation preference dialog
    setPendingQueueType(queueType);
    setShowAllocationDialog(true);
  };

  const executeQueueCreation = (queueType: string, useIdenticalAllocation: boolean) => {
    const queueTemplates: Record<string, {name: string, stocks: string[], allocations?: number[]}> = {
      "pelosi": {
        name: "Nancy Pelosi's Portfolio",
        stocks: ["NVDA", "AAPL", "MSFT", "GOOGL", "CRM"],
        allocations: [25, 30, 20, 15, 10] // Based on actual disclosed holdings
      },
      "lebron": {
        name: "LeBron's Brand Empire",
        stocks: ["NKE", "PEP", "WMT", "BEATS", "NFLX"],
        allocations: [40, 20, 15, 15, 10] // Nike is his biggest deal
      },
      "buffett": {
        name: "Buffett's Strategy",
        stocks: ["AAPL", "BAC", "KO", "AXP", "KHC"],
        allocations: [45, 20, 15, 12, 8] // Apple is Berkshire's largest holding
      }
    };

    const template = queueTemplates[queueType];
    if (!template) return;

    // Clear existing queue if user confirmed
    if (queue.length > 0) {
      clearQueue();
    }

    // Add stocks to queue with allocation info
    template.stocks.forEach((symbol, index) => {
      addToQueue(symbol, "bullish");
    });

    // Store allocation preference for optimization
    if (useIdenticalAllocation) {
      localStorage.setItem(`queue_${template.name}_allocations`, JSON.stringify(template.allocations));
      localStorage.setItem(`queue_${template.name}_type`, "identical");
    } else {
      localStorage.setItem(`queue_${template.name}_type`, "optimized");
    }

    setCreatedQueueName(template.name);
    setShowAllocationDialog(false);
    setPendingQueueType(null);
  };

  const handleThemeSelection = (themeId: string) => {
    setSelectedTheme(themeId);
    setShowThemeDialog(false);
    setShowThemePrompts(true);
  };

  const handlePromptSelection = (prompt: string) => {
    setShowThemePrompts(false);
    setInputValue(prompt);
  };

  const handleInsightAction = (insight: any) => {
    if (insight.actionType === "explore_sector") {
      // Navigate to main dashboard with sector filter applied
      const sectorMap: Record<string, string> = {
        "Healthcare": "healthcare",
        "Financial Services": "financials",
        "International": "international"
      };
      const sectorFilter = sectorMap[insight.sector] || insight.sector.toLowerCase();
      navigate(`/?sector=${sectorFilter}`);
    } else if (insight.actionType === "rebalance") {
      // Navigate to portfolio page and trigger rebalancing directly
      navigate("/portfolio?autoRebalance=true");
    }
  };

  const handleInsightReject = (insightId: string) => {
    // Remove insight from list (in real app, would persist this)
    console.log(`Rejected insight: ${insightId}`);
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
                  AI Assistant
                </h1>
              </div>
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
                  Educational Research & Queue Building
                </h3>
                <p className="text-sm text-yellow-700">
                  This AI assistant provides educational information and creates investment queues
                  based on objective data sources like public filings and disclosures.
                  It does not provide personalized investment advice or guarantee future performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Research and Insights */}
        <Tabs defaultValue="research" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="research">Research Chat</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="research" className="space-y-4">

        {/* Queue Construction Callout */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Try Queue Construction!</h3>
                <p className="text-blue-100 text-sm">
                  Build investment portfolios based on strategies from Nancy Pelosi, Warren Buffett, LeBron James, and more.
                  Check out the suggestions below! 👇
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Stock Research Assistant
              </div>
              <div className="flex items-center gap-2">
                {deepResearchMode && (
                  <Badge variant="secondary" className="text-xs">
                    Deep Research Mode
                  </Badge>
                )}
                {researchContext && (
                  <Badge variant="outline" className="text-xs">
                    Focus: {researchContext}
                  </Badge>
                )}
              </div>
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

                      {message.showQueueButton && (
                        <div className="mt-3">
                          <Button
                            onClick={() => navigate("/queue/review")}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit Queue
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
                  className="w-full justify-start h-auto p-3 text-sm text-left hover:bg-green-50 min-h-[40px]"
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
                  className="w-full justify-start h-auto p-3 text-sm text-left hover:bg-green-50 min-h-[40px]"
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
                  className="w-full justify-start h-auto p-3 text-sm text-left hover:bg-green-50 min-h-[40px]"
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
                  className="w-full justify-start h-auto p-3 text-sm text-left hover:bg-blue-50 min-h-[40px]"
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
                  className="w-full justify-start h-auto p-3 text-sm text-left hover:bg-blue-50 min-h-[40px]"
                  onClick={() =>
                    handleSuggestionClick(
                      "What are profit margins and how do they show efficiency?",
                    )
                  }
                >
                  �� Profit Margins & Efficiency
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-3 text-sm text-left hover:bg-blue-50 min-h-[40px]"
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

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-lg ring-1 ring-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-purple-600 rounded-full">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm text-purple-800">🚀 Queue Construction</h4>
                <Badge className="bg-purple-600 text-white text-xs">AI Powered</Badge>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-purple-50"
                  onClick={() =>
                    handleSuggestionClick("Build a queue based on Nancy Pelosi's recent stock disclosures")
                  }
                >
                  • Follow Nancy Pelosi's Portfolio
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-purple-50"
                  onClick={() =>
                    handleSuggestionClick("Create a queue with companies that sponsor LeBron James")
                  }
                >
                  • LeBron's Brand Empire
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-xs text-left hover:bg-purple-50"
                  onClick={() =>
                    handleSuggestionClick("Build a Warren Buffett inspired queue with Berkshire holdings")
                  }
                >
                  • Clone Buffett's Strategy
                </Button>
                <div className="pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-auto p-2"
                    onClick={() => setShowThemeDialog(true)}
                  >
                    + Add Your Own Theme
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">AI Insights</h2>
              {insights.map((insight) => (
                <Card key={insight.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {insight.type === "opportunity" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {insight.type === "optimization" && <Target className="h-4 w-4 text-blue-600" />}
                          <h3 className="font-semibold">{insight.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleInsightAction(insight)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {insight.action}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInsightReject(insight.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Theme Selection Dialog */}
      <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose Your Theme</DialogTitle>
            <DialogDescription>
              Select a theme to explore curated Alpha Prompts, or create your own custom strategy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {themes.map((theme) => {
              const IconComponent = theme.icon;
              return (
                <Button
                  key={theme.id}
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => handleThemeSelection(theme.id)}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{theme.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {theme.prompts.length} prompts available
                    </div>
                  </div>
                </Button>
              );
            })}
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="h-auto p-4 justify-start"
              onClick={() => {
                setShowThemeDialog(false);
                setInputValue("Create a custom investment queue based on ");
              }}
            >
              <Sparkles className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Custom Theme</div>
                <div className="text-xs text-muted-foreground">
                  Create your own investment strategy
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Theme Prompts Dialog */}
      <Dialog open={showThemePrompts} onOpenChange={setShowThemePrompts}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedTheme && themes.find(t => t.id === selectedTheme)?.label} Alpha Prompts
            </DialogTitle>
            <DialogDescription>
              Choose a specific investment strategy or ask a custom question.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {selectedTheme && themes.find(t => t.id === selectedTheme)?.prompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start text-left"
                onClick={() => handlePromptSelection(`Build a queue based on: ${prompt}`)}
              >
                <div className="flex-1">
                  <div className="font-medium">{prompt}</div>
                  <div className="text-xs text-muted-foreground">
                    Curated investment strategy
                  </div>
                </div>
              </Button>
            ))}
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="h-auto p-4 justify-start"
              onClick={() => {
                setShowThemePrompts(false);
                const theme = themes.find(t => t.id === selectedTheme);
                setInputValue(`Create a custom ${theme?.label.toLowerCase()} investment strategy based on `);
              }}
            >
              <Sparkles className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Custom {selectedTheme && themes.find(t => t.id === selectedTheme)?.label} Strategy</div>
                <div className="text-xs text-muted-foreground">
                  Create your own approach
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Allocation Preference Dialog */}
      <Dialog open={showAllocationDialog} onOpenChange={setShowAllocationDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose Allocation Method</DialogTitle>
            <DialogDescription>
              How would you like to allocate the stocks in this portfolio?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-6">
            <Button
              variant="outline"
              className="w-full h-auto p-4 justify-start min-h-[80px]"
              onClick={() => executeQueueCreation(pendingQueueType!, true)}
            >
              <div className="text-left w-full">
                <div className="font-medium mb-2">Identical Clone</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Use the exact same allocation percentages as the original portfolio
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full h-auto p-4 justify-start min-h-[80px]"
              onClick={() => executeQueueCreation(pendingQueueType!, false)}
            >
              <div className="text-left w-full">
                <div className="font-medium mb-2">AI Optimized</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Let AI optimize allocations based on your risk profile and market conditions
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
