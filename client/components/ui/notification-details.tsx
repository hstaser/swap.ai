import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Info,
  DollarSign,
  Brain,
  ArrowRight,
  X,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: "rebalance" | "news" | "portfolio" | "ai_insight" | "market_alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  symbol?: string;
}

interface NotificationDetailsProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const getNotificationDetails = (notification: Notification) => {
  switch (notification.type) {
    case "rebalance":
      return {
        icon: <BarChart3 className="h-6 w-6 text-orange-600" />,
        color: "orange",
        details: {
          currentAllocation: [
            { sector: "Technology", current: 45, target: 30, difference: +15 },
            { sector: "Healthcare", current: 12, target: 20, difference: -8 },
            { sector: "Financial Services", current: 23, target: 25, difference: -2 },
            { sector: "Consumer Staples", current: 20, target: 25, difference: -5 },
          ],
          riskIncrease: "+12%",
          correlationIncrease: "+8.3%",
          recommendation: "Reduce technology exposure and increase healthcare allocation for better risk-adjusted returns."
        }
      };

    case "news":
      return {
        icon: <Info className="h-6 w-6 text-blue-600" />,
        color: "blue",
        details: {
          symbol: notification.symbol || "AAPL",
          earnings: {
            reported: "$1.64",
            expected: "$1.60",
            beat: "$0.04",
            revenue: "$89.5B",
            guidance: "Raised for Q1 2025"
          },
          impact: "+3.2%",
          positionValue: "$1,247",
          recommendation: "Strong quarter validates our investment thesis. Consider maintaining position."
        }
      };

    case "ai_insight":
      return {
        icon: <Brain className="h-6 w-6 text-purple-600" />,
        color: "purple",
        details: {
          analysis: "Market trends show increasing correlation between tech stocks, reducing portfolio diversification benefits.",
          suggestion: "Reduce tech sector weight from 45% to 35% and increase exposure to defensive sectors.",
          confidence: "82%",
          backtestResults: "+1.7% annual return, -15% volatility",
          timeframe: "Based on 10-year historical analysis"
        }
      };

    case "portfolio":
      return {
        icon: <DollarSign className="h-6 w-6 text-green-600" />,
        color: "green",
        details: {
          symbol: notification.symbol || "JNJ",
          dividendAmount: "$47.50",
          dividendYield: "3.1%",
          exDate: "Dec 15, 2024",
          paymentDate: "Dec 30, 2024",
          totalShares: 32,
          newCashBalance: "$5,297.50"
        }
      };

    case "market_alert":
      return {
        icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
        color: "red",
        details: {
          alertType: "High Volatility",
          vixLevel: "28.5",
          marketMove: "-2.8%",
          portfolioImpact: "-$892",
          riskLevel: "Elevated",
          recommendation: "Consider reducing position sizes or adding defensive allocations."
        }
      };

    default:
      return {
        icon: <Info className="h-6 w-6 text-gray-600" />,
        color: "gray",
        details: {}
      };
  }
};

export function NotificationDetails({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
}: NotificationDetailsProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (!notification) return;

    // Handle different action types based on notification type
    switch (notification.type) {
      case "rebalance":
        navigate("/portfolio/rebalance");
        break;
      case "news":
        if (notification.symbol) {
          navigate(`/stock/${notification.symbol}`);
        } else {
          navigate("/research");
        }
        break;
      case "ai_insight":
        navigate("/research");
        break;
      case "portfolio":
        navigate("/portfolio");
        break;
      case "market_alert":
        navigate("/markets");
        break;
      default:
        // Fallback to actionUrl if available
        if (notification.actionUrl) {
          navigate(notification.actionUrl);
        } else {
          navigate("/");
        }
    }
    onClose();
  };

  if (!notification) return null;

  const details = getNotificationDetails(notification);

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {details.icon}
            <div>
              <DialogTitle className="text-lg">{notification.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {new Date(notification.timestamp).toLocaleString()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Message */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm leading-relaxed">{notification.message}</p>
          </div>

          {/* Detailed Information */}
          {notification.type === "rebalance" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Current vs Target Allocation</h3>
              <div className="space-y-3">
                {details.details.currentAllocation?.map((allocation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{allocation.sector}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {allocation.current}% → {allocation.target}%
                      </span>
                      <Badge
                        variant={allocation.difference > 0 ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {allocation.difference > 0 ? "+" : ""}{allocation.difference}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Risk Impact:</strong> Portfolio risk increased by {details.details.riskIncrease}
                </p>
                <p className="text-sm text-orange-700 mt-2">
                  {details.details.recommendation}
                </p>
              </div>
            </div>
          )}

          {notification.type === "news" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Earnings Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded">
                  <div className="text-sm text-muted-foreground">EPS Reported</div>
                  <div className="font-bold text-green-700">{details.details.earnings?.reported}</div>
                  <div className="text-xs text-green-600">Beat by {details.details.earnings?.beat}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="text-sm text-muted-foreground">Revenue</div>
                  <div className="font-bold text-blue-700">{details.details.earnings?.revenue}</div>
                  <div className="text-xs text-blue-600">{details.details.earnings?.guidance}</div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Your Position:</strong> Up {details.details.impact} (+{details.details.positionValue})
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  {details.details.recommendation}
                </p>
              </div>
            </div>
          )}

          {notification.type === "ai_insight" && (
            <div className="space-y-4">
              <h3 className="font-semibold">AI Analysis</h3>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800 mb-3">{details.details.analysis}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600 font-medium">Confidence:</span> {details.details.confidence}
                  </div>
                  <div>
                    <span className="text-purple-600 font-medium">Expected Benefit:</span> {details.details.backtestResults}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded">
                <p className="text-sm font-medium text-purple-800">Recommendation:</p>
                <p className="text-sm text-purple-700">{details.details.suggestion}</p>
              </div>
            </div>
          )}

          {notification.type === "portfolio" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Dividend Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded">
                  <div className="text-sm text-muted-foreground">Amount Received</div>
                  <div className="font-bold text-green-700">{details.details.dividendAmount}</div>
                  <div className="text-xs text-green-600">From {details.details.totalShares} shares</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="text-sm text-muted-foreground">Annual Yield</div>
                  <div className="font-bold text-blue-700">{details.details.dividendYield}</div>
                  <div className="text-xs text-blue-600">Quarterly payment</div>
                </div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>New Cash Balance:</strong> {details.details.newCashBalance}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Payment Date: {details.details.paymentDate}
                </p>
              </div>
            </div>
          )}

          {notification.type === "market_alert" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Market Alert Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-sm text-muted-foreground">VIX Level</div>
                  <div className="font-bold text-red-700">{details.details.vixLevel}</div>
                </div>
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-sm text-muted-foreground">Market Move</div>
                  <div className="font-bold text-red-700">{details.details.marketMove}</div>
                </div>
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-sm text-muted-foreground">Portfolio Impact</div>
                  <div className="font-bold text-red-700">{details.details.portfolioImpact}</div>
                </div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Risk Level:</strong> {details.details.riskLevel}
                </p>
                <p className="text-sm text-red-700 mt-2">
                  {details.details.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {!notification.read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAsRead}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {notification.actionUrl && (
                <Button onClick={handleAction}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Take Action
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
