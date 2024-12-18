import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComicCoverProps {
  imageUrl: string | null;
  title: string;
}

export const ComicCover = ({ imageUrl, title }: ComicCoverProps) => {
  const [imageError, setImageError] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string>("/placeholder.svg");
  const fallbackImageUrl = "/placeholder.svg";

  useEffect(() => {
    console.log('ComicCover received imageUrl:', imageUrl);
    if (imageUrl) {
      setDisplayUrl(imageUrl);
      setImageError(false);
    } else {
      console.log('No image URL provided, using fallback');
      setDisplayUrl(fallbackImageUrl);
    }
  }, [imageUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image load error for:', title);
    console.error('Failed URL:', imageUrl);
    console.error('Error event:', e);
    setImageError(true);
    setDisplayUrl(fallbackImageUrl);
  };

  return (
    <Avatar className="h-12 w-12">
      <AvatarImage 
        src={displayUrl}
        alt={title}
        className="object-cover"
        onError={handleImageError}
      />
      <AvatarFallback>
        {title.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};