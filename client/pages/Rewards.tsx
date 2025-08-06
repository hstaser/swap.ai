import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Brain,
  Share2,
  Flame,
  Target,
  Trophy,
  Gift,
  Sparkles,
  Lock,
  CheckCircle,
  Crown,
  Calendar,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface RewardTier {
  tier: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirements: string[];
  rewards: string[];
  unlocked: boolean;
  progress?: number;
}

interface UserStats {
  friendsInvited: number;
  aum: number;
  loginStreak: number;
  portfolioValue: number;
  totalTrades: number;
  aiSearches: number;
}

export default function Rewards() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "tiers" | "friends">("overview");

  // Mock user stats
  const userStats: UserStats = {
    friendsInvited: 3,
    aum: 5250,
    loginStreak: 12,
    portfolioValue: 8400,
    totalTrades: 15,
    aiSearches: 45,
  };

  const rewardTiers: RewardTier[] = [
    {
      tier: 1,
      title: "Welcome Bonus",
      description: "Get started with swipr.ai",
      icon: <Gift className="h-5 w-5" />,
      requirements: ["Complete profile", "Make first stock selection"],
      rewards: ["$5 stock credit", "Basic AI search (20/day)"],
      unlocked: true,
    },
    {
      tier: 2,
      title: "First Steps",
      description: "Start building your portfolio",
      icon: <Target className="h-5 w-5" />,
      requirements: ["Invite 1 friend OR $100 AUM", "2-day login streak"],
      rewards: ["Advanced stock filters", "Enhanced dashboards"],
      unlocked: true,
      progress: 100,
    },
    {
      tier: 3,
      title: "Active Trader",
      description: "Build your investing routine",
      icon: <Users className="h-5 w-5" />,
      requirements: ["Queue 5 stocks OR $200 AUM", "Complete 1 trade"],
      rewards: ["Premium AI search (unlimited)", "Friend leaderboards", "Priority queue processing"],
      unlocked: false,
      progress: 80,
    },
    {
      tier: 4,
      title: "Growth Focused",
      description: "Scaling your investments",
      icon: <TrendingUp className="h-5 w-5" />,
      requirements: ["Invite 2 friends OR $500 AUM", "5-day activity streak"],
      rewards: ["Early access to new features", "AI portfolio optimization", "Email support"],
      unlocked: false,
      progress: 60,
    },
    {
      tier: 5,
      title: "Market Enthusiast",
      description: "Advanced trading features",
      icon: <Brain className="h-5 w-5" />,
      requirements: ["Complete 5 trades OR $1,000 AUM", "Use AI search 25 times"],
      rewards: ["AI market insights", "Advanced charting tools", "Monthly market report"],
      unlocked: false,
      progress: 40,
    },
    {
      tier: 6,
      title: "Portfolio Builder",
      description: "Professional-grade tools",
      icon: <Crown className="h-5 w-5" />,
      requirements: ["Invite 3 friends OR $2,500 AUM", "10-day login streak"],
      rewards: ["AI portfolio audit", "Institutional research", "Premium analytics"],
      unlocked: false,
      progress: 20,
    },
    {
      tier: 7,
      title: "Investment Pro",
      description: "Exclusive privileges",
      icon: <Trophy className="h-5 w-5" />,
      requirements: ["Complete 20 trades OR $5,000 AUM", "Refer 5 active users"],
      rewards: ["Debit card with cashback", "1-on-1 advisor calls", "VIP customer support"],
      unlocked: false,
      progress: 10,
    },
  ];

  const unlockedFeatures = [
    { name: "AI Stock Search", icon: <Sparkles className="h-4 w-4" />, tier: 1 },
    { name: "Enhanced Dashboards", icon: <BarChart3 className="h-4 w-4" />, tier: 2 },
    { name: "Advanced Filters", icon: <Target className="h-4 w-4" />, tier: 2 },
  ];

  const lockedFeatures = [
    { name: "1-on-1 Quant Calls", icon: <Users className="h-4 w-4" />, tier: 3 },
    { name: "AI Portfolio Optimization", icon: <Brain className="h-4 w-4" />, tier: 4 },
    { name: "AI Market Insights", icon: <TrendingUp className="h-4 w-4" />, tier: 5 },
  ];

  const handleShareInvite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on swipr.ai',
        text: 'Start investing smarter with AI-powered stock recommendations!',
        url: 'https://swipr.ai/invite/abc123'
      });
    } else {
      navigator.clipboard.writeText('https://swipr.ai/invite/abc123');
      // Show toast notification
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Rewards</h1>
                <p className="text-sm text-muted-foreground">
                  Unlock features as you grow
                </p>
              </div>
            </div>
            <Button onClick={handleShareInvite} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Share2 className="h-4 w-4 mr-2" />
              Invite Friends
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">


        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.friendsInvited}</div>
              <div className="text-sm text-muted-foreground">Friends Invited</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">${(userStats.aum / 1000).toFixed(1)}k</div>
              <div className="text-sm text-muted-foreground">AUM</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.loginStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.totalTrades}</div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/60 backdrop-blur-sm rounded-lg max-w-md mx-auto">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="flex-1"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "tiers" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("tiers")}
            className="flex-1"
          >
            Tiers
          </Button>
          <Button
            variant={activeTab === "friends" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("friends")}
            className="flex-1"
          >
            Friends
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Unlocked Features */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Unlocked Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unlockedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <span className="font-medium">{feature.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      Tier {feature.tier}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Next Rewards */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Next to Unlock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lockedFeatures.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-600">{feature.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      Tier {feature.tier}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tiers" && (
          <div className="space-y-4">
            {rewardTiers.map((tier, index) => (
              <Card key={tier.tier} className={cn(
                "border-0 shadow-sm transition-all",
                tier.unlocked
                  ? "bg-green-50 border-green-200"
                  : "bg-white/90 backdrop-blur-sm"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      tier.unlocked
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    )}>
                      {tier.unlocked ? tier.icon : <Lock className="h-5 w-5" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">Tier {tier.tier}</h3>
                        <span className="text-lg font-bold">{tier.title}</span>
                        {tier.unlocked && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {tier.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Rewards:</h4>
                          <ul className="text-sm space-y-1">
                            {tier.rewards.map((reward, idx) => (
                              <li key={idx} className={cn(
                                "flex items-center gap-2",
                                tier.unlocked ? "text-green-700" : "text-muted-foreground"
                              )}>
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  tier.unlocked ? "bg-green-600" : "bg-gray-400"
                                )} />
                                {reward}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {tier.progress !== undefined && !tier.unlocked && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{tier.progress}%</span>
                          </div>
                          <Progress value={tier.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "friends" && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Inviting friends has perks</CardTitle>
              <p className="text-muted-foreground">
                Every time you successfully invite a friend to swipr.ai, you both unlock new features and earn rewards.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={handleShareInvite} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                <Share2 className="h-5 w-5 mr-2" />
                Share your invite link
              </Button>

              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  swipr.ai/invite/abc123
                </div>
                <p className="text-sm text-muted-foreground">Your personal invite code</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Invite Rewards Timeline:</h3>
                <div className="space-y-3">
                  {[
                    { friends: 1, reward: "Both get $5 stock credit + enhanced dashboards" },
                    { friends: 2, reward: "Advanced filters + premium analytics" },
                    { friends: 3, reward: "Unlimited AI search + monthly quant calls" },
                    { friends: 4, reward: "AI portfolio optimization + early access" },
                    { friends: 5, reward: "AI market insights + weekly quant calls" },
                    { friends: 6, reward: "AI portfolio audit + institutional research" },
                    { friends: 7, reward: "Debit card + unlimited quant calls" },
                  ].map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        userStats.friendsInvited >= milestone.friends
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      )}>
                        {milestone.friends}
                      </div>
                      <span className={cn(
                        userStats.friendsInvited >= milestone.friends
                          ? "text-green-700 font-medium"
                          : "text-muted-foreground"
                      )}>
                        {milestone.reward}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
