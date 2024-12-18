import { supabase } from "@/integrations/supabase/client";
import { ComicAnalysisResult } from "@/types/comic";

export const analyzeComicImage = async (base64Image: string): Promise<ComicAnalysisResult> => {
  const { data: analysis, error } = await supabase.functions.invoke('analyze-comic', {
    body: { image: base64Image }
  });

  if (error) throw error;
  return analysis;
};

export const saveComicAnalysis = async (
  userId: string,
  analysis: ComicAnalysisResult,
  imageUrl: string
) => {
  const { error: insertError } = await supabase
    .from('comic_analyses')
    .insert({
      user_id: userId,
      comic_title: analysis.comic_title,
      analysis_text: analysis.analysis_text,
      estimated_value: analysis.graded_value,
      image_url: imageUrl
    });

  if (insertError) throw insertError;
};