"use client";

import { Card, CardHeader } from "@/components/ui/card";
import SalesController from "./SalesController";
import SalesTable from "./SalesTable";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { getSalesReport } from "@/app/ServerAction/reports.action";
import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { exportCSV, printCSV } from "@/utils/Helpers";
import { format } from "date-fns";

const SalesChart = dynamic(() => import("./SalesChart"), {
  loading: () => <Skeleton className="w-1/2 h-80"/>,
  ssr: false,
});
export default function page() {

  const [filteredSales, setFilteredSales] = useState<any[]>([]);

  const { data: sales, isLoading, refetch } = useQuery({
    queryKey: ["getSalesReport"],
    queryFn: async () => {
      const res = await getSalesReport();
      if (!res.success) {
        throw new Error();
      }
      return res.res;
    },
  });

  const {
    selectedReportRange,
    companyName
  } = useGlobalStore()

  const parseBillingMonth = (billingMonth: string) => {
    const [month, year] = billingMonth.split(' ').filter(Boolean)
    return new Date(`${month} 1, ${year}`)
  }

  useEffect(() => {
    if(sales && selectedReportRange) {
      const filtered = sales.filter((entry: any) => {
        const billingDate = parseBillingMonth(entry.BillingMonth);
        return (
          billingDate >= selectedReportRange.from &&
          billingDate <= selectedReportRange.to
        )
      })
      setFilteredSales(filtered) 
    }
  }, [sales, selectedReportRange] )

  return (
    <div>
      <SalesController>
        <Card className="mx-4 flex flex-col bg-cstm-secondary">
          <CardHeader className="rounded-t-sm bg-cstm-primary p-3 pl-5 font-semibold text-white">
            Sales Report
          </CardHeader>
          <div className="flex flex-col gap-4 p-4">
            <SalesTable sales={filteredSales} isLoading={isLoading} />
            <SalesChart data={filteredSales} isLoading={isLoading} />
          </div>
        </Card>
      </SalesController>
      
      <div className="flex gap-4 p-4">
        <Button 
          className=""
          onClick={() => exportCSV(filteredSales)}
        >
          Export To Excel
        </Button>
        <Button 
          className=""
          onClick={() => printCSV(filteredSales, {
            filename: "",
            title: `Sales Report (${format(new Date(selectedReportRange.from), 'MMMM yyyy')} to ${format(new Date(selectedReportRange.to), 'MMMM yyyy')})`,
            companyName: companyName
          })}
          >Print</Button>
      </div>
    </div>
  );
}
