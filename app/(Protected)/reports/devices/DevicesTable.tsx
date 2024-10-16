"use client";
import DetailedDataTable from "@/components/DetailedDataTable";
import { useGlobalStore } from "@/store/useGlobalStore";

export default function DevicesTable() {
  const { deviceReservationQuery } = useGlobalStore();

  const { data, isLoading } = deviceReservationQuery();

  const columns = [
    {
      accessorKey: "Device",
      header: "Device Type",
    },
    {
      accessorKey: "DeviceCount",
      header: "Reservation",
    },
    {
      accessorKey: "Pending",
      header: "Pending",
    },
    {
      accessorKey: "Settled/Done",
      header: "Settled / Done",
    },
    {
      accessorKey: "Cancelled/No-Show",
      header: "Cancelled/No-Show",
    },
  ];

  return (
    <DetailedDataTable
      title="Device Report"
      columnToSearch={["Device", "DeviceCount", "Pending", "Settled/Done", "Cancelled/No-Show"]}
      columns={columns}
      isLoading={isLoading}
      data={data}
    />
  );
}
