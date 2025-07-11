import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Play,
  CheckCircle,
  Clock,
  Star,
  X,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed: boolean;
  steps: number;
}

interface Article {
  title: string;
  summary: string;
  readTime: string;
  category: string;
  rating: number;
  isNew?: boolean;
}

const faqItems: FAQItem[] = [
  {
    question: "How does the portfolio optimization work?",
    answer:
      "Our optimization engine uses Modern Portfolio Theory to calculate the most efficient allocation of your investments. It considers expected returns, volatility, and correlations between assets to maximize your risk-adjusted returns based on your risk tolerance and investment goals.",
    category: "Portfolio",
    helpful: 94,
  },
  {
    question: "What is the Sharpe ratio and why is it important?",
    answer:
      "The Sharpe ratio measures risk-adjusted returns by comparing your portfolio's excess return to its volatility. A higher Sharpe ratio indicates better risk-adjusted performance. Generally, a Sharpe ratio above 1.0 is considered good, above 2.0 is very good, and above 3.0 is excellent.",
    category: "Metrics",
    helpful: 87,
  },
  {
    question: "How often should I rebalance my portfolio?",
    answer:
      "We recommend rebalancing when any asset allocation drifts more than 5% from your target allocation, or at least quarterly. Our auto-rebalancing feature can handle this automatically based on your preferences in settings.",
    category: "Strategy",
    helpful: 91,
  },
  {
    question: "What data sources do you use for stock information?",
    answer:
      "We aggregate data from multiple reliable financial data providers including major exchanges, regulatory filings, and professional financial data services. All data is updated in real-time during market hours and includes comprehensive fundamental and technical metrics.",
    category: "Data",
    helpful: 82,
  },
  {
    question: "How do I interpret the risk score?",
    answer:
      "Our risk score ranges from 1-100, where 1 is extremely conservative and 100 is extremely aggressive. It's calculated based on portfolio volatility, beta, maximum drawdown, and asset allocation. A score of 50-70 is typically considered moderate risk.",
    category: "Risk",
    helpful: 89,
  },
];

const tutorials: Tutorial[] = [
  {
    id: "getting-started",
    title: "Getting Started with swap.ai",
    description: "Learn the basics of navigating and using the app",
    duration: "8 min",
    difficulty: "Beginner",
    completed: true,
    steps: 6,
  },
  {
    id: "portfolio-building",
    title: "Building Your First Portfolio",
    description: "Step-by-step guide to creating an optimized portfolio",
    duration: "12 min",
    difficulty: "Beginner",
    completed: false,
    steps: 8,
  },
  {
    id: "risk-management",
    title: "Understanding Risk Management",
    description:
      "Learn about different types of investment risk and how to manage them",
    duration: "15 min",
    difficulty: "Intermediate",
    completed: false,
    steps: 10,
  },
  {
    id: "advanced-analytics",
    title: "Advanced Portfolio Analytics",
    description: "Deep dive into performance metrics and analysis tools",
    duration: "20 min",
    difficulty: "Advanced",
    completed: false,
    steps: 12,
  },
  {
    id: "tax-optimization",
    title: "Tax-Efficient Investing",
    description: "Strategies for minimizing tax impact on your investments",
    duration: "18 min",
    difficulty: "Intermediate",
    completed: false,
    steps: 9,
  },
];

const articles: Article[] = [
  {
    title: "Understanding Market Volatility",
    summary:
      "Learn how market volatility affects your investments and strategies to manage it",
    readTime: "5 min",
    category: "Education",
    rating: 4.8,
    isNew: true,
  },
  {
    title: "Diversification Best Practices",
    summary:
      "How to properly diversify your portfolio across different asset classes and sectors",
    readTime: "7 min",
    category: "Strategy",
    rating: 4.9,
  },
  {
    title: "Dollar-Cost Averaging Explained",
    summary:
      "The benefits and drawbacks of dollar-cost averaging as an investment strategy",
    readTime: "4 min",
    category: "Strategy",
    rating: 4.6,
  },
  {
    title: "Reading Financial Statements",
    summary: "A beginner's guide to understanding company financial statements",
    readTime: "10 min",
    category: "Education",
    rating: 4.7,
  },
];

interface HelpSystemProps {
  onClose: () => void;
}

export function HelpSystem({ onClose }: HelpSystemProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would submit to backend
    console.log("Email submitted:", emailForm);
    setShowEmailForm(false);
    setEmailForm({ name: "", email: "", subject: "", message: "" });
    // Show success message or notification
  };

  const handleLiveChat = () => {
    navigate("/research");
    onClose();
  };

  const handleArticleClick = (articleTitle: string) => {
    // Open external articles - these would be real URLs in production
    const articleUrls: Record<string, string> = {
      "Getting Started with Stock Investing":
        "https://www.investopedia.com/articles/basics/06/invest1000.asp",
      "Understanding Risk and Diversification":
        "https://www.investopedia.com/terms/d/diversification.asp",
      "Reading Financial Statements":
        "https://www.investopedia.com/articles/fundamental-analysis/09/five-must-have-metrics-value-investors.asp",
      "Dollar-Cost Averaging Strategy":
        "https://www.investopedia.com/terms/d/dollarcostaveraging.asp",
    };

    const url = articleUrls[articleTitle] || "https://www.investopedia.com/";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-white overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="faq" className="h-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent
              value="faq"
              className="p-6 max-h-[70vh] overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3">
                  {filteredFAQs.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setSelectedFAQ(
                            selectedFAQ === item.question
                              ? null
                              : item.question,
                          )
                        }
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium mb-1">
                              {item.question}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {item.helpful}% found helpful
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              selectedFAQ === item.question && "rotate-90",
                            )}
                          />
                        </div>
                      </button>
                      {selectedFAQ === item.question && (
                        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent
              value="tutorials"
              className="p-6 max-h-[70vh] overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Interactive Tutorials</span>
                </div>

                {tutorials.map((tutorial) => (
                  <Card
                    key={tutorial.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {tutorial.completed ? (
                            <CheckCircle className="h-6 w-6 text-success" />
                          ) : (
                            <Play className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{tutorial.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={getDifficultyColor(
                                  tutorial.difficulty,
                                )}
                              >
                                {tutorial.difficulty}
                              </Badge>
                              {tutorial.completed && (
                                <Badge variant="secondary" className="text-xs">
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {tutorial.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {tutorial.duration}
                            </div>
                            <div>{tutorial.steps} steps</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent
              value="articles"
              className="p-6 max-h-[70vh] overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Educational Articles</span>
                </div>

                {articles.map((article, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold flex-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {article.isNew && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-muted-foreground">
                            {article.rating}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent
              value="contact"
              className="p-6 max-h-[70vh] overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Need More Help?
                  </h3>
                  <p className="text-muted-foreground">
                    Our support team is here to help you succeed with your
                    investments.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h4 className="font-semibold mb-2">Live Chat</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get instant help from our support team
                      </p>
                      <Button className="w-full">Start Chat</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <ExternalLink className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h4 className="font-semibold mb-2">Email Support</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Send us your questions via email
                      </p>
                      <Button variant="outline" className="w-full">
                        Send Email
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Quick Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use the search function to quickly find stocks</li>
                    <li>• Enable auto-rebalancing for hands-off investing</li>
                    <li>• Check your portfolio performance regularly</li>
                    <li>
                      • Adjust your risk tolerance as your situation changes
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
