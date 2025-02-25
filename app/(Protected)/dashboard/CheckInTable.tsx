"use client";

import { SimpleDataTable } from "@/components/SimpleDataTable";
import { Card, CardHeader } from "@/components/ui/card";
import { useTranslation } from "next-export-i18n";
import { useQuery } from "@tanstack/react-query";
import { dashboardCheckIn } from "@/app/ServerAction/dashboard.action";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
export default function CheckInTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["checkIn"],
    queryFn: async () => {
      const res = await dashboardCheckIn();
      const cleaned = res.res.filter((item: any) => item.CheckInActual != null)
      const dateSort = cleaned.sort((a: any, b: any) => { return Date.parse(b.CheckOutDate) - Date.parse(a.CheckOutDate)});
      console.log(dateSort)
      const top5 = dateSort.slice(0, 5);
      if (!res.success) throw new Error();
      return top5;
    },
  });
  const { t } = useTranslation();
  const generalI18n = t("general");
  const dashboardI18n = t("DashboardPage");
  const columns = [
    {
      accessorKey: "Guest",
      header: generalI18n.name,
      cell: (cell: any) => {
        return <div>{cell.getValue() || "No Name"}</div>;
      },
    },
    {
      accessorKey: "RoomNumber",
      header: dashboardI18n.roomNumber,
      cell: (cell: any) => {
        return (
          <p>
            {
              cell.getValue().length > 0 ? (
                cell.getValue().map((item: any) => <p key={item}>{item}</p>)
              ) : (
                <p>No Room Set Yet</p>
              )
            }
          </p>
        );
      },
    },
    {
      accessorKey: "CheckInActual",
      header: dashboardI18n.checkInTime,
      cell: (row: any) => {
        return <div>{row.getValue("CheckInActual") ? format(row.getValue("CheckInActual"), "MMM dd, yyyy | hh:mm a") : "-"}</div>;
      },
    },
  ];

  return (
    <Card className="border-1.5 bg-cstm-card pt-0 shadow-sm basis-1/3">
      <CardHeader className="rounded-t-sm bg-cstm-primary p-3 pl-5 font-semibold text-white">
        {dashboardI18n.forCheckIn}
      </CardHeader>
      <SimpleDataTable
        isLoading={isLoading}
        columns={columns}
        data={data ?? []}
      />
    </Card>
  );
}
