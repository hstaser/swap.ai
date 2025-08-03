import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/ui/bottom-nav";
import {
  Sparkles,
  Search,
  ArrowLeft,
  Play,
  Eye,
  BookOpen,
  TrendingUp,
  Users,
  Gamepad2,
  Globe,
  Zap,
  Leaf,
  Building,
  Crown,
  Tv,
  Heart,
  Filter,
  Settings,
  MessageCircle,
  AlertTriangle,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AlphaPrompt {
  id: string;
  title: string;
  description: string;
  theme: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  basedOn: string;
  teaches: string;
  sampleStocks: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

const alphaPrompts: AlphaPrompt[] = [
  // Politics Theme
  {
    id: "nancy_pelosi_clone",
    title: "Clone Nancy Pelosi's Portfolio",
    description: "Replicate the House Speaker's disclosed stock positions",
    theme: "Politics",
    difficulty: "Beginner",
    basedOn: "Congressional trading disclosures 2024",
    teaches: "Political insider trading patterns & tech allocation",
    sampleStocks: ["NVDA", "AAPL", "MSFT", "GOOGL", "CRM"],
    isPopular: true,
  },
  {
    id: "lobby_list",
    title: "The Lobby List",
    description: "Companies that spent heavily on lobbying efforts",
    theme: "Politics",
    difficulty: "Intermediate", 
    basedOn: "OpenSecrets.org lobbying database",
    teaches: "Regulatory risk vs. government influence",
    sampleStocks: ["AMZN", "META", "GOOGL", "AAPL", "PFE"],
  },
  {
    id: "senate_voting",
    title: "Senate Voting Simulator",
    description: "What if the Senate owned stocks like it votes?",
    theme: "Politics",
    difficulty: "Advanced",
    basedOn: "Congressional voting records analysis",
    teaches: "Political alignment with corporate interests",
    sampleStocks: ["LMT", "BA", "XOM", "CVX", "GS"],
  },

  // Sports Theme
  {
    id: "lebron_sponsors",
    title: "LeBron's Brand Empire",
    description: "Companies that sponsor LeBron James",
    theme: "Sports",
    difficulty: "Beginner",
    basedOn: "Celebrity endorsement deals 2024",
    teaches: "Celebrity endorsement value & brand premium",
    sampleStocks: ["NKE", "PEP", "WMT", "BEATS", "NFLX"],
    isNew: true,
  },
  {
    id: "superbowl_advertisers",
    title: "Super Bowl Advertisers 2024",
    description: "Companies that bought Super Bowl commercial slots",
    theme: "Sports",
    difficulty: "Beginner",
    basedOn: "Super Bowl LVIII advertiser list",
    teaches: "Marketing spend effectiveness & brand reach",
    sampleStocks: ["KO", "PEP", "AMZN", "UBER", "META"],
    isPopular: true,
  },
  {
    id: "nfl_partners",
    title: "NFL's Biggest Brand Partners",
    description: "Official NFL sponsors and stadium naming rights",
    theme: "Sports",
    difficulty: "Intermediate",
    basedOn: "NFL partnership agreements",
    teaches: "Sports marketing ROI & audience targeting",
    sampleStocks: ["VZ", "PEP", "VISA", "BAC", "FDX"],
  },

  // Social Media Theme
  {
    id: "wsb_hedged",
    title: "r/WallStreetBets - Hedged",
    description: "Top trending WSB stocks paired with defensive positions",
    theme: "Social Media",
    difficulty: "Advanced",
    basedOn: "Reddit sentiment analysis + risk management",
    teaches: "Retail sentiment vs. risk management",
    sampleStocks: ["GME", "AMC", "TSLA", "SPY", "VXX"],
    isPopular: true,
  },
  {
    id: "tiktok_crushes",
    title: "TikTok's Current Stock Crushes",
    description: "Stocks trending on financial TikTok",
    theme: "Social Media",
    difficulty: "Beginner",
    basedOn: "TikTok hashtag analysis #stocks #investing",
    teaches: "Social media influence on stock prices",
    sampleStocks: ["NVDA", "TSLA", "AMD", "PLTR", "COIN"],
    isNew: true,
  },
  {
    id: "elon_tweet_tracker",
    title: "Elon Musk Tweet Tracker",
    description: "Companies Elon has mentioned positively recently",
    theme: "Social Media",
    difficulty: "Intermediate",
    basedOn: "Twitter/X sentiment analysis",
    teaches: "CEO influence on market movements",
    sampleStocks: ["TSLA", "DOGE", "SHIB", "COIN", "SQ"],
  },

  // Tech Theme
  {
    id: "apple_competitors",
    title: "Apple Competitor Basket",
    description: "Companies positioned to benefit from Apple's decline",
    theme: "Tech",
    difficulty: "Intermediate",
    basedOn: "Competitive landscape analysis",
    teaches: "Competitive moats & market share dynamics",
    sampleStocks: ["GOOGL", "MSFT", "AMZN", "META", "QCOM"],
  },
  {
    id: "ai_revolution",
    title: "AI Revolution Beneficiaries",
    description: "Pure-play artificial intelligence companies",
    theme: "Tech",
    difficulty: "Advanced",
    basedOn: "AI research paper citations & patents",
    teaches: "Technology adoption curves & moats",
    sampleStocks: ["NVDA", "AMD", "GOOGL", "MSFT", "PLTR"],
    isPopular: true,
  },

  // ESG Theme
  {
    id: "clean_energy",
    title: "Clean Energy Transition",
    description: "Companies leading the renewable energy shift",
    theme: "ESG",
    difficulty: "Intermediate",
    basedOn: "IEA renewable energy report",
    teaches: "ESG investing & regulatory tailwinds",
    sampleStocks: ["TSLA", "ENPH", "SEDG", "NEE", "BEP"],
  },
];

const themes = [
  { id: "All", label: "All Prompts", icon: Sparkles, count: alphaPrompts.length },
  { id: "Politics", label: "Politics", icon: Crown, count: alphaPrompts.filter(p => p.theme === "Politics").length },
  { id: "Sports", label: "Sports", icon: Gamepad2, count: alphaPrompts.filter(p => p.theme === "Sports").length },
  { id: "Social Media", label: "Social Media", icon: Users, count: alphaPrompts.filter(p => p.theme === "Social Media").length },
  { id: "Tech", label: "Tech", icon: Zap, count: alphaPrompts.filter(p => p.theme === "Tech").length },
  { id: "ESG", label: "ESG", icon: Leaf, count: alphaPrompts.filter(p => p.theme === "ESG").length },
];

const difficultyColors = {
  "Beginner": "bg-green-100 text-green-700",
  "Intermediate": "bg-blue-100 text-blue-700", 
  "Advanced": "bg-purple-100 text-purple-700",
};

export default function AlphaPrompts() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<AlphaPrompt | null>(null);

  const filteredPrompts = alphaPrompts.filter(prompt => {
    const matchesTheme = selectedTheme === "All" || prompt.theme === selectedTheme;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  const handlePromptSelect = (prompt: AlphaPrompt) => {
    setSelectedPrompt(prompt);
  };

  const handleCreateQueue = (prompt: AlphaPrompt) => {
    // Navigate to chat with pre-filled prompt
    navigate(`/ai-agent?prompt=${encodeURIComponent(prompt.title)}`);
  };

  if (selectedPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSelectedPrompt(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{selectedPrompt.title}</h1>
                <p className="text-sm text-muted-foreground">{selectedPrompt.theme}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Prompt Detail */}
        <div className="container mx-auto px-4 py-6 pb-20">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Main Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={difficultyColors[selectedPrompt.difficulty]}>
                      {selectedPrompt.difficulty}
                    </Badge>
                    {selectedPrompt.isPopular && (
                      <Badge variant="secondary">🔥 Popular</Badge>
                    )}
                    {selectedPrompt.isNew && (
                      <Badge variant="secondary">✨ New</Badge>
                    )}
                  </div>
                  
                  <p className="text-lg text-muted-foreground">
                    {selectedPrompt.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Based On:</div>
                      <p className="text-gray-600">{selectedPrompt.basedOn}</p>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">What You'll Learn:</div>
                      <p className="text-gray-600">{selectedPrompt.teaches}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Stocks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sample Queue Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedPrompt.sampleStocks.map((symbol, index) => (
                  <div key={symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-mono font-bold">{symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          {symbol === "NVDA" ? "NVIDIA Corporation" :
                           symbol === "AAPL" ? "Apple Inc." :
                           symbol === "TSLA" ? "Tesla, Inc." :
                           symbol === "GOOGL" ? "Alphabet Inc." :
                           "Company Name"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">~{Math.floor(100 / selectedPrompt.sampleStocks.length)}%</div>
                      <div className="text-xs text-muted-foreground">allocation</div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="text-xs text-amber-800">
                      <p className="font-medium">Optimization Note:</p>
                      <p>Final allocations will be optimized based on your risk profile and portfolio balance after queue creation.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={() => handleCreateQueue(selectedPrompt)}
                className="w-full h-12 text-base"
              >
                <Play className="h-4 w-4 mr-2" />
                Create This Queue
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-10">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Only
                </Button>
                <Button variant="outline" className="h-10">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>

            {/* Disclaimer */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Shield className="h-3 w-3 mt-0.5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Investment Disclaimer</p>
                    <p>Alpha Prompts are educational tools based on public data. This is not personalized financial advice. Consider your financial situation before investing.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold">Alpha Prompts</h1>
                <Badge variant="secondary" className="text-xs">Beta</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Custom Query
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="container mx-auto px-4 py-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/60 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Theme Tabs */}
      <div className="container mx-auto px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            const isSelected = selectedTheme === theme.id;
            
            return (
              <Button
                key={theme.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTheme(theme.id)}
                className="flex-shrink-0 h-auto py-2 px-4"
              >
                <IconComponent className="h-4 w-4 mr-2" />
                <span>{theme.label}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {theme.count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((prompt) => (
            <Card 
              key={prompt.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
              onClick={() => handlePromptSelect(prompt)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base leading-tight">{prompt.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {prompt.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {prompt.isPopular && (
                      <Badge variant="secondary" className="text-xs">🔥</Badge>
                    )}
                    {prompt.isNew && (
                      <Badge variant="secondary" className="text-xs">✨</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                {/* Stock Preview */}
                <div className="flex -space-x-1 overflow-hidden">
                  {prompt.sampleStocks.slice(0, 4).map((symbol, index) => (
                    <div 
                      key={symbol}
                      className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 border-2 border-white rounded-full text-xs font-mono font-bold"
                      style={{ zIndex: 10 - index }}
                    >
                      {symbol.slice(0, 2)}
                    </div>
                  ))}
                  {prompt.sampleStocks.length > 4 && (
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 border-2 border-white rounded-full text-xs font-bold">
                      +{prompt.sampleStocks.length - 4}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between">
                  <Badge className={cn("text-xs", difficultyColors[prompt.difficulty])}>
                    {prompt.difficulty}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {prompt.sampleStocks.length} stocks
                  </div>
                </div>

                {/* Quick Action */}
                <Button 
                  size="sm" 
                  className="w-full h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateQueue(prompt);
                  }}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Create Queue
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
            <p className="text-gray-500">Try adjusting your search or theme filter.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
