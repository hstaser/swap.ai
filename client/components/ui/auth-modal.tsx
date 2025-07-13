import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AuthModalProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthModal({
  onClose,
  title = "Get Started Today",
  subtitle,
}: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"initial" | "signin" | "signup">("initial");
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
      onClose();
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
      onClose();
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

  if (mode === "initial") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-sm mx-4 sm:mx-0">
          <CardHeader className="relative pb-4 sm:pb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2 sm:right-0 sm:top-0 h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-center text-lg sm:text-xl pt-2 sm:pt-0 px-8 sm:px-0">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-center text-xs sm:text-sm text-muted-foreground px-2 sm:px-0 pt-2">
                {subtitle}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-6">
            <Button
              onClick={() => setMode("signup")}
              className="w-full h-12 sm:h-12 text-base sm:text-lg font-semibold"
            >
              Sign Up
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setMode("signin")}
              className="w-full h-12 sm:h-12 text-base sm:text-lg"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <Card className="w-full max-w-md mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative pb-4 sm:pb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-0 sm:top-0 h-8 w-8 sm:h-10 sm:w-10"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 pt-2 sm:pt-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold">swap.ai</span>
          </div>
          <CardTitle className="text-center text-lg sm:text-xl">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Enter your full name"
                  className="h-11 sm:h-10 text-base sm:text-sm"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm sm:text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="Enter your email"
                className="h-11 sm:h-10 text-base sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
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
                  className="h-11 sm:h-10 text-base sm:text-sm pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 sm:h-10 w-11 sm:w-10"
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

            <Button
              type="submit"
              className="w-full h-12 text-base sm:text-sm mt-4 sm:mt-4"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>

          {/* Development Skip Options */}
          <div className="mt-3 sm:mt-4 space-y-2">
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
                className="text-xs h-9 sm:h-8"
              >
                Fill Test Data
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSkipWithTestData}
                disabled={isLoading}
                className="text-xs h-9 sm:h-8 text-blue-600"
              >
                {mode === "signin" ? "Skip Sign In" : "Skip Sign Up"}
              </Button>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="w-full h-11 sm:h-10 text-base sm:text-sm"
            >
              {mode === "signin" ? "Create Account" : "Sign In Instead"}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setMode("initial")}
              className="w-full h-11 sm:h-10 text-base sm:text-sm"
            >
              ← Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
