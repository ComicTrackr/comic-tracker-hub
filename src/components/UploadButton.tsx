import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComicCollection } from "@/hooks/useComicCollection";
import { ComicAnalysisResult } from "@/components/ComicAnalysisResult";
import { useComicUpload } from "@/hooks/useComicUpload";

export const UploadButton = () => {
  const { analysisResult, setAnalysisResult, addToCollection } = useComicCollection();
  const { isAnalyzing, handleFileUpload } = useComicUpload();

  const handleFileChange = async (file: File) => {
    const result = await handleFileUpload(file);
    if (result) {
      setAnalysisResult(result);
    }
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
        <input
          id="comic-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileChange(file);
            }
          }}
        />
      </Button>

      {analysisResult && (
        <ComicAnalysisResult 
          result={analysisResult}
          onAddToCollection={() => addToCollection(analysisResult)}
        />
      )}
    </div>
  );
};