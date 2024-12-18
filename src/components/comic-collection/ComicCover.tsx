import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComicCoverProps {
  imageUrl: string | null;
  title: string;
}

export const ComicCover = ({ imageUrl, title }: ComicCoverProps) => {
  const fallbackImageUrl = "/placeholder.svg";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image load error for:', title, 'URL:', imageUrl);
    e.currentTarget.src = fallbackImageUrl;
  };

  return (
    <Avatar className="h-12 w-12">
      {imageUrl ? (
        <AvatarImage 
          src={imageUrl}
          alt={title}
          className="object-cover"
          onError={handleImageError}
        />
      ) : (
        <AvatarFallback>
          {title.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};