import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface ComicAnalysisResult {
  comic_title: string;
  analysis_text: string;
  condition_rating: string;
  estimated_value: number;
}

interface Props {
  result: ComicAnalysisResult;
  onAddToCollection: () => void;
}

export const ComicAnalysisResult = ({ result, onAddToCollection }: Props) => {
  return (
    <div className="bg-secondary p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{result.comic_title}</h3>
          <p className="text-sm text-muted-foreground">{result.analysis_text}</p>
          <p className="text-sm">Condition: {result.condition_rating}</p>
          <p className="text-sm">Estimated Value: ${result.estimated_value}</p>
        </div>
        <Button
          onClick={onAddToCollection}
          variant="outline"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add to Collection
        </Button>
      </div>
    </div>
  );
};