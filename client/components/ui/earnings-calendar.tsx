import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EarningsEvent {
  symbol: string;
  company: string;
  date: string;
  time: "Pre-market" | "After-market" | "During";
  estimate?: number;
  inPortfolio: boolean;
  inWatchlist: boolean;
  importance: "high" | "medium" | "low";
  alertEnabled: boolean;
}

interface EarningsCalendarProps {
  events?: EarningsEvent[];
  onToggleAlert?: (symbol: string) => void;
  onStockSelect?: (symbol: string) => void;
  className?: string;
}

const mockEarningsEvents: EarningsEvent[] = [
  {
    symbol: "AAPL",
    company: "Apple Inc.",
    date: "2025-01-30",
    time: "After-market",
    estimate: 2.18,
    inPortfolio: true,
    inWatchlist: false,
    importance: "high",
    alertEnabled: true,
  },
  {
    symbol: "MSFT",
    company: "Microsoft Corporation",
    date: "2025-01-28",
    time: "After-market",
    estimate: 2.78,
    inPortfolio: true,
    inWatchlist: false,
    importance: "high",
    alertEnabled: true,
  },
  {
    symbol: "GOOGL",
    company: "Alphabet Inc.",
    date: "2025-01-31",
    time: "After-market",
    estimate: 1.45,
    inPortfolio: false,
    inWatchlist: true,
    importance: "medium",
    alertEnabled: false,
  },
  {
    symbol: "TSLA",
    company: "Tesla, Inc.",
    date: "2025-01-29",
    time: "After-market",
    estimate: 0.78,
    inPortfolio: false,
    inWatchlist: true,
    importance: "high",
    alertEnabled: true,
  },
  {
    symbol: "AMZN",
    company: "Amazon.com Inc.",
    date: "2025-02-03",
    time: "After-market",
    estimate: 0.85,
    inPortfolio: false,
    inWatchlist: false,
    importance: "medium",
    alertEnabled: false,
  },
];

const importanceColors = {
  high: "bg-red-100 text-red-700 border-red-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  low: "bg-blue-100 text-blue-700 border-blue-300",
};

const timeColors = {
  "Pre-market": "text-blue-600",
  "After-market": "text-purple-600",
  "During": "text-green-600",
};

export function EarningsCalendar({
  events = mockEarningsEvents,
  onToggleAlert,
  onStockSelect,
  className
}: EarningsCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, EarningsEvent[]>);

  const sortedDates = Object.keys(eventsByDate).sort();

  // Filter to show only upcoming events
  const today = new Date().toISOString().split('T')[0];
  const upcomingDates = sortedDates.filter(date => date >= today);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === today.toISOString().split('T')[0]) return "Today";
    if (dateStr === tomorrow.toISOString().split('T')[0]) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const portfolioEvents = events.filter(e => e.inPortfolio);
  const watchlistEvents = events.filter(e => e.inWatchlist);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Earnings Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 px-2 text-xs"
            >
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="h-7 px-2 text-xs"
            >
              Calendar
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>{portfolioEvents.length} in portfolio</span>
          <span>{watchlistEvents.length} in watchlist</span>
          <span>{events.filter(e => e.alertEnabled).length} alerts on</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {viewMode === "list" ? (
          <div className="space-y-4">
            {upcomingDates.slice(0, 7).map((date) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-sm text-gray-900">
                    {formatDate(date)}
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    {eventsByDate[date].length} companies
                  </div>
                </div>

                <div className="space-y-2">
                  {eventsByDate[date]
                    .sort((a, b) => {
                      // Sort by portfolio first, then watchlist, then importance
                      if (a.inPortfolio && !b.inPortfolio) return -1;
                      if (!a.inPortfolio && b.inPortfolio) return 1;
                      if (a.inWatchlist && !b.inWatchlist) return -1;
                      if (!a.inWatchlist && b.inWatchlist) return 1;
                      return a.importance === "high" ? -1 : 1;
                    })
                    .map((event) => (
                      <EarningsEventCard
                        key={event.symbol}
                        event={event}
                        onToggleAlert={onToggleAlert}
                        onStockSelect={onStockSelect}
                      />
                    ))}
                </div>
              </div>
            ))}

            {upcomingDates.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming earnings</p>
              </div>
            )}
          </div>
        ) : (
          // Calendar view (simplified)
          <div className="grid grid-cols-7 gap-1 text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            {/* Calendar grid would go here */}
            <div className="col-span-7 text-center py-4 text-muted-foreground">
              Calendar view coming soon
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EarningsEventCard({
  event,
  onToggleAlert,
  onStockSelect
}: {
  event: EarningsEvent;
  onToggleAlert?: (symbol: string) => void;
  onStockSelect?: (symbol: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {/* Company Info */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => onStockSelect?.(event.symbol)}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono font-bold text-sm">{event.symbol}</span>

          {/* Status Badges */}
          {event.inPortfolio && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
              Portfolio
            </Badge>
          )}
          {event.inWatchlist && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              Watchlist
            </Badge>
          )}

          <Badge
            className={cn("text-xs", importanceColors[event.importance])}
            variant="outline"
          >
            {event.importance}
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground mb-1">
          {event.company}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className={timeColors[event.time]}>
            <Clock className="h-3 w-3 inline mr-1" />
            {event.time}
          </span>
          {event.estimate && (
            <span className="text-muted-foreground">
              Est: ${event.estimate}
            </span>
          )}
        </div>
      </div>

      {/* Alert Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleAlert?.(event.symbol)}
        className="h-8 w-8 p-0"
      >
        {event.alertEnabled ? (
          <Bell className="h-3 w-3 text-blue-600" />
        ) : (
          <BellOff className="h-3 w-3 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}

// Risk intervention for earnings
export function generateEarningsIntervention(symbol: string, date: string) {
  const isToday = date === new Date().toISOString().split('T')[0];
  const isTomorrow = date === new Date(Date.now() + 86400000).toISOString().split('T')[0];

  if (isToday || isTomorrow) {
    return {
      id: `earnings_${symbol}`,
      type: "protective" as const,
      severity: "high" as const,
      title: `Earnings ${isTomorrow ? "tomorrow" : "today"}`,
      message: `${symbol} reports earnings ${isTomorrow ? "tomorrow" : "today"} — want to wait and review after that?`,
      context: {
        symbol,
        timeframe: isTomorrow ? "tomorrow" : "today"
      },
      actions: [
        {
          label: "Wait for Earnings",
          type: "primary" as const,
          action: () => console.log("Wait for earnings")
        },
        {
          label: "Buy Now Anyway",
          type: "secondary" as const,
          action: () => console.log("Buy anyway")
        },
        {
          label: "Set Reminder",
          type: "dismiss" as const,
          action: () => console.log("Set reminder")
        },
      ],
      dismissible: true,
    };
  }

  return null;
}
