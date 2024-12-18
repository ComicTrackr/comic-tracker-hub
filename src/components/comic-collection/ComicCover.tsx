import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComicCoverProps {
  imageUrl: string | null;
  title: string;
}

export const ComicCover = ({ imageUrl, title }: ComicCoverProps) => {
  return (
    <Avatar className="h-12 w-12">
      {imageUrl ? (
        <AvatarImage 
          src={imageUrl} 
          alt={title}
          className="object-cover"
          onError={(e) => {
            console.error('Image load error:', e);
            e.currentTarget.src = '/placeholder.svg';
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