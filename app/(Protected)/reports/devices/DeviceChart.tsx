"use client";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Loader2 } from "lucide-react";
export default function DeviceChart() {
  const { deviceReservationQuery } = useGlobalStore();

  const { data, isLoading } = deviceReservationQuery();
  return (
    <div className="flex flex-row gap-8">
      <div className="flex w-1/3 flex-col items-center gap-3 rounded-sm border border-cstm-primary bg-cstm-secondary py-5">
        <div className="text-white w-10 h-10 flex rounded-full bg-cstm-primary px-3 py-2 items-center justify-center">
          {isLoading ?<Loader2 size={40}  className="animate-spin" />: data[0].DeviceCount}
        </div>
        <p className="text-center font-semibold text-white">Windows</p>
      </div>

      <div className="flex w-1/3 flex-col items-center gap-3 rounded-sm border border-cstm-primary bg-cstm-secondary py-5">
        <div className="text-white w-10 h-10 flex rounded-full bg-cstm-primary px-3 py-2 items-center justify-center">
          {isLoading ? (
            <Loader2 size={40} className="animate-spin" />
          ) : (
            data[2].DeviceCount
          )}
        </div>
        <p className="text-center font-semibold text-white">Android</p>
      </div>

      <div className="flex w-1/3 flex-col items-center gap-3 rounded-sm border border-cstm-primary bg-cstm-secondary py-5">
        <div className="text-white w-10 h-10 flex rounded-full bg-cstm-primary px-3 py-2 items-center justify-center">
          {isLoading ? (
            <Loader2 size={40} className="animate-spin" />
          ) : (
            data[3].DeviceCount
          )}
        </div>
        <p className="text-center font-semibold text-white">IOS</p>
      </div>

      <div className="flex w-1/3 flex-col items-center gap-3 rounded-sm border border-cstm-primary bg-cstm-secondary py-5">
        <div className="text-white w-10 h-10 flex rounded-full bg-cstm-primary px-3 py-2 items-center justify-center">
          {isLoading ? (
            <Loader2 size={40} className="animate-spin" />
          ) : (
            data[4].DeviceCount
          )}
        </div>
        <p className="text-center font-semibold text-white">MacOS</p>
      </div>

      <div className="flex w-1/3 flex-col items-center gap-3 rounded-sm border border-cstm-primary bg-cstm-secondary py-5">
        <div className="text-white w-10 h-10 flex rounded-full bg-cstm-primary px-3 py-2 items-center justify-center">
          {isLoading ? (
            <Loader2 size={40} className="animate-spin" />
          ) : (
            data[5].DeviceCount
          )}
        </div>
        <p className="text-center font-semibold text-white">Unknown</p>
      </div>
    </div>
  );
}
