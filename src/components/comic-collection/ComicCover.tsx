import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComicCoverProps {
  imageUrl: string | null;
  title: string;
}

export const ComicCover = ({ imageUrl, title }: ComicCoverProps) => {
  // Default placeholder image from Unsplash
  const fallbackImageUrl = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";

  return (
    <Avatar className="h-12 w-12">
      {imageUrl || fallbackImageUrl ? (
        <AvatarImage 
          src={imageUrl || fallbackImageUrl}
          alt={title}
          className="object-cover"
          onError={(e) => {
            console.error('Image load error for:', title);
            // If the main image fails, try the fallback
            if (imageUrl && e.currentTarget.src !== fallbackImageUrl) {
              e.currentTarget.src = fallbackImageUrl;
            }
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