"use client";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useTranslation } from "next-export-i18n";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useQueries } from "@tanstack/react-query";
import {
  thisMonthSales,
  todayBooking,
  todaySales,
} from "@/app/ServerAction/dashboard.action";
import { BanknoteIcon, BookMarkedIcon, JapaneseYenIcon, Loader } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { formatCurrencyJP } from "@/utils/Helpers";

export default function CardShowcase({ className }: { className?: string }) {
  const cardClassName =
    "border-1.5 flex w-1/3 flex-col items-center justify-center gap-4 rounded-3xl bg-cstm-card px-2 py-3 shadow-sm";
  const subCardClassName =
    "w-2/3 bg-cstm-primary px-3 py-2 text-center shadow-none";
  const { t } = useTranslation();
  const dashboardI18n = t("DashboardPage");
  const results = useQueries({
    queries: [
      {
        queryKey: ["bookingsToday"],
        queryFn: async () => {
          const res = await todayBooking();
          if (!res.success) throw new Error();
          return res.res;
        },
      },
      {
        queryKey: ["salesToday"],
        queryFn: async () => {
          const res = await todaySales();
          if (!res.success) throw new Error();
          return res.res;
        },
      },
      {
        queryKey: ["salesThisMonth"],
        queryFn: async () => {
          console.log("hi");
          const res = await thisMonthSales();
          if (!res.success) throw new Error();
          return res.res;
        },
      },
    ],
  });
  
  return (
    <>
      {/* <div className={cn(className, "flex gap-4")}>
        <Card className={cardClassName}>
          <Image
            width={100}
            height={100}
            alt="bookings"
            src="/Logos/bookings.png"
          />
          <h1 className="text-center font-medium text-white">
            {dashboardI18n.bookingsToday}
          </h1>
          <Card className={subCardClassName}>
            {results[0].isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <p>{results[0].data.ReservationNow || 0}</p>
            )}
          </Card>
        </Card>
        <Card className={cardClassName}>
          <Image
            width={100}
            height={100}
            alt="salestoday"
            src="/Logos/salestoday.png"
          />
          <h1 className="text-center font-medium text-white">
            {dashboardI18n.salesToday}
          </h1>
          <Card className={subCardClassName}>
            {results[1].isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <p>{results[1].data.TodaysSales || 0}</p>
            )}
          </Card>
        </Card>
        <Card className={cardClassName}>
          <Image
            width={100}
            height={100}
            alt="salesmonth"
            src="/Logos/salesmonthly.png"
          />
          <h1 className="text-center font-medium text-white">
            {dashboardI18n.salesThisMonth}
          </h1>
          <Card className={subCardClassName}>
            {results[2].isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <p>{results[2].data.SalesThisMonth || 0}</p>
            )}
          </Card>
        </Card>
      </div> */}
      <div className="flex gap-3">
        <DashboardCard title={dashboardI18n.bookingsToday} icon={<BookMarkedIcon className="size-10" strokeWidth={1}/>} count={results[0].isLoading ? undefined : results[0].data.ReservationNow || 0} />
        <DashboardCard title={dashboardI18n.salesToday} icon={<BanknoteIcon className="size-10" strokeWidth={1}/>} count={results[1].isLoading ? undefined : `¥${formatCurrencyJP(results[1].data.SalesToday) || 0}`} />
        <DashboardCard title={dashboardI18n.salesThisMonth} icon={<JapaneseYenIcon className="size-10" strokeWidth={1} />} count={results[2].isLoading ? undefined  : `¥${formatCurrencyJP(results[2].data.SalesThisMonth) || 0}`} />
      </div>
    </>
  );
}
