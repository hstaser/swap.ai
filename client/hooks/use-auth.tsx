import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type AuthStatus = "authenticated" | "unauthenticated";

interface User {
  id: string;
  name: string;
  email: string;
  kycCompleted: boolean;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  authStatus: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  completeKYC: (kycData: any) => Promise<void>;
  requiresKYC: () => boolean;
  completeOnboarding: (onboardingData: any) => Promise<void>;
  requiresOnboarding: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Separate the AuthProvider component to fix Fast Refresh issues
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("unauthenticated");

  useEffect(() => {
    // Check for existing auth on app load
    const authData = localStorage.getItem("auth_status");
    const userData = localStorage.getItem("user_data");

    if (authData === "authenticated" && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setAuthStatus("authenticated");
      } catch (error) {
        localStorage.removeItem("auth_status");
        localStorage.removeItem("user_data");
      }
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For existing users signing in, they should have completed onboarding
    const mockUser: User = {
      id: "user_123",
      name: email.split("@")[0],
      email,
      kycCompleted: true,
      onboardingCompleted: true, // Existing users have completed onboarding
    };

    setUser(mockUser);
    setAuthStatus("authenticated");
    localStorage.setItem("auth_status", "authenticated");
    localStorage.setItem("user_data", JSON.stringify(mockUser));
  };

  const signUp = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock registration - in real app, create account via backend
    // New users automatically have KYC completed so they can proceed to onboarding
    const newUser: User = {
      id: "user_" + Date.now(),
      name: email.split("@")[0], // Use email prefix as temporary name
      email,
      kycCompleted: true, // Auto-complete KYC for new signups to trigger onboarding
      onboardingCompleted: false,
    };

    setUser(newUser);
    setAuthStatus("authenticated");
    localStorage.setItem("auth_status", "authenticated");
    localStorage.setItem("user_data", JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    setAuthStatus("unauthenticated");
    localStorage.removeItem("auth_status");
    localStorage.removeItem("user_data");
    localStorage.removeItem("onboarding_completed");
  };

  const completeKYC = async (kycData: any) => {
    // Simulate API call to complete KYC
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (user) {
      const updatedUser = { ...user, kycCompleted: true };
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    }
  };

  const requiresKYC = () => {
    return authStatus === "authenticated" && user && !user.kycCompleted;
  };

  const completeOnboarding = async (onboardingData: any) => {
    // Simulate API call to save onboarding data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store onboarding data
    localStorage.setItem(
      "onboarding_data",
      JSON.stringify({
        ...onboardingData,
        completedAt: new Date().toISOString(),
        userId: user?.id,
      }),
    );

    if (user) {
      const updatedUser = { ...user, onboardingCompleted: true };
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    }
  };

  const requiresOnboarding = () => {
    return (
      authStatus === "authenticated" &&
      user &&
      user.kycCompleted &&
      !user.onboardingCompleted
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authStatus,
        signIn,
        signUp,
        signOut,
        completeKYC,
        requiresKYC,
        completeOnboarding,
        requiresOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Export hook separately for Fast Refresh compatibility
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export AuthProvider as default for Fast Refresh compatibility
export default AuthProvider;
