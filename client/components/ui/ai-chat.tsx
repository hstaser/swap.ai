import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAIAgent } from "@/hooks/use-ai-agent";
import {
  Bot,
  User,
  Send,
  X,
  Lightbulb,
  TrendingUp,
  Shield,
  Target,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickQuestions = [
  "What should I buy?",
  "How risky am I?",
  "Analyze my portfolio",
  "Clone Nancy Pelosi's portfolio",
  "Create Apple competitors queue",
  "Rebalance my holdings",
];

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getInsights } = useAIAgent();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content: "Hi! I'm your AI investment assistant. I can analyze your portfolio, suggest investments, create custom queues, or even clone strategies from successful investors. What would you like to explore?",
          timestamp: new Date(),
          suggestions: quickQuestions.slice(0, 3),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Mock AI responses based on user input
    const insights = getInsights();

    if (userMessage.toLowerCase().includes("what should i buy") || userMessage.toLowerCase().includes("recommend")) {
      return `Based on your preferences for ${insights.topSectors.join(", ")} and ${insights.riskPreference} risk stocks, I'd recommend:\n\n• Looking for undervalued stocks in ${insights.topSectors[0]}\n• Consider diversifying into Consumer Staples for stability\n• Check out dividend-paying stocks for income\n\nWould you like specific stock suggestions?`;
    }

    if (userMessage.toLowerCase().includes("risky") || userMessage.toLowerCase().includes("risk")) {
      return `Your risk profile shows:\n\n• Preference for ${insights.riskPreference} risk stocks\n• Heavy focus on ${insights.topSectors.slice(0, 2).join(" and ")}\n• ${insights.totalSwipes} total investment decisions\n\nYou're currently ${insights.riskPreference === "High" ? "aggressive" : insights.riskPreference === "Low" ? "conservative" : "moderate"} in your approach. Want to adjust?`;
    }

    if (userMessage.toLowerCase().includes("hedge") || userMessage.toLowerCase().includes("protect")) {
      return `To hedge your current portfolio:\n\n• Consider defensive sectors like Utilities or Consumer Staples\n• Look into bonds or treasury funds\n• Add some inverse ETFs for downside protection\n• Diversify across market caps (small, mid, large)\n\nWhat specific risks are you most concerned about?`;
    }

    if (userMessage.toLowerCase().includes("portfolio") || userMessage.toLowerCase().includes("analyze")) {
      return `Portfolio Analysis:\n\n• Sector Focus: ${insights.topSectors.join(", ")}\n• Risk Level: ${insights.riskPreference}\n• Activity: ${insights.totalSwipes} decisions made\n• Streak: ${insights.streakDays} days\n\nStrengths: Clear sector preferences\nOpportunities: Consider more diversification\n\nWant detailed recommendations?`;
    }

    if (userMessage.toLowerCase().includes("rebalance") || userMessage.toLowerCase().includes("balance")) {
      return `Rebalancing suggestions:\n\n• Your ${insights.topSectors[0]} allocation might be high\n• Consider adding exposure to Healthcare or Financials\n• Review positions older than 6 months\n• Take profits on winners, add to underweight sectors\n\nShall I create a rebalancing plan for you?`;
    }

    if (userMessage.toLowerCase().includes("strategy")) {
      return `Your investment strategy appears to be:\n\n• Growth-focused with ${insights.topSectors[0]} emphasis\n• ${insights.riskPreference} risk tolerance\n• Active decision making (${insights.totalSwipes} swipes)\n\nThis aligns with a ${insights.riskPreference === "High" ? "aggressive growth" : "balanced growth"} approach. Want to refine it further?`;
    }

    return "I'd be happy to help! You can ask me about:\n\n• Investment recommendations\n• Risk analysis\n• Portfolio review\n• Hedging strategies\n• Rebalancing advice\n\nWhat specific area interests you most?";
  };

  const handleSend = async (message?: string) => {
    const messageToSend = message || input.trim();
    if (!messageToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateAIResponse(messageToSend);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
        suggestions: response.includes("?") ? quickQuestions.slice(3, 6) : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Assistant
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>

                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSend(suggestion)}
                            className="h-6 px-2 text-xs bg-white/90 hover:bg-white"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.type === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t px-6 py-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your investments..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
