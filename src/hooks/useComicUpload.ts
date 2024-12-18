import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeComicImage, saveComicAnalysis } from "@/services/comicAnalysisService";

export interface ComicAnalysisResult {
  comic_title: string;
  analysis_text: string;
  condition_rating: string;
  estimated_value: number;
}

export const useComicUpload = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File): Promise<ComicAnalysisResult | null> => {
    try {
      setIsAnalyzing(true);
      
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to analyze comics",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Analyzing...",
        description: "Please wait while we analyze your comic cover",
      });

      // Analyze the comic
      const analysis = await analyzeComicImage(base64);
      
      // Save the analysis
      await saveComicAnalysis(user.id, analysis, base64);

      toast({
        title: "Analysis Complete",
        description: "Your comic has been analyzed successfully!",
      });

      return analysis;

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the comic",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    handleFileUpload
  };
};