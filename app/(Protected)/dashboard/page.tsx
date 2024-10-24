import CardShowcase from "./CardShowcase";
import CheckInTable from "./CheckInTable";
import CheckOutTable from "./CheckOutTable";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { PeekUserRole } from "@/app/ServerAction/auth.action";
import { redirect } from "next/navigation";
const MonthlySalesChart = dynamic(() => import("./MonthlySalesChart"), {
  loading: () => <Skeleton  className="w-full h-80" />,
  ssr: false,
});
const MonthlyReservationChart = dynamic(
    () => import("./MonthlyReservationChart"),
    {
        loading: () => <Skeleton className="w-full h-80"/>,
        ssr: false,
    }
);
export default async function page() {

    const role = await PeekUserRole()
    console.log(role)
    if(role?.res === 3) {
        redirect("/reservations")
    }

    return (
            <div className="flex w-full flex-row gap-4 p-4">
            <div className="flex w-3/5 flex-col gap-4">
                <CardShowcase />
                <MonthlySalesChart />
                <MonthlyReservationChart />
            </div>
            <div className="flex w-2/5 flex-col gap-4 h-screen relative">
                <CheckInTable />
                <CheckOutTable />
            </div>
        </div>
    );
}
