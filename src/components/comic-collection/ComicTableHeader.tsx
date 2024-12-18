import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ComicTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-orange-800 w-[80px] px-2 md:px-4">Cover</TableHead>
        <TableHead className="text-orange-800 min-w-[140px] md:min-w-[200px] px-2 md:px-4">Title</TableHead>
        <TableHead className="text-orange-800 min-w-[100px] px-2 md:px-4">Condition</TableHead>
        <TableHead className="text-orange-800 min-w-[80px] px-2 md:px-4">Value</TableHead>
        <TableHead className="text-orange-800 min-w-[90px] px-2 md:px-4">Added</TableHead>
        <TableHead className="text-orange-800 min-w-[80px] px-2 md:px-4">Status</TableHead>
        <TableHead className="text-orange-800 w-[50px] px-2 md:px-4">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};