"use client";
import { Card, CardHeader } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const data = [
  {
    name: "Jan",
    sales: 2400,
  },
  {
    name: "Feb",
    sales: 1398,
  },
  {
    name: "Mar",
    sales: 9800,
  },
  {
    name: "Apr",
    sales: 3908,
  },
  {
    name: "May",
    sales: 4800,
  },
  {
    name: "Jun",
    sales: 3490,
  },
  {
    name: "Jul",
    sales: 4300,
  },
  {
    name: "Aug",
    sales: 3490,
  },
  {
    name: "Sept",
    sales: 3490,
  },
  {
    name: "Oct",
    sales: 3490,
  },
  {
    name: "Nov",
    sales: 3490,
  },
  {
    name: "Dec",
    sales: 3490,
  },
];
import { useTranslation } from "next-export-i18n";
import { useQuery } from "@tanstack/react-query";
import { monthlySales } from "@/app/ServerAction/dashboard.action";

export default function MonthlySalesChart() {
  const {
    data: res,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["monthlySales"],
    queryFn: async () => {
      const res = await monthlySales();
      if (!res.success) throw new Error();
      return res.res as any;
    },
  });
  const { t, locale } = useTranslation();
  const generalI18n = t("general");
  const dashboardI18n = t("DashboardPage");

  return (
    <Card className="border-1.5 bg-cstm-card shadow-sm">
      <CardHeader className="rounded-t-md bg-cstm-primary p-3 pl-5 text-xl font-semibold text-white">
        {dashboardI18n.monthlySales}
      </CardHeader>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart width={672} height={250} data={res ?? []}>
            <CartesianGrid vertical horizontal={false} stroke={"#fff"} />
            <XAxis dataKey="Month" tick={{ fill: "hsl(206, 88%, 94%, 1)" }} />
            <YAxis tick={{ fill: "hsl(206, 88%, 94%, 1)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsla(203, 63%, 20%, 1)",
                borderRadius: "15px",
                color: "white",
              }}
            />
            <Legend />
            <Line
              name="Sales"
              type="monotone"
              dataKey="Total"
              stroke="hsl(206, 88%, 94%, 1)"
              strokeWidth={2.5}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
