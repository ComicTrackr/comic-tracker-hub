import { useState } from 'react';
import { Upload, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AnalysisResult {
  comic_title: string;
  analysis_text: string;
  condition_rating: string;
  estimated_value: number;
}

export const UploadButton = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeComic = async (file: File) => {
    try {
      setIsAnalyzing(true);
      
      // Convert the image to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      const base64 = await base64Promise;

      // Get the current user
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

      // Call the Edge Function to analyze the image
      const { data: analysis, error } = await supabase.functions.invoke('analyze-comic', {
        body: {
          image: base64,
          title: file.name.replace(/\.[^/.]+$/, "") // Remove file extension
        }
      });

      if (error) throw error;

      // Store the analysis results
      const { error: insertError } = await supabase
        .from('comic_analyses')
        .insert({
          user_id: user.id,
          comic_title: file.name.replace(/\.[^/.]+$/, ""),
          analysis_text: analysis.text,
          condition_rating: analysis.condition_rating,
          estimated_value: analysis.estimated_value,
          image_url: base64.toString()
        });

      if (insertError) throw insertError;

      setAnalysisResult({
        comic_title: file.name.replace(/\.[^/.]+$/, ""),
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

  const addToCollection = async () => {
    if (!analysisResult) return;

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
          comic_title: analysisResult.comic_title,
          condition_rating: analysisResult.condition_rating,
          estimated_value: analysisResult.estimated_value
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comic added to your collection!",
      });

      // Clear the analysis result after adding to collection
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
        <div className="bg-secondary p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{analysisResult.comic_title}</h3>
              <p className="text-sm text-muted-foreground">{analysisResult.analysis_text}</p>
              <p className="text-sm">Condition: {analysisResult.condition_rating}</p>
              <p className="text-sm">Estimated Value: ${analysisResult.estimated_value}</p>
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