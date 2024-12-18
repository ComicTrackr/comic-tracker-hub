import { useState } from 'react';
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const UploadButton = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
  );
};