import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  Smartphone,
  Star,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<"landing" | "signin" | "signup">("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signin") {
        await signIn(formData.email, formData.password);
      } else if (mode === "signup") {
        await signUp(formData.name, formData.email, formData.password);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipWithTestData = async () => {
    setIsLoading(true);

    try {
      if (mode === "signin") {
        await signIn("developer@test.com", "testpassword");
      } else if (mode === "signup") {
        await signUp("Test Developer", "developer@test.com", "testpassword");
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestData = () => {
    if (mode === "signin") {
      setFormData({
        name: "",
        email: "developer@test.com",
        password: "testpassword",
      });
    } else if (mode === "signup") {
      setFormData({
        name: "Test Developer",
        email: "developer@test.com",
        password: "testpassword",
      });
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
  };

  if (mode === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <header className="safe-area-top px-4 pt-6 pb-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">swap.ai</h1>
            </div>
          </header>

          {/* Hero Section */}
          <main className="flex-1 px-4 py-8 text-center">
            {/* Main Message */}
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
                  Swipe.<br />
                  Invest.<br />
                  <span className="text-blue-200">Grow.</span>
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed max-w-sm mx-auto">
                  The first AI-powered investment app that makes stock selection as easy as dating apps
                </p>
              </div>
              
              {/* App Preview Mockup */}
              <div className="relative mx-auto w-56 h-96 mb-8">
                <div className="absolute inset-0 bg-black rounded-[2.5rem] p-2">
                  <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                    {/* Phone Content */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white p-4">
                      <div className="text-center pt-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-xs font-semibold text-gray-800 mb-4">swap.ai</div>
                        
                        {/* Mock Stock Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-gray-100">
                          <div className="flex justify-between items-start mb-3">
                            <div className="text-left">
                              <div className="text-sm font-bold text-gray-800">AAPL</div>
                              <div className="text-xs text-gray-600">Apple Inc.</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-800">$182.52</div>
                              <div className="text-xs text-green-600">+1.28%</div>
                            </div>
                          </div>
                          
                          {/* Swipe Indicators */}
                          <div className="flex justify-center gap-8 mt-6">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-lg">✕</span>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-lg">♥</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">Swipe right to invest ➜</div>
                      </div>
                    </div>
                    
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-b-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="space-y-4 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Swipe to Invest</h3>
                    <p className="text-sm text-blue-100">Tinder for stocks - discover investments with simple swipes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">AI-Powered Insights</h3>
                    <p className="text-sm text-blue-100">Get personalized recommendations based on your goals</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Bank-Level Security</h3>
                    <p className="text-sm text-blue-100">SIPC protected with military-grade encryption</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mb-8">
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-blue-100">
                "Game-changer for young investors"
              </p>
              <p className="text-xs text-blue-200 mt-1">
                4.8/5 stars • 50k+ downloads
              </p>
            </div>
          </main>

          {/* CTA Section */}
          <footer className="px-4 pb-8 safe-area-bottom">
            <div className="space-y-4">
              <Button
                onClick={() => setMode("signup")}
                className="w-full h-14 text-lg font-semibold bg-white text-blue-700 hover:bg-blue-50 rounded-2xl touch-manipulation"
                size="lg"
              >
                Start Investing
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => setMode("signin")}
                className="w-full h-14 text-lg border-white/30 text-white hover:bg-white/10 rounded-2xl touch-manipulation"
                size="lg"
              >
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-blue-700 px-3 text-blue-200">
                    Or explore first
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={handleGuestMode}
                className="w-full h-12 text-white hover:bg-white/10 border-2 border-dashed border-white/30 rounded-2xl touch-manipulation"
              >
                <Eye className="h-5 w-5 mr-2" />
                Continue as Guest
              </Button>

              <div className="bg-amber-500/20 border border-amber-400/30 rounded-2xl p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-300 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-100">
                    <strong>Guest Mode:</strong> Explore and build a portfolio, but your data won't be saved. Sign up to secure your investments.
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-blue-200">
                  Free to download • No hidden fees • Cancel anytime
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <Card className="w-full max-w-sm mx-auto mobile-card border-0 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">swap.ai</span>
          </div>
          <CardTitle className="text-xl">
            {mode === "signin" ? "Welcome Back" : "Join swap.ai"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="mobile-card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Enter your full name"
                  className="h-12 text-base rounded-xl border-2 focus:border-blue-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="Enter your email"
                className="h-12 text-base rounded-xl border-2 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="Enter your password"
                  className="h-12 text-base rounded-xl border-2 focus:border-blue-500 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold rounded-2xl bg-blue-600 hover:bg-blue-700 touch-manipulation" 
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </Button>

            {/* Development Tools */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="text-xs text-center text-gray-500">
                Development Tools
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillTestData}
                  disabled={isLoading}
                  className="h-10 text-sm rounded-xl touch-manipulation"
                >
                  Fill Test Data
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSkipWithTestData}
                  disabled={isLoading}
                  className="h-10 text-sm text-blue-600 rounded-xl touch-manipulation"
                >
                  {mode === "signin" ? "Skip Sign In" : "Skip Sign Up"}
                </Button>
              </div>
            </div>
          </form>

          <div className="space-y-4 pt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">Or</span>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleGuestMode}
              className="w-full h-12 rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-50 touch-manipulation"
            >
              <Users className="h-5 w-5 mr-2" />
              Continue as Guest
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                onClick={() => setMode("landing")}
                className="w-full h-12 rounded-xl hover:bg-gray-50 touch-manipulation"
              >
                ← Back
              </Button>

              <Button
                variant="outline"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="w-full h-12 rounded-xl touch-manipulation"
              >
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
