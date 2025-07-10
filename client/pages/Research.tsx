import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Activity,
  BarChart3,
  Globe,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Eye,
  Clock,
  DollarSign,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MarketInsight {
  id: string;
  type: "bullish" | "bearish" | "neutral";
  title: string;
  summary: string;
  confidence: number;
  timeframe: string;
  sector?: string;
  impact: "low" | "medium" | "high";
}

interface AIAnalysis {
  id: string;
  title: string;
  analysis: string;
  recommendation: "buy" | "sell" | "hold";
  targetPrice?: number;
  currentPrice: number;
  symbol: string;
  confidence: number;
  reasoning: string[];
}

const mockInsights: MarketInsight[] = [
  {
    id: "1",
    type: "bullish",
    title: "AI Semiconductor Surge Expected",
    summary:
      "ML models predict 40% growth in GPU demand over next 6 months driven by enterprise AI adoption",
    confidence: 87,
    timeframe: "6M",
    sector: "Technology",
    impact: "high",
  },
  {
    id: "2",
    type: "bearish",
    title: "Interest Rate Pressure Building",
    summary:
      "Fed sentiment analysis indicates 73% probability of rate hike, affecting growth stocks",
    confidence: 73,
    timeframe: "3M",
    sector: "Financial Services",
    impact: "medium",
  },
  {
    id: "3",
    type: "bullish",
    title: "Healthcare Innovation Momentum",
    summary:
      "Breakthrough drug approvals and AI diagnostics creating new market opportunities",
    confidence: 91,
    timeframe: "12M",
    sector: "Healthcare",
    impact: "high",
  },
];

const mockAIAnalyses: AIAnalysis[] = [
  {
    id: "1",
    title: "NVIDIA Deep Dive Analysis",
    analysis:
      "Advanced neural networks have analyzed 50,000+ data points across earnings, patent filings, competitive landscape, and market sentiment. AI models show exceptionally strong indicators for continued growth.",
    recommendation: "buy",
    targetPrice: 850,
    currentPrice: 722,
    symbol: "NVDA",
    confidence: 94,
    reasoning: [
      "Patent velocity increased 340% in AI-related filings",
      "Enterprise adoption curve accelerating beyond projections",
      "Competitive moat strengthening in high-performance computing",
      "Revenue diversification reducing datacenter dependency",
    ],
  },
  {
    id: "2",
    title: "Apple Services Revolution",
    analysis:
      "Multi-modal AI analysis reveals Apple's services transition is undervalued by traditional metrics. Vision Pro ecosystem creating new revenue streams not reflected in current pricing.",
    recommendation: "buy",
    targetPrice: 210,
    currentPrice: 182,
    symbol: "AAPL",
    confidence: 88,
    reasoning: [
      "Services margin expansion accelerating",
      "Vision Pro developer ecosystem growing 500% QoQ",
      "AI integration across products creating lock-in effects",
      "China market recovery stronger than anticipated",
    ],
  },
];

export default function Research() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("insights");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const runNewAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  useEffect(() => {
    // Auto-start analysis when component mounts
    const timer = setTimeout(() => runNewAnalysis(), 500);
    return () => clearTimeout(timer);
  }, []);

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
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Research Lab
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-white/50 flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                AI Agents Active
              </Badge>
              <Button
                onClick={runNewAnalysis}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "New Analysis"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* AI Analysis Status */}
        {isAnalyzing && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold">
                  AI agents are optimizing feed...
                </span>
              </div>
              <Progress value={analysisProgress} className="h-2 mb-2" />
              <div className="text-sm text-muted-foreground">
                Processing market data, earnings reports, and sentiment
                analysis...
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Research Interface */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trend Scanner</TabsTrigger>
            <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
          </TabsList>

          {/* Market Insights */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              {mockInsights.map((insight) => (
                <Card
                  key={insight.id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            insight.type === "bullish"
                              ? "bg-green-500"
                              : insight.type === "bearish"
                                ? "bg-red-500"
                                : "bg-yellow-500",
                          )}
                        />
                        <div>
                          <h3 className="font-bold text-lg">{insight.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {insight.timeframe} outlook
                            {insight.sector && (
                              <>
                                •{" "}
                                <Badge variant="outline" className="text-xs">
                                  {insight.sector}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Confidence</div>
                        <div className="text-2xl font-bold text-primary">
                          {insight.confidence}%
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {insight.summary}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <Badge
                        variant={
                          insight.impact === "high"
                            ? "default"
                            : insight.impact === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {insight.impact.toUpperCase()} Impact
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Analysis */}
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-6">
              {mockAIAnalyses.map((analysis) => (
                <Card
                  key={analysis.id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        {analysis.title}
                      </CardTitle>
                      <Badge
                        className={cn(
                          analysis.recommendation === "buy"
                            ? "bg-green-100 text-green-800"
                            : analysis.recommendation === "sell"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800",
                        )}
                      >
                        {analysis.recommendation.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">
                          Current
                        </div>
                        <div className="text-xl font-bold">
                          ${analysis.currentPrice}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">
                          Target
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          ${analysis.targetPrice}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">
                          Confidence
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          {analysis.confidence}%
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">AI Analysis</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {analysis.analysis}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Reasoning</h4>
                      <ul className="space-y-1">
                        {analysis.reasoning.map((reason, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full" asChild>
                      <Link to={`/stock/${analysis.symbol}`}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View {analysis.symbol} Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trend Scanner */}
          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-Time Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Advanced Trend Scanner
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    AI models are analyzing patterns across 10,000+ securities
                    in real-time
                  </p>
                  <Button
                    onClick={runNewAnalysis}
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Scan for Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Alerts */}
          <TabsContent value="alerts" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Smart Alerts System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Intelligent Alert Engine
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get notified when AI detects significant market
                    opportunities or risks
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500">
                    <Target className="h-4 w-4 mr-2" />
                    Configure Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
