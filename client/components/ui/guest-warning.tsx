import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Users, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface GuestWarningProps {
  onSignUp: () => void;
  onCancel: () => void;
  action: string;
}

export function GuestWarning({
  onSignUp,
  onCancel,
  action,
}: GuestWarningProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-8 w-8 text-orange-600" />
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>

            <h3 className="text-lg font-semibold">Account Required</h3>

            <p className="text-sm text-gray-600">
              You need to be signed in to <strong>{action}</strong>.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-xs text-red-800">
                  <strong>Investment Protection:</strong> To keep your money
                  safe, we require a verified account before you can invest.
                  This helps us:
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Verify your identity</li>
                    <li>Protect your investments</li>
                    <li>Provide customer support</li>
                    <li>Meet regulatory requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button onClick={onSignUp} className="w-full">
                Create Account / Sign In
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button variant="outline" onClick={onCancel} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AuthRequiredProps {
  action: string;
  children: React.ReactNode;
  onAuthRequired?: () => void;
}

export function AuthRequired({
  action,
  children,
  onAuthRequired,
}: AuthRequiredProps) {
  const { authStatus } = useAuth();

  if (authStatus === "unauthenticated") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Account Required</h3>
            <p className="text-sm text-gray-600 mb-4">
              You need to sign in or create an account to {action}.
            </p>
            <Button onClick={() => onAuthRequired?.()} className="w-full">
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
