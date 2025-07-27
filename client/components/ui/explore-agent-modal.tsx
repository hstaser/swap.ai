import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  MessageCircle,
  HelpCircle,
  BarChart3,
  Shield,
  TrendingUp,
  Target,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickQuestion {
  id: string;
  question: string;
  category: "risk" | "portfolio" | "strategy" | "market";
  answer: string;
  followUp?: string[];
}

interface ExploreAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol?: string;
}

const categoryIcons = {
  risk: Shield,
  portfolio: BarChart3,
  strategy: Target,
  market: TrendingUp,
};

const categoryColors = {
  risk: "bg-red-50 text-red-700 border-red-200",
  portfolio: "bg-blue-50 text-blue-700 border-blue-200",
  strategy: "bg-purple-50 text-purple-700 border-purple-200", 
  market: "bg-green-50 text-green-700 border-green-200",
};

const quickQuestions: QuickQuestion[] = [
  {
    id: "portfolio_risk",
    question: "How risky is my portfolio?",
    category: "risk",
    answer: "Your portfolio has a moderate risk level. You're 65% in growth stocks and 35% in defensive positions. This matches your moderate risk tolerance well.",
    followUp: ["What makes it risky?", "How can I reduce risk?", "Compare to market"],
  },
  {
    id: "diversification",
    question: "Am I diversified enough?",
    category: "portfolio", 
    answer: "You're well-diversified across 6 sectors, but heavy in Technology (45%). Adding Healthcare or Utilities would improve balance.",
    followUp: ["Which sectors to add?", "How much to rebalance?", "Best defensive stocks"],
  },
  {
    id: "performance",
    question: "How is my portfolio performing?",
    category: "portfolio",
    answer: "You're up 12.3% this year vs 9.8% for the S&P 500. Your tech holdings are driving outperformance, but watch concentration risk.",
    followUp: ["What's driving performance?", "Should I take profits?", "Compare to benchmarks"],
  },
  {
    id: "market_outlook",
    question: "What's happening in the market?",
    category: "market",
    answer: "Markets are mixed with tech leading and banks lagging. Your portfolio is positioned well for continued tech strength but vulnerable to rotation.",
    followUp: ["Should I adjust?", "What sectors look good?", "Recession signals?"],
  },
  {
    id: "next_moves",
    question: "What should I buy next?",
    category: "strategy",
    answer: "Based on your preferences, consider JPM for financials exposure or JNJ for healthcare. Both would improve diversification.",
    followUp: ["Why these stocks?", "How much to invest?", "When to buy?"],
  },
  {
    id: "stock_specific",
    question: "Tell me about this stock",
    category: "strategy",
    answer: "AAPL is a quality company but represents 15% of your portfolio. Consider trimming to 10-12% and diversifying into other sectors.",
    followUp: ["Why trim?", "What to buy instead?", "Price targets?"],
  },
];

export function ExploreAgentModal({ isOpen, onClose, stockSymbol }: ExploreAgentModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<QuickQuestion | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!isOpen) return null;

  const handleQuestionClick = (question: QuickQuestion) => {
    setSelectedQuestion(question);
    setShowAnswer(true);
  };

  const handleBack = () => {
    setShowAnswer(false);
    setSelectedQuestion(null);
  };

  const filteredQuestions = stockSymbol 
    ? quickQuestions.filter(q => q.id === "stock_specific" || q.category === "risk")
    : quickQuestions.filter(q => q.id !== "stock_specific");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            {showAnswer && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold">
                  {showAnswer ? "Quick Answer" : "Ask Your Assistant"}
                </h2>
                {stockSymbol && !showAnswer && (
                  <p className="text-xs text-muted-foreground">About {stockSymbol}</p>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {!showAnswer ? (
            // Question Selection
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                {stockSymbol 
                  ? `Quick questions about ${stockSymbol} and your portfolio:`
                  : "What would you like to know about your investments?"
                }
              </p>
              
              <div className="space-y-3">
                {filteredQuestions.map((question) => {
                  const IconComponent = categoryIcons[question.category];
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(question)}
                      className="w-full p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 group-hover:text-blue-900">
                            {stockSymbol && question.id === "stock_specific" 
                              ? `Tell me about ${stockSymbol}`
                              : question.question
                            }
                          </p>
                          <Badge 
                            className={cn("text-xs mt-1", categoryColors[question.category])}
                            variant="outline"
                          >
                            {question.category}
                          </Badge>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Answer Display
            selectedQuestion && (
              <div className="space-y-4">
                {/* Question */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Your Question</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {stockSymbol && selectedQuestion.id === "stock_specific" 
                      ? `Tell me about ${stockSymbol}`
                      : selectedQuestion.question
                    }
                  </p>
                </div>

                {/* Answer */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Quick Answer</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedQuestion.answer}
                  </p>
                </div>

                {/* Follow-up Questions */}
                {selectedQuestion.followUp && selectedQuestion.followUp.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Follow-up questions:</h4>
                    <div className="space-y-2">
                      {selectedQuestion.followUp.map((followUp, index) => (
                        <button
                          key={index}
                          className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 group-hover:text-blue-700">
                              {followUp}
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 pt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">
              Need more detailed analysis? 
            </p>
            <Button variant="outline" size="sm" className="text-xs">
              Schedule a review call
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
