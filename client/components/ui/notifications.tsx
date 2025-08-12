import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Mail,
  Smartphone,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Settings,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationDetails } from "./notification-details";

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

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  rebalanceAlerts: boolean;
  newsAlerts: boolean;
  portfolioChanges: boolean;
  aiInsights: boolean;
  marketAlerts: boolean;
  frequency: "immediate" | "daily" | "weekly";
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "ai_insight",
    title: "Diversification Opportunity Detected",
    message:
      "Your tech allocation (52%) is above optimal range. Consider reducing by 7% to improve risk-adjusted returns.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    read: false,
    priority: "high",
    actionUrl: "/portfolio/rebalance",
  },
  {
    id: "2",
    type: "ai_insight",
    title: "Risk Management Alert",
    message:
      "Market correlation has increased 23% this week. Your portfolio beta is now 1.34 - consider defensive positioning.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: false,
    priority: "medium",
    actionUrl: "/portfolio/rebalance",
  },
  {
    id: "3",
    type: "ai_insight",
    title: "Sector Rotation Opportunity",
    message:
      "Healthcare sector showing strength vs tech. Consider rotating 5% allocation for better performance.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    priority: "medium",
    actionUrl: "/portfolio/rebalance",
  },
  {
    id: "4",
    type: "rebalance",
    title: "Portfolio Rebalance Recommended",
    message:
      "Your portfolio has drifted from target allocation. AI suggests rebalancing AAPL and adding defensive positions.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: true,
    priority: "high",
    actionUrl: "/portfolio/rebalance",
  },
  {
    id: "5",
    type: "news",
    title: "AAPL Earnings Beat Expected",
    message:
      "Apple reported strong quarterly earnings. Consider adjusting your position based on positive momentum.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: true,
    priority: "medium",
    symbol: "AAPL",
    actionUrl: "/stock/AAPL/news",
  },
  {
    id: "6",
    type: "portfolio",
    title: "Dividend Payment Received",
    message:
      "You received $47.50 in dividends from JNJ. Amount has been added to your cash balance.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: "low",
    symbol: "JNJ",
    actionUrl: "/portfolio",
  },
];

interface NotificationSystemProps {
  className?: string;
  showPreferences?: boolean;
  onPreferencesChange?: (prefs: NotificationPreferences) => void;
}

export function NotificationSystem({
  className,
  showPreferences = false,
  onPreferencesChange,
}: NotificationSystemProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: true,
    emailEnabled: true,
    inAppEnabled: true,
    rebalanceAlerts: true,
    newsAlerts: true,
    portfolioChanges: true,
    aiInsights: true,
    marketAlerts: true,
    frequency: "immediate",
  });
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "high":
        return notification.priority === "high";
      default:
        return true;
    }
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    onPreferencesChange?.(newPrefs);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "rebalance":
        return <BarChart3 className="h-4 w-4" />;
      case "news":
        return <Info className="h-4 w-4" />;
      case "portfolio":
        return <DollarSign className="h-4 w-4" />;
      case "ai_insight":
        return <TrendingUp className="h-4 w-4" />;
      case "market_alert":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (showPreferences) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delivery Methods */}
          <div className="space-y-4">
            <h3 className="font-medium">
              How would you like to receive notifications?
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <Label htmlFor="push">Push Notifications</Label>
                </div>
                <Switch
                  id="push"
                  checked={preferences.pushEnabled}
                  onCheckedChange={(checked) =>
                    updatePreference("pushEnabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label htmlFor="email">Email Notifications</Label>
                </div>
                <Switch
                  id="email"
                  checked={preferences.emailEnabled}
                  onCheckedChange={(checked) =>
                    updatePreference("emailEnabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="inapp">In-App Notifications</Label>
                </div>
                <Switch
                  id="inapp"
                  checked={preferences.inAppEnabled}
                  onCheckedChange={(checked) =>
                    updatePreference("inAppEnabled", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="font-medium">
              What notifications would you like to receive?
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="rebalance">Portfolio Rebalance Alerts</Label>
                <Switch
                  id="rebalance"
                  checked={preferences.rebalanceAlerts}
                  onCheckedChange={(checked) =>
                    updatePreference("rebalanceAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="news">News About Holdings</Label>
                <Switch
                  id="news"
                  checked={preferences.newsAlerts}
                  onCheckedChange={(checked) =>
                    updatePreference("newsAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="portfolio">Portfolio Changes</Label>
                <Switch
                  id="portfolio"
                  checked={preferences.portfolioChanges}
                  onCheckedChange={(checked) =>
                    updatePreference("portfolioChanges", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ai">AI Insights</Label>
                <Switch
                  id="ai"
                  checked={preferences.aiInsights}
                  onCheckedChange={(checked) =>
                    updatePreference("aiInsights", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="market">Market Alerts</Label>
                <Switch
                  id="market"
                  checked={preferences.marketAlerts}
                  onCheckedChange={(checked) =>
                    updatePreference("marketAlerts", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-4">
            <Label htmlFor="frequency">Notification Frequency</Label>
            <Select
              value={preferences.frequency}
              onValueChange={(value) =>
                updatePreference("frequency", value as any)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter as any}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>

            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No notifications to show</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 border rounded-lg transition-colors cursor-pointer",
                  !notification.read && "bg-blue-50 border-blue-200",
                  notification.read && "hover:bg-gray-50",
                )}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                  setSelectedNotification(notification);
                  setShowDetails(true);
                }}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full",
                    getPriorityColor(notification.priority),
                  )}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4
                        className={cn(
                          "font-medium text-sm",
                          !notification.read && "font-semibold",
                        )}
                      >
                        {notification.title}
                        {notification.symbol && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {notification.symbol}
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.timestamp)}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getPriorityColor(notification.priority),
                          )}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {notification.actionUrl && (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 p-0 h-auto"
                      onClick={() => window.location.href = notification.actionUrl!}
                    >
                      {notification.type === "rebalance" || notification.type === "ai_insight"
                        ? "Rebalance Portfolio →"
                        : notification.type === "portfolio"
                        ? "View Portfolio →"
                        : "View Details →"
                      }
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>

    <NotificationDetails
      notification={selectedNotification}
      isOpen={showDetails}
      onClose={() => {
        setShowDetails(false);
        setSelectedNotification(null);
      }}
      onMarkAsRead={markAsRead}
    />
    </>
  );
}
