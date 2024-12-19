import { useEffect, useState } from "react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/utils/useRealtimeSubscription";
import { MonthlyValue, processComicData } from "@/utils/chartDataProcessing";

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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis
            dataKey="month"
            stroke="#c45a1c"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#c45a1c"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            width={50}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
                    <p className="text-orange-800 font-medium text-sm">
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
      </ResponsiveContainer>
    </ChartContainer>
  );
};