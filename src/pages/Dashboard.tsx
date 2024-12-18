import { Card } from "@/components/ui/card";
import { ComicValueChart } from "@/components/ComicValueChart";
import { ComicCollection } from "@/components/ComicCollection";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 space-y-8">
        <h1 className="text-3xl font-bold text-orange-800">My Collection Dashboard</h1>
        
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-800">Collection Value Over Time</h2>
            <div className="h-[400px]">
              <ComicValueChart />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-800">My Comics</h2>
            <ComicCollection />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;