import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { DeleteComicButton } from "./DeleteComicButton";
import { useRealtimeSubscription } from "@/utils/useRealtimeSubscription";
import { Badge } from "@/components/ui/badge";

interface Comic {
  id: string;
  comic_title: string;
  condition_rating: string | null;
  estimated_value: number | null;
  added_at: string;
  is_graded: boolean;
}

export const ComicCollection = () => {
  const [comics, setComics] = useState<Comic[]>([]);

  const fetchComics = async () => {
    const { data: userComics, error } = await supabase
      .from('user_comics')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching comics:', error);
      return;
    }

    setComics(userComics);
  };

  useRealtimeSubscription('user_comics', fetchComics);

  useEffect(() => {
    fetchComics();
  }, []);

  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-orange-800 min-w-[140px] md:min-w-[200px] px-2 md:px-4">Title</TableHead>
                <TableHead className="text-orange-800 min-w-[100px] px-2 md:px-4">Condition</TableHead>
                <TableHead className="text-orange-800 min-w-[80px] px-2 md:px-4">Value</TableHead>
                <TableHead className="text-orange-800 min-w-[90px] px-2 md:px-4">Added</TableHead>
                <TableHead className="text-orange-800 min-w-[80px] px-2 md:px-4">Status</TableHead>
                <TableHead className="text-orange-800 w-[50px] px-2 md:px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comics.map((comic) => (
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
                      onDelete={fetchComics}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};