import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeComicImage, saveComicAnalysis } from "@/services/comicAnalysisService";
import { compressImage } from "@/utils/imageCompression";
import { ComicAnalysisResult } from "@/components/ComicAnalysisResult";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface UseComicUploadProps {
  onSuccess?: (result: ComicAnalysisResult) => void;
}

export const useComicUpload = ({ onSuccess }: UseComicUploadProps = {}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateAuth = async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to analyze comics",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const uploadAndAnalyzeComic = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      setIsAnalyzing(true);
      
      const isAuthenticated = await validateAuth();
      if (!isAuthenticated) return;

      const { data: { user } } = await supabase.auth.getUser();
      const compressedBase64 = await compressImage(file);

      toast({
        title: "Analyzing...",
        description: "Please wait while we analyze your comic cover",
      });

      const analysis = await analyzeComicImage(compressedBase64);
      
      if (!analysis) {
        throw new Error("Failed to analyze the comic");
      }

      await saveComicAnalysis(user!.id, analysis, compressedBase64);

      toast({
        title: "Analysis Complete",
        description: "Your comic has been analyzed successfully!",
      });

      onSuccess?.(analysis);

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the comic",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    uploadAndAnalyzeComic
  };
};