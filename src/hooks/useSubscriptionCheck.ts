import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const useSubscriptionCheck = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const checkSubscription = async (userSession: Session | null) => {
    if (!userSession) {
      console.log("Subscription check: No session provided");
      setIsSubscribed(false);
      return;
    }

    try {
      console.log("Subscription check: Checking status for user", userSession.user.id);
      const { data, error } = await supabase.functions.invoke('is-subscribed', {
        body: { user_id: userSession.user.id }
      });
      
      if (error) {
        console.error("Subscription check failed:", error);
        return;
      }
      
      const hasSubscription = !!data?.subscribed;
      console.log("Subscription check result:", hasSubscription ? "Active" : "Inactive");
      setIsSubscribed(hasSubscription);
    } catch (error) {
      console.error("Subscription check error:", error);
    }
  };

  return { isSubscribed, setIsSubscribed, checkSubscription };
};