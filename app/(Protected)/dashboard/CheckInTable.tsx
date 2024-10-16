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
      if (!res.success) throw new Error();
      return res.res;
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
      accessorKey: "CheckInDate",
      header: dashboardI18n.checkInTime,
      cell: (cell: any) => {
        return <div>{format(cell.getValue(), "MMM dd, yyyy")}</div>;
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
