import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteComicButton } from "../DeleteComicButton";

interface Comic {
  id: string;
  comic_title: string;
  condition_rating: string | null;
  estimated_value: number | null;
  added_at: string;
  is_graded: boolean;
  image_url: string | null;
}

interface ComicTableRowProps {
  comic: Comic;
  onDelete: () => Promise<void>;
}

export const ComicTableRow = ({ comic, onDelete }: ComicTableRowProps) => {
  return (
    <TableRow key={comic.id}>
      <TableCell className="font-medium break-words px-2 md:px-4 text-sm md:text-base">
        {comic.comic_title}
      </TableCell>
      <TableCell className="whitespace-normal px-2 md:px-4 text-sm md:text-base">
        {comic.condition_rating || 'N/A'}
      </TableCell>
      <TableCell className="px-2 md:px-4 text-sm md:text-base">
        {comic.estimated_value 
          ? `$${comic.estimated_value.toLocaleString()}`
          : 'N/A'
        }
      </TableCell>
      <TableCell className="whitespace-nowrap px-2 md:px-4 text-sm md:text-base">
        {new Date(comic.added_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="px-2 md:px-4 text-sm md:text-base">
        <Badge variant={comic.is_graded ? "default" : "secondary"}>
          {comic.is_graded ? "Graded" : "Raw"}
        </Badge>
      </TableCell>
      <TableCell className="px-2 md:px-4">
        <DeleteComicButton 
          comicId={comic.id}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};