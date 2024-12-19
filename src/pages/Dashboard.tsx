import { Card } from "@/components/ui/card";
import { ComicValueChart } from "@/components/ComicValueChart";
import { ComicCollection } from "@/components/ComicCollection";
import { Navbar } from "@/components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session status:", session ? "Active" : "None");
      
      if (!session) {
        console.log("No session found, redirecting to login");
        navigate("/login");
        return;
      }

      // Check subscription status
      try {
        console.log("Checking subscription status...");
        const { data, error } = await supabase.functions.invoke('is-subscribed');
        console.log("Subscription check response:", { data, error });
        
        if (error) throw error;
        
        if (!data.subscribed) {
          console.log("User not subscribed, redirecting to membership");
          navigate("/membership");
          return;
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        navigate("/membership");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-800">My Collection Dashboard</h1>
        
        <div className="grid gap-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-orange-800">Collection Value Over Time</h2>
            <div className="h-[250px] md:h-[300px] w-full">
              <ComicValueChart />
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-orange-800">My Comics</h2>
            <ComicCollection />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;