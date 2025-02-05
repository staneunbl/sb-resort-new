import { ReactNode } from "react";
import { Loader } from "lucide-react";

type DashboardCardProps = {
    title: string,
    icon: ReactNode,
    count: string | undefined
}

export function DashboardCard({title, icon, count}: DashboardCardProps) {
    return (
        <div className="group/dashcard w-1/3 rounded-lg relative bg-cstm-secondary">
            {/* <div className="absolute top-0 left-0 w-full h-full bg-cstm-card z-3 rounded-lg translate-y-2 group-hover/dashcard:translate-y-0 transition"></div> */}
            <div className="h-full overflow-hidden relative flex flex-col px-4 py-5 justify-between rounded-lg">
                
                <div className="mb-5 flex items-center justify-center rounded-full bg-white/[.10] text-white text-xl w-[72px] h-[72px] transition group-hover/dashcard:text-cstm-primary">
                    {icon}
                </div>

                <div className="flex flex-col gap-2 transition">
                    <p className="text-lg text-white/[.70] group-hover/dashcard:text-white">{title}</p>
                </div>

                <div className="transition group-hover/dashcard:text-ctsm-primary ">
                    {count === undefined ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <p className="text-2xl text-white font-bold group-hover/dashcard:text-cstm-primary">
                            {count}
                        </p>
                    )}
                </div>

            </div>
        </div>
    )
}