import { useEffect, useState } from "react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/utils/useRealtimeSubscription";

interface MonthlyValue {
  month: string;
  value: number;
}

const processComicData = (comics: any[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTotals = new Map<string, number>();
  const currentYear = new Date().getFullYear();
  
  // Initialize all months with 0
  months.forEach(month => {
    monthlyTotals.set(month, 0);
  });

  // Calculate running total for each month
  let runningTotal = 0;
  comics?.forEach(comic => {
    if (comic.estimated_value) {
      const date = new Date(comic.added_at);
      // Only process comics from the current year
      if (date.getFullYear() === currentYear) {
        const month = months[date.getMonth()];
        runningTotal += Number(comic.estimated_value);
        monthlyTotals.set(month, runningTotal);
      }
    }
  });

  // Convert to array format for Recharts
  return months.map(month => ({
    month,
    value: monthlyTotals.get(month) || 0
  }));
};

export const ComicValueChart = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyValue[]>([]);

  const fetchAndProcessComicData = async () => {
    const { data: comics, error } = await supabase
      .from('user_comics')
      .select('estimated_value, added_at')
      .order('added_at', { ascending: true });

    if (error) {
      console.error('Error fetching comics:', error);
      return;
    }

    setMonthlyData(processComicData(comics));
  };

  useRealtimeSubscription('user_comics', fetchAndProcessComicData);

  // Initial fetch
  useEffect(() => {
    fetchAndProcessComicData();
  }, []);

  return (
    <ChartContainer
      className="w-full h-full"
      config={{
        value: {
          theme: {
            light: "#c45a1c",
            dark: "#c45a1c",
          },
        },
      }}
    >
      <BarChart data={monthlyData}>
        <XAxis
          dataKey="month"
          stroke="#c45a1c"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#c45a1c"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
                  <p className="text-orange-800 font-medium">
                    ${payload[0].value.toLocaleString()}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" fill="#c45a1c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};
