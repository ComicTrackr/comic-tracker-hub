import { useState } from "react";
import { SalesInfo } from "@/components/comic-analysis/SalesInfo";
import { ConditionSelector } from "@/components/comic-analysis/ConditionSelector";

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

const GRADED_CONDITIONS = [
  "9.8 Near Mint/Mint",
  "9.6 Near Mint+",
  "9.4 Near Mint",
  "9.2 Near Mint-",
  "9.0 Very Fine/Near Mint",
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

const calculateGradedValue = (baseValue: number, selectedGrade: string): number => {
  const gradeNumber = parseFloat(selectedGrade.split(' ')[0]);
  const ratio = gradeNumber / 9.8; // Using 9.8 as baseline
  return Math.round(baseValue * ratio);
};

const calculateUngradedValue = (baseValue: number, selectedCondition: string): number => {
  const conditionValues: { [key: string]: number } = {
    "Near Mint/Mint": 1,
    "Near Mint": 0.9,
    "Very Fine": 0.7,
    "Fine": 0.5,
    "Very Good": 0.3,
    "Good": 0.2,
    "Fair": 0.1,
    "Poor": 0.05
  };
  return Math.round(baseValue * (conditionValues[selectedCondition] || 1));
};

export const ComicAnalysisResult = ({ result, onAddToCollection, onNewSearch }: Props) => {
  const [selectedGradedCondition, setSelectedGradedCondition] = useState("9.8 Near Mint/Mint");
  const [selectedUngradedCondition, setSelectedUngradedCondition] = useState("Near Mint");

  const handleGradedAdd = () => {
    const adjustedValue = calculateGradedValue(result.graded_value, selectedGradedCondition);
    onAddToCollection(true, selectedGradedCondition, adjustedValue);
  };

  const handleUngradedAdd = () => {
    const adjustedValue = calculateUngradedValue(result.ungraded_value, selectedUngradedCondition);
    onAddToCollection(false, selectedUngradedCondition, adjustedValue);
  };

  return (
    <div className="bg-secondary p-4 rounded-lg space-y-4 w-full max-w-full overflow-hidden">
      <div className="space-y-2">
        <h3 className="text-lg md:text-xl font-semibold">{result.comic_title}</h3>
        <p className="text-sm md:text-base whitespace-pre-line">{result.analysis_text}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm md:text-base">Graded Value</h4>
          <p className="text-2xl md:text-3xl font-bold">
            ${result.graded_value.toLocaleString()}
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm md:text-base">Ungraded Value</h4>
          <p className="text-2xl md:text-3xl font-bold">
            ${result.ungraded_value.toLocaleString()}
          </p>
        </div>
      </div>

      <SalesInfo
        recentGradedSales={result.recent_graded_sales}
        recentUngradedSales={result.recent_ungraded_sales}
      />

      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConditionSelector
            conditions={GRADED_CONDITIONS}
            selectedCondition={selectedGradedCondition}
            onConditionChange={setSelectedGradedCondition}
            onAddToCollection={handleGradedAdd}
            label="Add Graded Copy"
          />
          <ConditionSelector
            conditions={UNGRADED_CONDITIONS}
            selectedCondition={selectedUngradedCondition}
            onConditionChange={setSelectedUngradedCondition}
            onAddToCollection={handleUngradedAdd}
            label="Add Ungraded Copy"
          />
        </div>
        <button
          onClick={onNewSearch}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Start New Search
        </button>
      </div>
    </div>
  );
};