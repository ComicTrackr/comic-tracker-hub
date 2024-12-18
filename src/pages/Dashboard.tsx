import { Card } from "@/components/ui/card";
import { ComicValueChart } from "@/components/ComicValueChart";
import { ComicCollection } from "@/components/ComicCollection";
import { Navbar } from "@/components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-800">My Collection Dashboard</h1>
        
        <div className="grid gap-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-orange-800">Collection Value Over Time</h2>
            <div className="h-[250px] md:h-[300px] w-full">
              <ComicValueChart />
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-orange-800">My Comics</h2>
            <ComicCollection />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;