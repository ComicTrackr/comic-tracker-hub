import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  isSubscribed: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async (userSession: Session | null) => {
    if (!userSession) {
      setIsSubscribed(false);
      return;
    }

    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data, error } = await supabase.functions.invoke('is-subscribed', {
        body: { user_id: userSession.user.id }
      });
      
      if (error) {
        console.error("Subscription check error:", error);
        // Don't update subscription status on error
        return;
      }
      
      setIsSubscribed(!!data?.subscribed);
      console.log("Subscription status updated:", data?.subscribed);
    } catch (error) {
      console.error("Error checking subscription:", error);
      // Don't update subscription status on error
    }
  };

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial auth check - Session:", initialSession ? "Found" : "None");
        
        if (!mounted) return;

        setSession(initialSession);
        
        if (initialSession) {
          await checkSubscription(initialSession);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted && retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeAuth, 1000 * retryCount);
        } else if (mounted) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please try refreshing the page",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "Session:", session ? "Present" : "None");
      
      if (!mounted) return;

      setSession(session);
      
      if (session) {
        await checkSubscription(session);
      } else {
        setIsSubscribed(false);
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ session, isLoading, isSubscribed }}>
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