import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          const { data, error } = await supabase.functions.invoke('create-checkout');
          
          if (error) {
            console.error('Checkout error:', error);
            toast({
              title: "Error",
              description: "Failed to initiate payment. Please try again.",
              variant: "destructive",
            });
            navigate("/dashboard");
            return;
          }
          
          if (data?.url) {
            window.location.href = data.url;
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error('Payment error:', error);
          toast({
            title: "Error",
            description: "Failed to process payment. Redirecting to dashboard.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-orange-800 mb-8 text-center">Welcome to ComicTrackr</h1>
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
            redirectTo={window.location.origin}
          />
        </Card>
      </div>
    </div>
  );
};

export default Login;