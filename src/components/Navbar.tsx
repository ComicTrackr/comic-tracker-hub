import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-background border-b border-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-xl font-bold">ComicTrackr</div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="hover:opacity-80 transition-opacity">Home</a>
          <a href="#" className="hover:opacity-80 transition-opacity">Library</a>
          <a href="#" className="hover:opacity-80 transition-opacity">About</a>
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
              <a href="#" className="text-lg hover:opacity-80 transition-opacity">Home</a>
              <a href="#" className="text-lg hover:opacity-80 transition-opacity">Library</a>
              <a href="#" className="text-lg hover:opacity-80 transition-opacity">About</a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};