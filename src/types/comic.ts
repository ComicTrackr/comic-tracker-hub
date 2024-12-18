export interface ComicAnalysisResult {
  comic_title: string;
  analysis_text: string;
  graded_value: number;
  ungraded_value: number;
  recent_graded_sales: string;
  recent_ungraded_sales: string;
  cover_image_url?: string;
}