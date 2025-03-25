"use client";
import { getAuditLog } from "@/app/ServerAction/reports.action";
import DetailedDataTable from "@/components/DetailedDataTable";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import React from "react";

export default function AuditLogTable() {
  const { userRoleFilterOpt } = useGlobalStore();

  const { data: auditLog, isLoading } = useQuery({
    queryKey: ["GetAuditLog"],
    queryFn: async () => (await getAuditLog()).res as any,
  });

  const filteredData = React.useMemo(() => {
    if (!auditLog) return [];

    return userRoleFilterOpt
      ? auditLog.filter(
        (log: any) =>
          `${log.FirstName} ${log.LastName}`.toLowerCase() ===
          userRoleFilterOpt.toLowerCase()
      )
      : auditLog;
  }, [auditLog, userRoleFilterOpt]);

  const columns = [
    {
      accessorKey: "Id",
      header: "ID",
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }: any) => {
        const firstName = row.original.FirstName?.trim() || "";
        const lastName = row.original.LastName?.trim() || "";
        return (
          <div>
            {firstName} {lastName}
          </div>
        );
      },
    },
    {
      accessorKey: "TableName",
      header: "Module",
    },
    {
      accessorKey: "ActionName",
      header: "Action",
    },
    {
      accessorKey: "ChangedAt",
      header: ({ column }: any) => {
        return (
          <div className="flex">
            <Button
              className="flex gap-1 bg-transparent p-0 font-semibold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {"Date Created"}{" "}
              {column.getIsSorted() === "asc" ? (
                <ChevronUpIcon size={12} />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDownIcon size={12} />
              ) : (
                <ChevronsUpDownIcon size={12} strokeWidth={2} />
              )}
            </Button>
          </div>
        );
      },
      cell: ({ cell }: any) => {
        const date = new Date(cell.getValue() || "00");
        return (
          <div className="text-center">
            {format(date, "MMM dd, yyyy, h:mm a")}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "FirstName",
    },
    {
      accessorKey: "LastName",
    },
  ];

  return (
    <div className="p-4">
      <DetailedDataTable
        title="Audit Log"
        columns={columns}
        columnToSearch={[
          "ActionName",
          "TableName",
          "ChangedAt",
          "FirstName",
          "LastName",
          "user",
        ]}
        isLoading={isLoading}
        data={filteredData}
        pagination={true}
        pageSize={12}
        visibility={{
          Id: false,
          FirstName: false,
          LastName: false,
        }}
      />
    </div>
  );
}
