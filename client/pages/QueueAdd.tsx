import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";

export default function QueueAdd() {
  const navigate = useNavigate();
  const { symbol } = useParams<{ symbol: string }>();
  const { addToQueue } = useQueue();
  const [selectedConfidence, setSelectedConfidence] = useState<string | null>(
    null,
  );

  // Mock stock data - in real app this would be fetched
  const stockData = {
    AAPL: {
      name: "Apple Inc.",
      price: 182.52,
      change: 2.31,
      changePercent: 1.28,
      sector: "Technology",
    },
    TSLA: {
      name: "Tesla, Inc.",
      price: 238.77,
      change: -8.32,
      changePercent: -3.37,
      sector: "Consumer Discretionary",
    },
    NVDA: {
      name: "NVIDIA Corporation",
      price: 722.48,
      change: 12.66,
      changePercent: 1.78,
      sector: "Technology",
    },
    MSFT: {
      name: "Microsoft Corporation",
      price: 378.85,
      change: -1.52,
      changePercent: -0.4,
      sector: "Technology",
    },
    AMZN: {
      name: "Amazon.com, Inc.",
      price: 144.05,
      change: 1.88,
      changePercent: 1.32,
      sector: "Consumer Discretionary",
    },
    GOOGL: {
      name: "Alphabet Inc.",
      price: 138.21,
      change: 3.45,
      changePercent: 2.56,
      sector: "Communication Services",
    },
  };

  const stock =
    symbol && symbol in stockData
      ? stockData[symbol as keyof typeof stockData]
      : null;

  if (!stock || !symbol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Stock Not Found</h1>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  const handleConfidenceSelect = (confidence: string) => {
    setSelectedConfidence(confidence);

    if (symbol) {
      addToQueue(
        symbol,
        confidence as "conservative" | "bullish" | "very-bullish",
      );
    }

    // Navigate back to main swiping
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const confidenceOptions = [
    {
      id: "conservative",
      label: "Conservative",
      description: "I'm cautiously optimistic about this stock",
      color: "border-yellow-200 text-yellow-700 hover:bg-yellow-50",
      allocation: "Small position (2-5%)",
    },
    {
      id: "bullish",
      label: "Bullish",
      description: "I'm confident in this stock's potential",
      color: "border-green-200 text-green-700 hover:bg-green-50",
      allocation: "Medium position (5-10%)",
    },
    {
      id: "very-bullish",
      label: "Very Bullish",
      description: "I'm very confident in this investment",
      color: "border-green-300 text-green-800 hover:bg-green-100",
      allocation: "Large position (10-15%)",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Add to Queue
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Stock Info */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <h2 className="font-bold text-foreground text-3xl">
                    {symbol}
                  </h2>
                  <Badge variant="outline" className="text-sm">
                    {stock.sector}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground font-medium">
                  {stock.name}
                </p>
                <div className="text-4xl font-bold text-foreground">
                  ${stock.price.toFixed(2)}
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center gap-2 text-lg font-semibold",
                    isPositive ? "text-success" : "text-destructive",
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Selection */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">
                How confident are you about {symbol}?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Your confidence level will help determine the position size when
                you're ready to optimize your portfolio.
              </p>

              <div className="space-y-3">
                {confidenceOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    onClick={() => handleConfidenceSelect(option.id)}
                    disabled={selectedConfidence === option.id}
                    className={cn(
                      "w-full h-auto p-4 text-left justify-start relative",
                      option.color,
                      selectedConfidence === option.id &&
                        "bg-green-100 border-green-400",
                    )}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-base">
                        {option.label}
                      </div>
                      <div className="text-sm opacity-80 mt-1">
                        {option.description}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {option.allocation}
                      </div>
                    </div>
                    {selectedConfidence === option.id && (
                      <CheckCircle className="h-5 w-5 text-green-600 absolute top-4 right-4" />
                    )}
                  </Button>
                ))}
              </div>

              {selectedConfidence && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">
                      Successfully added to queue!
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {symbol} has been added to your queue. Returning to stock
                    browsing...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cancel Button */}
          {!selectedConfidence && (
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="w-full text-muted-foreground"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
