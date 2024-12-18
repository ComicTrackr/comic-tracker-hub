import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { month: "Jan", value: 4000 },
  { month: "Feb", value: 4500 },
  { month: "Mar", value: 4200 },
  { month: "Apr", value: 4800 },
  { month: "May", value: 5100 },
  { month: "Jun", value: 5400 },
  { month: "Jul", value: 5200 },
  { month: "Aug", value: 5600 },
  { month: "Sep", value: 5800 },
  { month: "Oct", value: 6200 },
  { month: "Nov", value: 6500 },
  { month: "Dec", value: 6800 },
];

export const ComicValueChart = () => {
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
      <BarChart data={mockData}>
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