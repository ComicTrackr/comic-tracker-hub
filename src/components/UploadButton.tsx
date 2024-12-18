import { useState } from 'react';
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useComicCollection } from "@/hooks/useComicCollection";
import { ComicAnalysisResult } from "@/components/ComicAnalysisResult";

export const UploadButton = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { analysisResult, setAnalysisResult, addToCollection } = useComicCollection();

  const analyzeComic = async (file: File) => {
    try {
      setIsAnalyzing(true);
      
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      const base64 = await base64Promise;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to analyze comics",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Analyzing...",
        description: "Please wait while we analyze your comic cover",
      });

      const { data: analysis, error } = await supabase.functions.invoke('analyze-comic', {
        body: {
          image: base64
        }
      });

      if (error) throw error;

      const { error: insertError } = await supabase
        .from('comic_analyses')
        .insert({
          user_id: user.id,
          comic_title: analysis.comic_title,
          analysis_text: analysis.text,
          condition_rating: analysis.condition_rating,
          estimated_value: analysis.estimated_value,
          image_url: base64.toString()
        });

      if (insertError) throw insertError;

      setAnalysisResult({
        comic_title: analysis.comic_title,
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
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
        onClick={() => document.getElementById('comic-upload')?.click()}
        disabled={isAnalyzing}
      >
        <Upload className="h-4 w-4" />
        {isAnalyzing ? "Analyzing..." : "Upload Comic Cover"}
        <input
          id="comic-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              analyzeComic(file);
            }
          }}
        />
      </Button>

      {analysisResult && (
        <ComicAnalysisResult 
          result={analysisResult}
          onAddToCollection={() => addToCollection(analysisResult)}
        />
      )}
    </div>
  );
};