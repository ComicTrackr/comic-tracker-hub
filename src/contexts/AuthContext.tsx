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
      const { data, error } = await supabase.functions.invoke('is-subscribed', {
        body: { user_id: userSession.user.id }
      });
      
      if (error) {
        console.error("Subscription check error:", error);
        return;
      }
      
      setIsSubscribed(!!data?.subscribed);
      console.log("Subscription status:", data?.subscribed);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession ? "Found" : "None");
        
        if (!mounted) return;

        if (initialSession) {
          setSession(initialSession);
          await checkSubscription(initialSession);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try refreshing the page",
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initialize auth state
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, "Session:", newSession ? "Present" : "None");
      
      if (!mounted) return;

      setSession(newSession);
      
      if (newSession) {
        await checkSubscription(newSession);
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