import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, isSubscribed, subscriptionLoading } = useAuth();

  console.log("ProtectedRoute - State:", {
    isLoading,
    subscriptionLoading,
    hasSession: !!session,
    isSubscribed
  });

  // Show loading state while checking auth or subscription
  if (isLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-orange-800" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Redirect to login if no session
  if (!session) {
    console.log("ProtectedRoute: No session, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Redirect to membership page if not subscribed
  if (!isSubscribed) {
    console.log("ProtectedRoute: Not subscribed, redirecting to membership");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};