import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UploadButton = () => {
  return (
    <Button
      className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
      onClick={() => document.getElementById('comic-upload')?.click()}
    >
      <Upload className="h-4 w-4" />
      Upload Comic Cover
      <input
        id="comic-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          // Handle file upload here
          console.log("File selected:", e.target.files?.[0]);
        }}
      />
    </Button>
  );
};