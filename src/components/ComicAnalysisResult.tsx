import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface ComicAnalysisResult {
  comic_title: string;
  analysis_text: string;
  graded_value: number;
  ungraded_value: number;
}

interface Props {
  result: ComicAnalysisResult;
  onAddToCollection: (isGraded: boolean) => void;
  onNewSearch: () => void;
}

export const ComicAnalysisResult = ({ result, onAddToCollection, onNewSearch }: Props) => {
  return (
    <div className="bg-secondary p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{result.comic_title}</h3>
          <p className="text-sm text-muted-foreground">{result.analysis_text}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">CGC 9.8 Value: ${result.graded_value.toLocaleString()}</p>
            <p className="text-sm">Ungraded NM Value: ${result.ungraded_value.toLocaleString()}</p>
          </div>
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
          <Button
            onClick={() => onAddToCollection(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Graded Copy
          </Button>
          <Button
            onClick={() => onAddToCollection(false)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Ungraded Copy
          </Button>
        </div>
      </div>
    </div>
  );
};