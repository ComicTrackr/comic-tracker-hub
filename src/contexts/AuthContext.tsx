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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial auth check - Session:", initialSession ? "Found" : "None");
        setSession(initialSession);

        if (initialSession) {
          const { data, error } = await supabase.functions.invoke('is-subscribed');
          if (error) throw error;
          console.log("Subscription status:", data.subscribed);
          setIsSubscribed(data.subscribed);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try logging in again.",
        });
        setSession(null);
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      
      if (session) {
        try {
          const { data, error } = await supabase.functions.invoke('is-subscribed');
          if (error) throw error;
          setIsSubscribed(data.subscribed);
        } catch (error) {
          console.error("Error checking subscription:", error);
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(false);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
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