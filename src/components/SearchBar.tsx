import { useState } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SearchResult {
  comic_title: string;
  analysis_text: string;
  condition_rating: string;
  estimated_value: number;
}

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
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

      setSearchResult({
        comic_title: searchQuery.trim(),
        analysis_text: analysis.text,
        condition_rating: analysis.condition_rating,
        estimated_value: analysis.estimated_value
      });

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

  const addToCollection = async () => {
    if (!searchResult) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add comics to your collection",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_comics')
        .insert({
          user_id: user.id,
          comic_title: searchResult.comic_title,
          condition_rating: searchResult.condition_rating,
          estimated_value: searchResult.estimated_value
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comic added to your collection!",
      });

      // Clear the search result after adding to collection
      setSearchResult(null);
      setSearchQuery("");

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to add comic to collection",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 w-full max-w-xl">
      <form onSubmit={handleSearch} className="relative">
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

      {searchResult && (
        <div className="bg-secondary p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{searchResult.comic_title}</h3>
              <p className="text-sm text-muted-foreground">{searchResult.analysis_text}</p>
              <p className="text-sm">Condition: {searchResult.condition_rating}</p>
              <p className="text-sm">Estimated Value: ${searchResult.estimated_value}</p>
            </div>
            <Button
              onClick={addToCollection}
              variant="outline"
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add to Collection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};