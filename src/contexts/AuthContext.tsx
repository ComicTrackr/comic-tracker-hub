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
      const { data, error } = await supabase.functions.invoke('is-subscribed');
      if (error) throw error;
      setIsSubscribed(data.subscribed);
      console.log("Subscription status:", data.subscribed);
    } catch (error) {
      console.error("Error checking subscription:", error);
      // Don't set isSubscribed to false on error to prevent unnecessary redirects
      toast({
        variant: "destructive",
        title: "Subscription Check Failed",
        description: "Please try refreshing the page",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial auth check - Session:", initialSession ? "Found" : "None");
        
        if (mounted) {
          setSession(initialSession);
          await checkSubscription(initialSession);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please try logging in again",
          });
          setSession(null);
          setIsSubscribed(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (mounted) {
        setSession(session);
        await checkSubscription(session);
        setIsLoading(false);
      }
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