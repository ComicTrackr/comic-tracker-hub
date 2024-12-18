import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComicCoverProps {
  imageUrl: string | null;
  title: string;
}

export const ComicCover = ({ imageUrl, title }: ComicCoverProps) => {
  const [imageError, setImageError] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (imageUrl && !imageError) {
      console.log('Setting image URL:', imageUrl);
      setDisplayUrl(imageUrl);
    } else {
      console.log('Using fallback for:', title);
      setDisplayUrl("/placeholder.svg");
    }
  }, [imageUrl, imageError, title]);

  const handleImageError = () => {
    console.error('Failed to load image:', imageUrl);
    setImageError(true);
    setDisplayUrl("/placeholder.svg");
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