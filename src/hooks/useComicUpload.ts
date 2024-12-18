import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeComicImage, saveComicAnalysis } from "@/services/comicAnalysisService";
import { ComicAnalysisResult } from "@/components/ComicAnalysisResult";

const compressImage = async (file: File): Promise<string> => {
  console.log('Original file size:', Math.round(file.size / 1024), 'KB');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      console.log('Base64 size before compression:', Math.round((event.target?.result as string).length / 1024), 'KB');
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
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

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        console.log('Base64 size after compression:', Math.round(compressedBase64.length / 1024), 'KB');
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
      
      const compressedBase64 = await compressImage(file);

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

      const analysis = await analyzeComicImage(compressedBase64);
      
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