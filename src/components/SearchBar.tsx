import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="relative w-full max-w-xl">
      <Input
        type="text"
        placeholder="Search comics by title, author, or ISBN..."
        className="pl-10 pr-4 py-2 w-full bg-secondary text-foreground placeholder:text-muted-foreground"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
};