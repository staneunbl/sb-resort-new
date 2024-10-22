"use client";
import DetailedDataTable from "@/components/DetailedDataTable";
import { format } from "date-fns";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import AlertConfirmDelete from "@/components/AlertConfirmDelete";
import { useTranslation } from "next-export-i18n";
import { deleteRoomRate } from "@/app/ServerAction/rooms.action";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { RoomRate } from "@/types";

export default function RoomRatesTable() {
  const { t } = useTranslation();
  const generalI18n = t("general");
  const roomsI18n = t("RoomsPage");
  const locale = t("locale");

  const {
    setRateFormModalState,
    setSelectedRateData,
    localeFns,
    roomRatesQuery,
    selectedRoomRateRoomTypeFilter,
  } = useGlobalStore();

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const { data: roomRates, isLoading, refetch } = roomRatesQuery();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log(id);
      const res = await deleteRoomRate(id);
      if(!res.success) {
        console.log(res.error);
        throw new Error(res.error);
      } 
      return;
    },
    onSuccess: () => {
      toast.success(roomsI18n.toast.success, {
        description: roomsI18n.toast.deleteRateSuccess,
      });
      refetch();
    },
    onError: () => {
      toast.error(roomsI18n.toast.error, {
        description: roomsI18n.toast.failed,
      });
    },
  })

  const column: ColumnDef<RoomRate>[] = [
    {
      accessorKey: "Id",
    },
    {
      accessorKey: "RoomType",
      header: roomsI18n.roomType,
    },
    {
      accessorKey: "RateType",
      header: roomsI18n.rateType,
    },
    {
      accessorKey: "ValidFrom",
      header: roomsI18n.validFrom,
      cell: ({ cell }: any) => {
        const date = cell.getValue();
        return (
          <div>
            {date
              ? format(date, "MMM dd, yyyy", { locale: localeFns[locale] })
              : generalI18n.indefinite}
          </div>
        );
      },
    },
    {
      accessorKey: "ValidTo",
      header: roomsI18n.validTo,
      cell: ({ cell }: any) => {
        const date = cell.getValue();
        return (
          <div>
            {date
              ? format(date, "MMM dd, yyyy", { locale: localeFns[locale] })
              : generalI18n.indefinite}
          </div>
        );
      },
    },
    {
      accessorKey: "ExtraChildRate",
      header: () => (
        <div className="text-center">{roomsI18n.extraChildRate}</div>
      ),
      cell: ({ cell }: any) => (
        <div className="text-center">P {cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "WeekendExtraChildRate",
      header: () => (
        <div className="text-center">{roomsI18n.weekendextraChildRate}</div>
      ),
      cell: ({ cell }: any) => (
        <div className="text-center">P {cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "BaseRoomRate",
      header: () => <div className="text-center">{roomsI18n.weekdayRate}</div>,
      cell: ({ cell }: any) => (
        <div className="text-center">P {cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "WeekendRoomRate",
      header: () => <div className="text-center">{roomsI18n.weekendRate}</div>,
      cell: ({ cell }: any) => (
        <div className="text-center">P {cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "ExtraAdultRate",
      header: () => (
        <div className="text-center">{roomsI18n.extraAdultRate}</div>
      ),
      cell: ({ cell }: any) => (
        <div className="text-center">P {cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "WeekendExtraAdultRate",
      header: () => (
        <div className="text-center">{roomsI18n.weekendextraAdultRate}</div>
      ),
      cell: ({ cell }: any) => (
        <div className="text-center">P {cell.getValue()}</div>
      ),
    },
    /* Actionss */
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{generalI18n.actions}</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRateData(record);
                  setRateFormModalState(true);
                }}
              >
                {generalI18n.edit}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                  setSelectedId(row.getValue("Id").toString());
                  
                }}
                className="font-medium text-red-500"
              >
                {generalI18n.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  console.log(selectedRoomRateRoomTypeFilter);
  return (
    <div className="p-4">
      <AlertConfirmDelete
        openState={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          deleteMutation.mutate(selectedId)
        }}
      />
      <DetailedDataTable
        isLoading={isLoading}
        title={roomsI18n.roomRate}
        data={roomRates || []}
        searchPlaceholder={roomsI18n.searchRateType}
        columns={column}
        columnToSearch={["RoomType"]}
        filterByCol={[
          {
            column: "RoomType",
            filterValue: selectedRoomRateRoomTypeFilter,
          },
        ]}
        visibility={{
          Id: false,
        }}
        pageSize={8}
      />
    </div>
  );
}
