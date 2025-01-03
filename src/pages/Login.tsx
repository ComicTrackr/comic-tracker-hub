import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const planType = new URLSearchParams(location.search).get('plan');

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && planType) {
        try {
          const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { planType }
          });
          
          if (error) {
            console.error('Checkout error:', error);
            toast({
              title: "Error",
              description: "Failed to initiate payment. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          if (data?.url) {
            window.location.href = data.url;
          }
        } catch (error) {
          console.error('Payment error:', error);
          toast({
            title: "Error",
            description: "Failed to process payment. Please try again.",
            variant: "destructive",
          });
        }
      } else if (session) {
        // Check if user is subscribed
        try {
          const { data, error } = await supabase.functions.invoke('is-subscribed');
          if (error) throw error;
          
          if (data.subscribed) {
            navigate("/search");
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
          navigate("/");
        }
      }
    };

    checkAuthAndRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && planType) {
        try {
          const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { planType }
          });
          
          if (error) {
            console.error('Checkout error:', error);
            toast({
              title: "Error",
              description: "Failed to initiate payment. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          if (data?.url) {
            window.location.href = data.url;
          }
        } catch (error) {
          console.error('Payment error:', error);
          toast({
            title: "Error",
            description: "Failed to process payment. Please try again.",
            variant: "destructive",
          });
        }
      } else if (session) {
        // Check if user is subscribed
        try {
          const { data, error } = await supabase.functions.invoke('is-subscribed');
          if (error) throw error;
          
          if (data.subscribed) {
            navigate("/search");
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, planType]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-orange-800 mb-2 text-center">Welcome to ComicTrackr</h1>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            AI Powered Real-Time Retail Value For Your Comic Collection
          </p>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#c45a1c',
                    brandAccent: '#b54a0c',
                    inputText: 'inherit',
                  }
                }
              }
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/search`}
          />
        </Card>
      </div>
    </div>
  );
};

export default Login;