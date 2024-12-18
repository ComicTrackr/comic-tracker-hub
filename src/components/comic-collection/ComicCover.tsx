import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComicCoverProps {
  imageUrl: string | null;
  title: string;
}

export const ComicCover = ({ imageUrl, title }: ComicCoverProps) => {
  // Default placeholder image from Unsplash
  const fallbackImageUrl = "/placeholder.svg";

  return (
    <Avatar className="h-12 w-12">
      {imageUrl ? (
        <AvatarImage 
          src={imageUrl}
          alt={title}
          className="object-cover"
          onError={(e) => {
            console.error('Image load error for:', title);
            e.currentTarget.src = fallbackImageUrl;
          }}
        />
      ) : (
        <AvatarFallback>
          {title.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};