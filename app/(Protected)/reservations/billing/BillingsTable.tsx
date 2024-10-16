"use client";
import { getBillings } from "@/app/ServerAction/reservations.action";
import DetailedDataTable from "@/components/DetailedDataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Cell } from "recharts";
import { useTranslation } from "next-export-i18n";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { ColumnDef } from "@tanstack/react-table";
import { commafy } from "@/utils/Helpers";
export default function BillingsTable() {
  const { t } = useTranslation();
  const { locale } = t("locale");
  const reservationI18n = t("ReservationsPage");
  const generali18n = t("general");
  const roomsI18n = t("RoomsPage");

  const {
    localeFns,
    setBillingAddOnFormModalState,
    setSelectedBillingData,
    billingsQuery,
    setFinilizeBillingModalState,
    selectedBillingStatusFilter,
    resetSelectOptState,
  } = useGlobalStore();

  const { data: billings, isLoading } = billingsQuery();

  const column = [
    {
      accessorKey: "Id",
      enableHiding: false,
    },
    {
      accessorKey: "ReservationId",
      header: reservationI18n.reservationId,
      filterFn: "includesString",
    },
    {
      accessorKey: "BillingStatus",
      header: reservationI18n.billingStatus,
    },
    {
      accessorKey: "InitialBill",
      header: reservationI18n.initialBill,
      cell: ({ cell }: any) => {
        return `₱ ${commafy(cell.getValue())}`;
      },
    },
    {
      accessorKey: "TotalPerAddOn",
      header: reservationI18n.totalAddOnPrice,
      cell: ({ cell }: any) => {
        return `₱ ${commafy(cell.getValue())}`;
      },
    },
    {
      accessorKey: "Deposit",
      header: reservationI18n.deposit,
      cell: ({ cell }: any) => {
        return `₱ ${commafy(cell.getValue())}`;
      },
    },
    {
      header: reservationI18n.guestName,
      cell: ({ row }: any) => {
        const firstName = row.getValue("FirstName");
        const lastName = row.getValue("LastName");
        const guest = firstName + " " + lastName;
        return firstName ? guest : "N/A";
      },
    },
    {
      accessorKey: "FirstName",
      enableHiding: false,
    },
    ,
    {
      accessorKey: "LastName",
      enableHiding: false,
    },
    ,
    {
      accessorKey: "CreatedAt",
      header: generali18n.createdAt,
      cell: ({ cell }: any) => {
        return format(new Date(cell.getValue()), "MMM dd, yyyy", {
          locale: localeFns[locale],
        });
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        const record = row.original;
        const isFinalized = record.BillingStatus === "Fully Paid";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{generali18n.actions}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBillingData(record);
                  setFinilizeBillingModalState(true);
                }}
                disabled={isFinalized}
              >
                {reservationI18n.finalizeBill}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isFinalized}
                onClick={() => {
                  setSelectedBillingData(record);
                  setBillingAddOnFormModalState(true);
                }}
              >
                {reservationI18n.addAddOn}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <>
      <div className="p-4">
        <DetailedDataTable
          title={reservationI18n.billings}
          isLoading={isLoading}
          columns={column as ColumnDef<any>[]}
          data={billings || []}
          visibility={{ Id: false, FirstName: false, LastName: false }}
          filterByCol={[
            {
              column: "BillingStatus",
              filterValue: selectedBillingStatusFilter,
            },
          ]}
          columnToSearch={["ReservationId", "FirstName", "LastName"]}
        />
      </div>
    </>
  );
}
