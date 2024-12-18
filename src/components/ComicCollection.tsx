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

interface Comic {
  id: string;
  comic_title: string;
  condition_rating: string | null;
  estimated_value: number | null;
  added_at: string;
}

export const ComicCollection = () => {
  const [comics, setComics] = useState<Comic[]>([]);

  useEffect(() => {
    // Initial fetch of comics
    fetchComics();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_comics'
        },
        () => {
          fetchComics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-orange-800">Title</TableHead>
            <TableHead className="text-orange-800">Condition</TableHead>
            <TableHead className="text-orange-800">Value</TableHead>
            <TableHead className="text-orange-800">Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comics.map((comic) => (
            <TableRow key={comic.id}>
              <TableCell className="font-medium">{comic.comic_title}</TableCell>
              <TableCell>{comic.condition_rating || 'N/A'}</TableCell>
              <TableCell>
                {comic.estimated_value 
                  ? `$${comic.estimated_value.toLocaleString()}`
                  : 'N/A'
                }
              </TableCell>
              <TableCell>
                {new Date(comic.added_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};