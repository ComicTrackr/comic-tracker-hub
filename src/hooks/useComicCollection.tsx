import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ComicAnalysisResult } from "@/components/ComicAnalysisResult";

export const useComicCollection = () => {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<ComicAnalysisResult | null>(null);

  const addToCollection = async (result: ComicAnalysisResult, isGraded: boolean) => {
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

      // Save the analysis results to user_comics table
      const { error } = await supabase
        .from('user_comics')
        .insert({
          user_id: user.id,
          comic_title: result.comic_title,
          estimated_value: isGraded ? result.graded_value : result.ungraded_value
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comic added to your collection!",
      });

      setAnalysisResult(null);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to add comic to collection",
        variant: "destructive",
      });
    }
  };

  return {
    analysisResult,
    setAnalysisResult,
    addToCollection
  };
};