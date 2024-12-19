import { createContext, useContext, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  isSubscribed: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSubscribed, setIsSubscribed, checkSubscription } = useSubscriptionCheck();
  
  const handleSessionChange = useCallback(async (newSession: Session | null) => {
    if (newSession) {
      console.log("Session change: Checking subscription status");
      await checkSubscription(newSession);
    } else {
      console.log("Session change: No session, clearing subscription status");
      setIsSubscribed(false);
    }
  }, [checkSubscription, setIsSubscribed]);

  const { session, isLoading } = useSessionManager(handleSessionChange);

  const contextValue = {
    session,
    isLoading,
    isSubscribed
  };

  return (
    <AuthContext.Provider value={contextValue}>
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