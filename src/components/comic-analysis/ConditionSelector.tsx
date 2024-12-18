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
    <div className="space-y-1">
      <Select
        value={selectedCondition}
        onValueChange={onConditionChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select condition" />
        </SelectTrigger>
        <SelectContent>
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
        className="w-full flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
};