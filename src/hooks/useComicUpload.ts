import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeComicImage, saveComicAnalysis } from "@/services/comicAnalysisService";
import { ComicAnalysisResult } from "@/components/ComicAnalysisResult";

const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const useComicUpload = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File): Promise<ComicAnalysisResult | null> => {
    try {
      setIsAnalyzing(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to analyze comics",
          variant: "destructive",
        });
        return null;
      }

      const compressedBase64 = await compressImage(file);

      toast({
        title: "Analyzing...",
        description: "Please wait while we analyze your comic cover",
      });

      const analysis = await analyzeComicImage(compressedBase64);
      
      if (!analysis) {
        throw new Error("Failed to analyze the comic");
      }

      await saveComicAnalysis(user.id, analysis, compressedBase64);

      toast({
        title: "Analysis Complete",
        description: "Your comic has been analyzed successfully!",
      });

      return analysis;

    } catch (error: any) {
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