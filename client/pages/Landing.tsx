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
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"landing" | "signin" | "signup">("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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
        await signUp(formData.email, formData.password);
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
        // Auto-fill and submit with test signin data
        await signIn("developer@test.com", "testpassword");
      } else if (mode === "signup") {
        // Auto-fill and submit with test signup data
        await signUp("developer@test.com", "testpassword");
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
        email: "developer@test.com",
        password: "testpassword",
      });
    } else if (mode === "signup") {
      setFormData({
        email: "developer@test.com",
        password: "testpassword",
      });
    }
  };

  if (mode === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Clean Logo Only - Perfect for Screenshot */}
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="relative">
              {/* Main Logo Icon */}
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="w-28 h-28 bg-gradient-to-tr from-white/20 to-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="h-16 w-16 text-white drop-shadow-lg" />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-3xl blur-2xl opacity-40 -z-10 animate-pulse"></div>

              {/* Outer ring */}
              <div className="absolute -inset-4 border-2 border-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 rounded-full opacity-30"></div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 tracking-wide">
              Swipe. Invest.{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Grow.
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The first AI-powered investment platform that makes stock
              selection as easy as swiping. Build your portfolio with confidence
              using smart recommendations.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
                <p className="text-sm text-gray-600">
                  Get personalized stock recommendations based on your goals and
                  risk tolerance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Swipe to Invest</h3>
                <p className="text-sm text-gray-600">
                  Discover and select stocks with an intuitive swipe interface
                  designed for modern investors
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Secure & Protected</h3>
                <p className="text-sm text-gray-600">
                  Bank-level security with SIPC protection and encrypted
                  transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Get Started Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setMode("signup")}
                className="w-full h-12 text-lg font-semibold"
              >
                Sign Up
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => setMode("signin")}
                className="w-full h-12 text-lg"
              >
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => {}}
                className="w-full h-12 text-lg border-dashed border-2"
              >
                <Eye className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">swap.ai</span>
          </div>
          <CardTitle className="text-center">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </Button>

            {/* Development Skip Options */}
            <div className="mt-4 space-y-2">
              <div className="text-xs text-center text-gray-500 mb-2">
                Development Tools
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillTestData}
                  disabled={isLoading}
                  className="text-xs h-8"
                >
                  Fill Test Data
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSkipWithTestData}
                  disabled={isLoading}
                  className="text-xs h-8 text-blue-600"
                >
                  {mode === "signin" ? "Skip Sign In" : "Skip Sign Up"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                onClick={() => setMode("landing")}
                className="w-full"
              >
                ← Back to Home
              </Button>

              <Button
                variant="outline"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="w-full"
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
