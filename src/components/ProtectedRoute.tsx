import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, isSubscribed } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-orange-800" />
        <p className="text-muted-foreground">Loading your session...</p>
      </div>
    );
  }

  if (!session) {
    console.log("Protected route - No session, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!isSubscribed) {
    console.log("Protected route - Not subscribed, redirecting to membership");
    return <Navigate to="/membership" replace />;
  }

  return <>{children}</>;
};