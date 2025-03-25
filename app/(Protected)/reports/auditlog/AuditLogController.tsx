"use client";
import { useRouter } from "next/navigation";
import { FilterX } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/useGlobalStore";
import SelectComponent from "@/components/SelectComponent";
import { getAuditLog } from "@/app/ServerAction/reports.action";

export default function AuditLogController() {
  const router = useRouter();

  // Get state management functions
  const { userRoleFilterOpt, setUserRoleFilterOpt, resetSelectOptState } = useGlobalStore();
  const [filteredUsers, setFilteredUsers] = React.useState<{ label: string; value: string }[]>([]);
  const [auditLog, setAuditLog] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchAuditLog() {
      const response = await getAuditLog();
      setAuditLog(
        Array.isArray(response.res)
          ? response.res.filter((log) => log && log.FirstName && log.LastName)
          : []
      );
    }
    fetchAuditLog();
  }, []);

  React.useEffect(() => {
    if (auditLog.length) {
      const uniqueUsers = auditLog
        .filter((log: any) => log.FirstName && log.LastName)
        .map((log: any) => {
          const originalLabel = `${log.FirstName} ${log.LastName}`;
          const formattedLabel = originalLabel.toUpperCase();

          return {
            label: formattedLabel,
            value: originalLabel,
          };
        })
        .filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i); // Remove duplicates

      setFilteredUsers(uniqueUsers);
    }
  }, [auditLog]);

  return (
    <div className="flex w-full flex-row items-center justify-between gap-2 border-b border-cstm-border px-4 py-3">
      <div className="flex w-full items-center gap-4">
        <SelectComponent
          placeholder="Select User"
          options={filteredUsers}
          state={userRoleFilterOpt}
          setState={(selected: string) => {
            setUserRoleFilterOpt(selected);
          }}
          valueType="label"
        />
        <Button
          onClick={() => {
            console.log("Resetting role selection...");
            resetSelectOptState();
          }}
          className="flex items-center gap-2 bg-cstm-primary text-cstm-tertiary"
        >
          <FilterX size={20} />
        </Button>
      </div>
    </div>
  );
}
