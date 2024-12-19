import { useState, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useSubscriptionCheck = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const checkSubscription = useCallback(async (session: Session) => {
    try {
      console.log("Subscription check: Checking status for user", session.user.id);
      const { data, error } = await supabase.functions.invoke('is-subscribed');
      
      if (error) {
        console.error("Subscription check error:", error);
        setIsSubscribed(false);
        return;
      }

      console.log("Subscription check result:", data);
      setIsSubscribed(data?.isSubscribed ?? false);
    } catch (error) {
      console.error("Subscription check failed:", error);
      setIsSubscribed(false);
    }
  }, []);

  return { isSubscribed, setIsSubscribed, checkSubscription };
};