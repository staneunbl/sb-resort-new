"use client";
import { SimpleDataTable } from "@/components/SimpleDataTable";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { commafy } from "@/utils/Helpers";

export default function SalesTable({ className, sales, isLoading }: { className?: string, sales: any, isLoading: boolean }) {
  // const { data: sales, isLoading } = useQuery({
  //   queryKey: ["getSalesReport"],
  //   queryFn: async () => {
  //     const res = await getSalesReport();
  //     if (!res.success) {
  //       throw new Error();
  //     }
  //     return res.res;
  //   },
  // });

  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "BillingMonth",
      header: "Month",
    },
    {
      accessorKey: "ReservationCount",
      header: () => {
        return <div className="text-center">Reservations</div>;
      },
      cell: ({ cell }: any) => {
        return <div className="text-center">{cell.getValue()}</div>;
      },
    },
    {
      accessorKey: "RoomCount",
      header: () => {
        return <div className="text-center">Total Rooms</div>;
      },
      cell: ({ cell }: any) => {
        return <div className="text-center">{cell.getValue()}</div>;
      },
    },
    {
      accessorKey: "Sales",
      header: () => {
        return <div className="text-center">Sales</div>;
      },
      cell: ({ cell }: any) => {
        return <div className="text-center">P {commafy(cell.getValue())}</div>;
      },
    },
  ];

  return (
    <div className={cn("w-full rounded-sm border", className)}>
      <SimpleDataTable columns={columns} isLoading={isLoading} data={sales || []} />
    </div>
  );
}
