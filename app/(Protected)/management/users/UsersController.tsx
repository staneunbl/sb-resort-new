"use client";
import { useRouter } from "next/navigation";
import { CalendarIcon, Filter, FilterX, Plus } from "lucide-react";
import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/useGlobalStore";
import SelectComponent from "@/components/SelectComponent";
export default function UsersController() {
  const {
    setUserFormModalState,
    userRoleFilterOpt,
    setUserRoleFilterOpt,
    resetSelectOptState,
  } = useGlobalStore();
  const router = useRouter();

  const roles = [
    {
      label: "FRONTDESK",
      value: "1",
    },
    {
      label: "SUPERVISOR",
      value: "2",
    },
    {
      label: "SUPERADMIN",
      value: "3",
    },
  ];
  return (
    <div className="flex w-full flex-row items-center justify-between gap-2 border-b border-cstm-border px-4 py-3">
      <div className="flex w-full items-center gap-4">
        <SelectComponent
          placeholder="Select Role"
          options={roles}
          state={userRoleFilterOpt}
          setState={setUserRoleFilterOpt}
          valueType="label"
        />
        <Button
          onClick={() => {
            resetSelectOptState();
          }}
          className="flex items-center gap-2 bg-cstm-primary text-cstm-tertiary"
        >
          <FilterX size={20} />
        </Button>
      </div>
      <Button
        onClick={() => {
          setUserFormModalState(true);
        }}
      >
        <Plus size={20} />
        Add New User
      </Button>
    </div>
  );
}
