interface ComicAnalysis {
  comic_title: string;
  graded_value: number;
  ungraded_value: number;
  recent_graded_sales: string;
  recent_ungraded_sales: string;
  analysis_text: string;
  cover_image_url: string | null;
}

export const parseGeminiResponse = (text: string, coverImageUrl: string | null): ComicAnalysis => {
  const titleMatch = text.match(/Title:\s*(.+?)(?=\n|$)/i);
  const gradedValueMatch = text.match(/GradedValue:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i);
  const ungradedValueMatch = text.match(/UngradedValue:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i);
  const recentGradedSalesMatch = text.match(/RecentGradedSales:\s*(.+?)(?=\n(?:[A-Za-z]+:|$))/is);
  const recentUngradedSalesMatch = text.match(/RecentUngradedSales:\s*(.+?)(?=\n(?:[A-Za-z]+:|$))/is);
  const analysisMatch = text.match(/Analysis:\s*(.+?)(?=\n|$)/is);

  const validImageUrl = coverImageUrl && (
    coverImageUrl.endsWith('.jpg') || 
    coverImageUrl.endsWith('.jpeg') || 
    coverImageUrl.endsWith('.png')
  ) ? coverImageUrl : null;

  const gradedValue = gradedValueMatch ? 
    parseFloat(gradedValueMatch[1].replace(/,/g, '')) : 
    0;

  const ungradedValue = ungradedValueMatch ? 
    parseFloat(ungradedValueMatch[1].replace(/,/g, '')) : 
    0;

  const finalGradedValue = Math.max(gradedValue, ungradedValue * 2);

  return {
    comic_title: titleMatch ? titleMatch[1].trim() : 'Unknown Comic',
    graded_value: finalGradedValue,
    ungraded_value: ungradedValue,
    recent_graded_sales: recentGradedSalesMatch ? 
      recentGradedSalesMatch[1].trim() : 
      'No recent graded sales data',
    recent_ungraded_sales: recentUngradedSalesMatch ? 
      recentUngradedSalesMatch[1].trim() : 
      'No recent ungraded sales data',
    analysis_text: analysisMatch ? 
      analysisMatch[1].trim() : 
      'Analysis not available',
    cover_image_url: validImageUrl
  };
};