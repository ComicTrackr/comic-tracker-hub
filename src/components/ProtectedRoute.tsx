import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, isSubscribed } = useAuth();

  console.log("ProtectedRoute - Auth State:", {
    isLoading,
    hasSession: !!session,
    isSubscribed
  });

  // Show loading state only when we're actually loading the session
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-orange-800" />
        <p className="text-muted-foreground">Loading your session...</p>
      </div>
    );
  }

  // If not loading and no session, redirect to login
  if (!session) {
    console.log("Protected route - No session, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If not loading, has session but not subscribed, redirect to membership
  if (!isSubscribed) {
    console.log("Protected route - Not subscribed, redirecting to membership");
    return <Navigate to="/membership" replace />;
  }

  // If we have a session and subscription, render the protected content
  return <>{children}</>;
};