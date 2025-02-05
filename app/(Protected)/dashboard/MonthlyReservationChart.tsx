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
import { useTranslation } from "next-export-i18n";
import { useQuery } from "@tanstack/react-query";
import { monthlyReservations } from "@/app/ServerAction/dashboard.action";
const data = [
  {
    name: "January",
    reservation: 1400,
  },
  {
    name: "February",
    reservation: 1398,
  },
  {
    name: "March",
    reservation: 2800,
  },
  {
    name: "April",
    reservation: 3908,
  },
  {
    name: "May",
    reservation: 4800,
  },
  {
    name: "June",
    reservation: 3490,
  },
  {
    name: "July",
    reservation: 4300,
  },
  {
    name: "August",
    reservation: 3490,
  },
  {
    name: "September",
    reservation: 3490,
  },
  {
    name: "October",
    reservation: 3490,
  },
  {
    name: "November",
    reservation: 3490,
  },
  {
    name: "December",
    reservation: 3490,
  },
];

export default function MonthlyReservationChart() {
  const { t } = useTranslation();
  const dashboardI18n = t("DashboardPage");
  const {
    data: res,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["monthlyReservations"],
    queryFn: async () => {
      const res = await monthlyReservations();
      if (!res.success) throw new Error();
      return res.res as any;
    },
  });
  return (
    <Card className="bg-cstm-card shadow-lg">
      <CardHeader className="rounded-t-md bg-cstm-primary p-3 pl-5 text-xl font-semibold text-white">
        {dashboardI18n.monthlyReservations}
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
              name="Total"
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
