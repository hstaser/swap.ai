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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F8274926fadf9406c8e2d75b7a56de814%2F11112bd742824e529296e1b2cd55c201?format=webp&width=800"
                  alt="swipr.ai logo"
                  className="h-20 w-auto"
                />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Swipe. Invest. Grow.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setMode("signin")}
                className="w-full h-12 text-lg"
              >
                Sign In
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
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F8274926fadf9406c8e2d75b7a56de814%2F11112bd742824e529296e1b2cd55c201?format=webp&width=800"
                alt="swipr.ai logo"
                className="h-12 w-auto"
              />
            </div>
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
