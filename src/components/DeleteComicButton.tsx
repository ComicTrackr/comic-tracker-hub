import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DeleteComicButtonProps {
  comicId: string;
  onDelete: () => Promise<void>;
}

export const DeleteComicButton = ({ comicId, onDelete }: DeleteComicButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('user_comics')
        .delete()
        .eq('id', comicId);

      if (error) {
        throw error;
      }

      await onDelete();

      toast({
        title: "Success",
        description: "Comic removed from collection",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to delete comic from collection",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 hover:bg-red-100"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};