import { useState } from "react";
import { ConditionSelector } from "./ConditionSelector";

interface Props {
  gradedValue: number;
  onAddToCollection: (isGraded: boolean, grade: string, value: number) => void;
}

export const GRADED_CONDITIONS = [
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

const calculateGradedValue = (baseValue: number, selectedGrade: string): number => {
  const gradeNumber = parseFloat(selectedGrade.split(' ')[0]);
  const ratio = gradeNumber / 9.8;
  return Math.round(baseValue * ratio);
};

export const GradedValueSection = ({ gradedValue, onAddToCollection }: Props) => {
  const [selectedGradedCondition, setSelectedGradedCondition] = useState("9.8 Near Mint/Mint");

  const handleGradedAdd = () => {
    const adjustedValue = calculateGradedValue(gradedValue, selectedGradedCondition);
    onAddToCollection(true, selectedGradedCondition, adjustedValue);
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm md:text-base">Graded Value</h4>
      <p className="text-2xl md:text-3xl font-bold">
        ${gradedValue.toLocaleString()}
      </p>
      <ConditionSelector
        conditions={GRADED_CONDITIONS}
        selectedCondition={selectedGradedCondition}
        onConditionChange={setSelectedGradedCondition}
        onAddToCollection={handleGradedAdd}
        label="Add Graded Copy"
      />
    </div>
  );
};