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

export function AuthProvider({ children }: { children: ReactNode }) {
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

    // Mock authentication - in real app, validate with backend
    const mockUser: User = {
      id: "user_123",
      name: email.split("@")[0],
      email,
      kycCompleted: false,
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
    const newUser: User = {
      id: "user_" + Date.now(),
      name: email.split("@")[0], // Use email prefix as temporary name
      email,
      kycCompleted: false,
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
    localStorage.setItem("onboarding_data", JSON.stringify({
      ...onboardingData,
      completedAt: new Date().toISOString(),
      userId: user?.id
    }));

    if (user) {
      const updatedUser = { ...user, onboardingCompleted: true };
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    }
  };

  const requiresOnboarding = () => {
    return authStatus === "authenticated" && user && user.kycCompleted && !user.onboardingCompleted;
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
