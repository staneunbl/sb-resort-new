"use client";

import { dashboardCheckOut } from "@/app/ServerAction/dashboard.action";
import { SimpleDataTable } from "@/components/SimpleDataTable";
import { Card, CardHeader } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useTranslation } from "next-export-i18n";
export default function CheckOutTable() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["checkOut"],
    queryFn: async () => {
      const res = await dashboardCheckOut();
      const cleaned = res.res.filter((item: any) => item.CheckOutActual != null)
      const dateSort = cleaned.sort((a: any, b: any) => { return Date.parse(b.CheckOutDate) - Date.parse(a.CheckOutDate)});
      const top5 = dateSort.slice(0, 5);

      if (!res.success) throw new Error();
      return top5;
    },
  });
  const generalI18n = t("general");
  const dashboardI18n = t("DashboardPage");
  const columns = [
    {
      accessorKey: "Guest",
      header: generalI18n.name,
      cell: (cell: any) => {
        return <div>{cell.getValue() || "No Name"}</div>;
      }
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
      accessorKey: "CheckOutActual",
      header: dashboardI18n.checkOutTime,
      cell: (row: any) => {
        return <div>{format(row.getValue("CheckOutActual") || "00", "MMM dd, yyyy | hh:mm a")}</div>;
      },
    },
  ];

  return (
    <Card className="border-1.5 bg-cstm-card pt-0 shadow-sm basis-1/3">
      <CardHeader className="rounded-t-md bg-cstm-primary p-3 pl-5 font-semibold text-white">
        {dashboardI18n.forCheckOut}
      </CardHeader>
      <SimpleDataTable columns={columns} data={data ?? []} />
    </Card>
  );
}
