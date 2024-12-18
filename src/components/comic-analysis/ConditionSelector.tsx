import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConditionSelectorProps {
  conditions: string[];
  selectedCondition: string;
  onConditionChange: (value: string) => void;
  onAddToCollection: () => void;
  label: string;
}

export const ConditionSelector = ({
  conditions,
  selectedCondition,
  onConditionChange,
  onAddToCollection,
  label
}: ConditionSelectorProps) => {
  return (
    <div className="space-y-2 w-full">
      <Select
        value={selectedCondition}
        onValueChange={onConditionChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select condition" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {conditions.map((condition) => (
            <SelectItem key={condition} value={condition}>
              {condition}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={onAddToCollection}
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-2"
      >
        <PlusCircle className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
};