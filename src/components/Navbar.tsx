import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleCancelMembership = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background border-b border-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/19d22c42-8007-4f8d-95f9-642b4061b6f7.png" 
            alt="ComicTrackr Logo" 
            className="h-12 w-12"
          />
          <span className="text-xl font-bold">ComicTrackr</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/search" className="hover:opacity-80 transition-opacity">Search</a>
          <a href="/dashboard" className="hover:opacity-80 transition-opacity">Dashboard</a>
          {isDashboard && (
            <Button
              variant="destructive"
              className="hover:opacity-80 transition-opacity"
              onClick={handleCancelMembership}
            >
              Cancel Membership
            </Button>
          )}
          <Button
            variant="ghost"
            className="hover:opacity-80 transition-opacity flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-8">
              <a href="/search" className="text-lg hover:opacity-80 transition-opacity">Search</a>
              <a href="/dashboard" className="text-lg hover:opacity-80 transition-opacity">Dashboard</a>
              {isDashboard && (
                <Button
                  variant="destructive"
                  className="hover:opacity-80 transition-opacity"
                  onClick={handleCancelMembership}
                >
                  Cancel Membership
                </Button>
              )}
              <Button
                variant="ghost"
                className="hover:opacity-80 transition-opacity flex items-center gap-2 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};