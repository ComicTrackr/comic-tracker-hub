import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { UploadButton } from "@/components/UploadButton";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User authenticated on landing page");
      } else {
        console.log("No session on landing page");
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to access this page.",
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <>
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
    </>
  );
};

export default Index;