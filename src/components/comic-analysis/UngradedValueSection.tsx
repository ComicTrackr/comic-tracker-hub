import { useState } from "react";
import { ConditionSelector } from "./ConditionSelector";

interface Props {
  ungradedValue: number;
  onAddToCollection: (isGraded: boolean, grade: string, value: number) => void;
}

export const UNGRADED_CONDITIONS = [
  "Near Mint/Mint",
  "Near Mint",
  "Very Fine",
  "Fine",
  "Very Good",
  "Good",
  "Fair",
  "Poor"
];

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

export const UngradedValueSection = ({ ungradedValue, onAddToCollection }: Props) => {
  const [selectedUngradedCondition, setSelectedUngradedCondition] = useState("Near Mint");

  const handleUngradedAdd = () => {
    const adjustedValue = calculateUngradedValue(ungradedValue, selectedUngradedCondition);
    onAddToCollection(false, selectedUngradedCondition, adjustedValue);
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm md:text-base">Ungraded Value</h4>
      <p className="text-2xl md:text-3xl font-bold">
        ${ungradedValue.toLocaleString()}
      </p>
      <ConditionSelector
        conditions={UNGRADED_CONDITIONS}
        selectedCondition={selectedUngradedCondition}
        onConditionChange={setSelectedUngradedCondition}
        onAddToCollection={handleUngradedAdd}
        label="Add Ungraded Copy"
      />
    </div>
  );
};