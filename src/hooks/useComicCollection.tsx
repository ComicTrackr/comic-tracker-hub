import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ComicAnalysisResult } from "@/types/comic";

export const useComicCollection = () => {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<ComicAnalysisResult | null>(null);

  const uploadCoverImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('comic-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('comic-covers')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload cover image",
        variant: "destructive",
      });
      return null;
    }
  };

  const addToCollection = async (isGraded: boolean, grade: string, adjustedValue: number, coverImage?: File) => {
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

      let imageUrl = null;
      if (coverImage) {
        imageUrl = await uploadCoverImage(coverImage);
      }

      const { error } = await supabase
        .from('user_comics')
        .insert({
          user_id: user.id,
          comic_title: analysisResult.comic_title,
          estimated_value: adjustedValue,
          condition_rating: grade,
          is_graded: isGraded,
          image_url: imageUrl
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