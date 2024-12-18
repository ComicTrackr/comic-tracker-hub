import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to search comics",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Searching...",
        description: "Please wait while we analyze your query",
      });

      const { data: analysis, error } = await supabase.functions.invoke('analyze-comic', {
        body: { searchQuery: searchQuery.trim() }
      });

      if (error) throw error;

      // Store the analysis results
      const { error: insertError } = await supabase
        .from('comic_analyses')
        .insert({
          user_id: user.id,
          comic_title: searchQuery.trim(),
          analysis_text: analysis.text,
          condition_rating: analysis.condition_rating,
          estimated_value: analysis.estimated_value
        });

      if (insertError) throw insertError;

      toast({
        title: "Analysis Complete",
        description: "Your comic has been analyzed successfully!",
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the comic",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search comics by title, author, or ISBN..."
        className="pl-10 pr-4 py-2 w-full bg-secondary text-foreground placeholder:text-muted-foreground"
      />
      <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search className="h-4 w-4 text-muted-foreground" />
      </button>
    </form>
  );
};