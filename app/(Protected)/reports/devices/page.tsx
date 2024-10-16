import DeviceController from "./DeviceController";
import DevicesTable from "./DevicesTable";
import dynamic from "next/dynamic";
import DeviceChart from "./DeviceChart";
export default function page() {
  return (
    <div>
      <DeviceController />
      <div className="flex w-full flex-col justify-center gap-4 p-4 ">
        <DeviceChart />
        <DevicesTable />
      </div>
    </div>
  );
}
