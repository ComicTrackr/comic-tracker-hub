import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const useSubscriptionCheck = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

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

  return { isSubscribed, setIsSubscribed, checkSubscription };
};