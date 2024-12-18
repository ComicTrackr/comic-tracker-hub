import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - replace with real data later
const mockComics = [
  {
    id: 1,
    title: "Amazing Spider-Man",
    volume: 1,
    issueNumber: 300,
    value: 1200.00,
    lastUpdated: "2024-03-20",
  },
  {
    id: 2,
    title: "X-Men",
    volume: 1,
    issueNumber: 141,
    value: 450.00,
    lastUpdated: "2024-03-20",
  },
  // Add more mock data as needed
];

export const ComicCollection = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-orange-800">Title</TableHead>
            <TableHead className="text-orange-800">Volume</TableHead>
            <TableHead className="text-orange-800">Issue #</TableHead>
            <TableHead className="text-orange-800">Value</TableHead>
            <TableHead className="text-orange-800">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockComics.map((comic) => (
            <TableRow key={comic.id}>
              <TableCell className="font-medium">{comic.title}</TableCell>
              <TableCell>{comic.volume}</TableCell>
              <TableCell>{comic.issueNumber}</TableCell>
              <TableCell>${comic.value.toLocaleString()}</TableCell>
              <TableCell>{new Date(comic.lastUpdated).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};