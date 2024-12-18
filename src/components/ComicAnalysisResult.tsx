import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { SalesInfo } from "./comic-analysis/SalesInfo";
import { ConditionSelector } from "./comic-analysis/ConditionSelector";

export interface ComicAnalysisResult {
  comic_title: string;
  analysis_text: string;
  graded_value: number;
  ungraded_value: number;
  recent_graded_sales: string;
  recent_ungraded_sales: string;
}

interface Props {
  result: ComicAnalysisResult;
  onAddToCollection: (isGraded: boolean, grade: string) => void;
  onNewSearch: () => void;
}

const GRADED_CONDITIONS = [
  "10.0 Gem Mint",
  "9.9 Mint",
  "9.8 Near Mint/Mint",
  "9.6 Near Mint+",
  "9.4 Near Mint",
  "9.2 Near Mint-",
  "8.5 Very Fine+",
  "8.0 Very Fine",
  "7.5 Very Fine-",
  "7.0 Fine/Very Fine",
  "6.5 Fine+",
  "6.0 Fine",
  "5.5 Fine-",
  "5.0 Very Good/Fine",
  "4.5 Very Good+",
  "4.0 Very Good",
  "3.5 Very Good-",
  "3.0 Good/Very Good",
  "2.5 Good+",
  "2.0 Good",
  "1.8 Good-",
  "1.5 Fair/Good",
  "1.0 Fair",
  "0.5 Poor"
];

const UNGRADED_CONDITIONS = [
  "Near Mint/Mint",
  "Near Mint",
  "Very Fine",
  "Fine",
  "Very Good",
  "Good",
  "Fair",
  "Poor"
];

export const ComicAnalysisResult = ({ result, onAddToCollection, onNewSearch }: Props) => {
  const [selectedGradedCondition, setSelectedGradedCondition] = useState("9.8 Near Mint/Mint");
  const [selectedUngradedCondition, setSelectedUngradedCondition] = useState("Near Mint");

  return (
    <div className="bg-secondary p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-4 flex-1 mr-4">
          <div>
            <h3 className="font-semibold">{result.comic_title}</h3>
            <p className="text-sm text-muted-foreground">{result.analysis_text}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm">CGC 9.8 Value: ${result.graded_value.toLocaleString()}</p>
              <p className="text-sm">Ungraded NM Value: ${result.ungraded_value.toLocaleString()}</p>
            </div>
          </div>
          
          <SalesInfo 
            recentGradedSales={result.recent_graded_sales}
            recentUngradedSales={result.recent_ungraded_sales}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={onNewSearch}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            New Search
          </Button>
          <div className="space-y-2">
            <ConditionSelector
              conditions={GRADED_CONDITIONS}
              selectedCondition={selectedGradedCondition}
              onConditionChange={setSelectedGradedCondition}
              onAddToCollection={() => onAddToCollection(true, selectedGradedCondition)}
              label="Add Graded Copy"
            />
            <ConditionSelector
              conditions={UNGRADED_CONDITIONS}
              selectedCondition={selectedUngradedCondition}
              onConditionChange={setSelectedUngradedCondition}
              onAddToCollection={() => onAddToCollection(false, selectedUngradedCondition)}
              label="Add Ungraded Copy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};