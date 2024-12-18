import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/utils/useRealtimeSubscription";
import { ComicTableHeader } from "./comic-collection/ComicTableHeader";
import { ComicTableRow } from "./comic-collection/ComicTableRow";

interface Comic {
  id: string;
  comic_title: string;
  condition_rating: string | null;
  estimated_value: number | null;
  added_at: string;
  is_graded: boolean;
  image_url: string | null;
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

    console.log('Fetched comics:', userComics);
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
            <ComicTableHeader />
            <TableBody>
              {comics.map((comic) => (
                <ComicTableRow 
                  key={comic.id}
                  comic={comic}
                  onDelete={fetchComics}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};