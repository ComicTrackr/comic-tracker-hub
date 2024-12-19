import { SalesInfo } from "@/components/comic-analysis/SalesInfo";
import { GradedValueSection } from "@/components/comic-analysis/GradedValueSection";
import { UngradedValueSection } from "@/components/comic-analysis/UngradedValueSection";

interface ComicAnalysisResult {
  comic_title: string;
  analysis_text: string;
  graded_value: number;
  ungraded_value: number;
  recent_graded_sales: string;
  recent_ungraded_sales: string;
}

interface Props {
  result: ComicAnalysisResult;
  onAddToCollection: (isGraded: boolean, grade: string, value: number) => void;
  onNewSearch: () => void;
}

export const ComicAnalysisResult = ({ result, onAddToCollection, onNewSearch }: Props) => {
  return (
    <div className="bg-secondary p-4 rounded-lg space-y-4 w-full max-w-full overflow-hidden">
      <div className="space-y-2">
        <h3 className="text-lg md:text-xl font-semibold">{result.comic_title}</h3>
        <p className="text-sm md:text-base whitespace-pre-line">{result.analysis_text}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GradedValueSection 
          gradedValue={result.graded_value}
          onAddToCollection={onAddToCollection}
        />
        <UngradedValueSection 
          ungradedValue={result.ungraded_value}
          onAddToCollection={onAddToCollection}
        />
      </div>

      <SalesInfo
        recentGradedSales={result.recent_graded_sales}
        recentUngradedSales={result.recent_ungraded_sales}
      />

      <button
        onClick={onNewSearch}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Start New Search
      </button>
    </div>
  );
};