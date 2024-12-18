import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
          <a href="/" className="hover:opacity-80 transition-opacity">Home</a>
          <a href="/dashboard" className="hover:opacity-80 transition-opacity">Dashboard</a>
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
              <a href="/" className="text-lg hover:opacity-80 transition-opacity">Home</a>
              <a href="/dashboard" className="text-lg hover:opacity-80 transition-opacity">Dashboard</a>
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