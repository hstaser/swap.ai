import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, TrendingUp, Settings, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/bottom-nav";
import NewsMonitor from "@/components/NewsMonitor";
import { useQueue } from "@/hooks/use-queue";

export default function NewsMonitoring() {
  const navigate = useNavigate();
  const { queue } = useQueue();
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "medium" | "low">("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-10 w-10 sm:h-9 sm:w-9"
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">
                    Market Intelligence
                  </h1>
                  <p className="text-xs text-gray-600 hidden sm:block">
                    AI-powered news monitoring for your portfolio
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {queue.length} stocks monitored
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Add settings functionality */}}
                className="h-8 px-3"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Market Monitoring</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{queue.length}</div>
                <div className="text-sm text-gray-600">Stocks Tracked</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">News Sources</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">AI</div>
                <div className="text-sm text-gray-600">Powered Analysis</div>
              </CardContent>
            </Card>
          </div>

          {/* Gaus-inspired description */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Your Personal AI Investment Analyst
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Like institutional investors, you now have AI analysts tracking markets 24/7, 
                filtering out noise, and delivering only the insights that matter for your portfolio. 
                Our system spots catalysts hours before they trend, explains the real drivers behind 
                price moves, and runs "what if" scenarios to test ideas before you act.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800">Real-time Monitoring</Badge>
                <Badge className="bg-green-100 text-green-800">Portfolio-specific</Badge>
                <Badge className="bg-purple-100 text-purple-800">AI-powered Analysis</Badge>
                <Badge className="bg-orange-100 text-orange-800">Institutional Quality</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Filter by Priority:</span>
                </div>
                <div className="flex gap-2">
                  {["all", "high", "medium", "low"].map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter as any)}
                      className="text-xs"
                    >
                      {filter === "all" ? "All" : `${filter.charAt(0).toUpperCase()}${filter.slice(1)} Priority`}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main News Monitor */}
          <NewsMonitor className="border-0 shadow-lg" />

          {/* Call to Action */}
          {queue.length === 0 && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Your Market Intelligence
                </h3>
                <p className="text-gray-600 mb-4">
                  Add stocks to your queue to begin receiving personalized market insights 
                  and news analysis tailored to your investment interests.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Browse Stocks
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
