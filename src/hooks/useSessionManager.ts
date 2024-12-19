import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSessionManager = (onSessionChange: (session: Session | null) => void) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession ? "Found" : "None");
        
        if (!mounted) return;

        if (initialSession) {
          setSession(initialSession);
          onSessionChange(initialSession);
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

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, "Session:", newSession ? "Present" : "None");
      
      if (!mounted) return;

      setSession(newSession);
      onSessionChange(newSession);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onSessionChange, toast]);

  return { session, isLoading };
};