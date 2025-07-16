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
}

interface AuthContextType {
  user: User | null;
  authStatus: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  completeKYC: (kycData: any) => Promise<void>;
  requiresKYC: () => boolean;
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

    // Restore guest queue if it exists
    restoreGuestQueue();
  };

  const restoreGuestQueue = () => {
    const guestQueue = localStorage.getItem("guest_queue_backup");
    if (guestQueue) {
      localStorage.setItem("queue", guestQueue);
      localStorage.removeItem("guest_queue_backup");
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock registration - in real app, create account via backend
    const newUser: User = {
      id: "user_" + Date.now(),
      name,
      email,
      isGuest: false,
    };

    setUser(newUser);
    setAuthStatus("authenticated");
    localStorage.setItem("auth_status", "authenticated");
    localStorage.setItem("user_data", JSON.stringify(newUser));

    // Restore guest queue if it exists
    restoreGuestQueue();
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: "guest",
      name: "Guest User",
      email: "",
      isGuest: true,
    };

    setUser(guestUser);
    setAuthStatus("guest");
    localStorage.setItem("auth_status", "guest");
  };

  const saveGuestDataAndSignOut = () => {
    // Save guest queue data before signing out
    const guestQueue = localStorage.getItem("queue") || "[]";
    if (guestQueue !== "[]") {
      localStorage.setItem("guest_queue_backup", guestQueue);
    }

    // Use setTimeout to ensure state transition happens after current render cycle
    setTimeout(() => {
      setUser(null);
      setAuthStatus("unauthenticated");
      localStorage.removeItem("auth_status");
      localStorage.removeItem("user_data");
    }, 0);
  };

  const signOut = () => {
    setUser(null);
    setAuthStatus("unauthenticated");
    localStorage.removeItem("auth_status");
    localStorage.removeItem("user_data");
    localStorage.removeItem("onboarding_completed");
    // Clear queue and other guest data
    localStorage.removeItem("guest_queue");
  };

  const requireAuth = () => {
    return authStatus === "authenticated";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authStatus,
        signIn,
        signUp,
        continueAsGuest,
        signOut,
        saveGuestDataAndSignOut,
        requireAuth,
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
