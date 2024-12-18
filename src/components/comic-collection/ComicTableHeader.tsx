import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ComicTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-orange-800 w-[40%] px-4">Title</TableHead>
        <TableHead className="text-orange-800 w-[15%] px-4">Condition</TableHead>
        <TableHead className="text-orange-800 w-[15%] px-4">Value</TableHead>
        <TableHead className="text-orange-800 w-[15%] px-4">Added</TableHead>
        <TableHead className="text-orange-800 w-[10%] px-4">Status</TableHead>
        <TableHead className="text-orange-800 w-[5%] px-4">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};