import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "lucide-react";

interface ComicCoverProps {
  imageUrl: string | null;
  title: string;
}

export const ComicCover = ({ imageUrl, title }: ComicCoverProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (imageUrl && !imageError) {
      console.log('Loading image:', imageUrl);
      setIsLoading(true);
      setDisplayUrl(imageUrl);
    } else {
      console.log('Using fallback for:', title);
      setDisplayUrl("/placeholder.svg");
      setIsLoading(false);
    }
  }, [imageUrl, imageError, title]);

  const handleImageError = () => {
    console.error('Failed to load image:', imageUrl);
    setImageError(true);
    setIsLoading(false);
    setDisplayUrl("/placeholder.svg");
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageUrl);
    setIsLoading(false);
  };

  return (
    <Avatar className="h-12 w-12 bg-muted">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <AvatarImage 
        src={displayUrl}
        alt={title}
        className="object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      <AvatarFallback className="bg-orange-100 text-orange-800">
        {title.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};