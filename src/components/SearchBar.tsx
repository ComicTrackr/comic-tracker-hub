import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useComicCollection } from "@/hooks/useComicCollection";
import { ComicAnalysisResult } from "@/components/ComicAnalysisResult";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { analysisResult, setAnalysisResult, addToCollection } = useComicCollection();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
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

      console.log('Analysis response:', analysis);

      if (!analysis.cover_image_url) {
        console.warn('No cover image URL provided in analysis');
      }

      setAnalysisResult({
        comic_title: analysis.comic_title,
        analysis_text: analysis.analysis_text,
        graded_value: analysis.graded_value,
        ungraded_value: analysis.ungraded_value,
        recent_graded_sales: analysis.recent_graded_sales || '',
        recent_ungraded_sales: analysis.recent_ungraded_sales || '',
        cover_image_url: analysis.cover_image_url
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

  const handleNewSearch = () => {
    setAnalysisResult(null);
    setSearchQuery("");
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

      {analysisResult && (
        <ComicAnalysisResult 
          result={analysisResult}
          onAddToCollection={addToCollection}
          onNewSearch={handleNewSearch}
        />
      )}
    </div>
  );
};