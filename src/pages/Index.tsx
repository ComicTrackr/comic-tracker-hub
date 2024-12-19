import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { UploadButton } from "@/components/UploadButton";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { session, isLoading, isSubscribed } = useAuth();
  
  console.log("Index page - Auth State:", {
    isLoading,
    hasSession: !!session,
    isSubscribed,
    sessionDetails: session
  });

  if (isLoading && !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your session...</p>
      </div>
    );
  }

  // Redirect to membership if not subscribed
  if (!isSubscribed) {
    console.log("User not subscribed, redirecting to membership");
    return <Navigate to="/membership" replace />;
  }

  // Render main content if authenticated and subscribed
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-12">
        <Hero />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <UploadButton />
            
            <p className="text-sm text-muted-foreground text-center max-w-xl mx-auto">
              Make Sure Your Photos Show The Complete Cover With Issue Number And Title Clearly Visible
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-sm opacity-70">
              Supported formats: JPG, PNG, WEBP • Max file size: 10MB
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;