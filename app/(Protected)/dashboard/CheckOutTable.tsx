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
      if (!res.success) throw new Error();
      return res.res;
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
          <HoverCard>
            <HoverCardTrigger>Hover</HoverCardTrigger>
            <HoverCardContent className="text-center">
              {cell.getValue().length > 0 ? (
                cell.getValue().map((item: any) => <p key={item}>{item}</p>)
              ) : (
                <p>No Room Set Yet</p>
              )}
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      accessorKey: "CheckOutDate",
      header: dashboardI18n.checkOutTime,
      cell: (cell: any) => {
        return <div>{format(cell.getValue(), "MMM dd, yyyy")}</div>;
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
