import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Membership from "@/pages/Membership";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import "./App.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession ? "Found" : "None");
        setSession(initialSession);

        if (initialSession) {
          console.log("Checking subscription status...");
          const { data, error } = await supabase.functions.invoke('is-subscribed');
          if (error) {
            console.error("Subscription check error:", error);
            throw error;
          }
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
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event);
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
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-800"></div>
      </div>
    );
  }

  if (!session) {
    console.log("No session, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!isSubscribed) {
    console.log("Not subscribed, redirecting to membership");
    return <Navigate to="/membership" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landing"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;