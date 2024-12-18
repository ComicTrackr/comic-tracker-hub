import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComicCollection } from "@/hooks/useComicCollection";
import { ComicAnalysisResult } from "@/components/ComicAnalysisResult";
import { useComicUpload } from "@/hooks/useComicUpload";
import { useToast } from "@/components/ui/use-toast";

export const UploadButton = () => {
  const { analysisResult, setAnalysisResult, addToCollection } = useComicCollection();
  const { isAnalyzing, handleFileUpload } = useComicUpload();
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const result = await handleFileUpload(file);
    if (result) {
      setAnalysisResult(result);
    }
  };

  const handleNewSearch = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-4">
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
        onClick={() => document.getElementById('comic-upload')?.click()}
        disabled={isAnalyzing}
      >
        <Upload className="h-4 w-4" />
        {isAnalyzing ? "Analyzing..." : "Upload Comic Cover"}
      </Button>
      <input
        id="comic-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {analysisResult && (
        <ComicAnalysisResult 
          result={analysisResult}
          onAddToCollection={addToCollection}
          onNewSearch={handleNewSearch}
        />
      )}
    </div>
  );
};