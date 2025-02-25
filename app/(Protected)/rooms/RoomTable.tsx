"use client";
import DetailedDataTable from "@/components/DetailedDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGlobalStore } from "@/store/useGlobalStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, Ellipsis } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import AlertConfirmDelete from "@/components/AlertConfirmDelete";
import { useMutation } from "@tanstack/react-query";
import { deleteRoom } from "@/app/ServerAction/rooms.action";
import { toast } from "sonner";
import { useTranslation } from "next-export-i18n";
import { Room } from "@/types";
import { format } from "date-fns";

export default function RoomTable() {
  const {
    selectedRoomData,
    setSelectedRoomData,
    setRoomFormModalState,
    selectedRoomTypeOpt,
    selectedRoomStatusOpt,
    roomsQuery,
  } = useGlobalStore();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { data: roomsData, isLoading, refetch } = roomsQuery();
  const { t } = useTranslation();
  const roomsI18n = t("RoomsPage");
  const statusI18n = t("general.status");
  const generalI18n = t("general");

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log(id);
      const res = await deleteRoom(id);
      if (!res.success) {
        throw new Error(res.error);
      }
      return;
    },
    onSuccess: () => {
      toast.success(roomsI18n.toast.success, {
        description: roomsI18n.toast.deleteRoomSuccess,
      });
      refetch();
    },
    onError: (error) => {
      toast.error(roomsI18n.toast.failed, {
        description:
          roomsI18n.toast.somethingWentWrong,
      });
    },
  });

  const columns: ColumnDef<Room>[] = [
    {
      accessorKey: "Id",
      header: "ID",
      enableHiding: false,
    },
    {
      accessorKey: "RoomNumber",
      header: ({column}: any) => {
        return (
          <div className="flex">
            <Button 
              className="p-0 bg-transparent font-semibold flex gap-1"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {roomsI18n.roomNumber} {
                column.getIsSorted() === 'asc' ? 
                <ChevronUpIcon size={12} /> : 
                column.getIsSorted() === 'desc' ? <ChevronDownIcon size={12} /> : 
                <ChevronsUpDownIcon size={12} strokeWidth={2} />
              }
            </Button>
          </div>
        )
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "StatusId",
      enableHiding: false,
    },
    {
      accessorKey: "TypeName",
      header: ({column}: any) => {
        return (
          <div className="flex">
            <Button 
              className="p-0 bg-transparent font-semibold flex gap-1"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {roomsI18n.roomType} {
                column.getIsSorted() === 'asc' ? 
                <ChevronUpIcon size={12} /> : 
                column.getIsSorted() === 'desc' ? <ChevronDownIcon size={12} /> : 
                <ChevronsUpDownIcon size={12} strokeWidth={2} />
              }
            </Button>
          </div>
        )
      },
      filterFn: "equalsString",
    },
    {
      accessorKey: "TypeId",
      enableHiding: false,
    },
    {
      accessorKey: "StatusName",
      filterFn: "equalsString",
      header: ({column}: any) => {
        return (
          <div className="flex">
            <Button 
              className="p-0 bg-transparent font-semibold flex gap-1"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {roomsI18n.roomStatus} {
                column.getIsSorted() === 'asc' ? 
                <ChevronUpIcon size={12} /> : 
                column.getIsSorted() === 'desc' ? <ChevronDownIcon size={12} /> : 
                <ChevronsUpDownIcon size={12} strokeWidth={2} />
              }
            </Button>
          </div>
        )
      },
      cell: ({ cell }: any) => {
        let badgeColor;
        const status = cell.getValue();
        switch (status) {
          case "Available":
            badgeColor = "bg-green-500 hover:bg-green-600/70";
            break;
          case "Booked":
            badgeColor = "bg-orange-500 hover:bg-orange-600/70";
            break;
          case "Occupied":
            badgeColor = "bg-red-500 hover:bg-red-600/70";
            break;
        }

        return (
          <div className="flex h-min">
            <Badge className={`${badgeColor} hover:cursor-pointer`}>
              {statusI18n[cell.getValue()]}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "CreatedAt",
      enableHiding: false,
      header: ({column}: any) => {
        return (
          <div className="flex">
            <Button 
              className="p-0 bg-transparent font-semibold flex gap-1"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Created Since 
              {
                column.getIsSorted() === 'asc' ? 
                <ChevronUpIcon size={12} /> : 
                column.getIsSorted() === 'desc' ? <ChevronDownIcon size={12} /> : 
                <ChevronsUpDownIcon size={12} strokeWidth={2} />
              }
            </Button>
          </div>
        )
      },
      cell: ({row}) => {
        return format(new Date(row.getValue("CreatedAt")), "MMM dd, yyyy | hh:mm a")
      }
    },
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
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(record.Id)}
              >
                Copy ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setRoomFormModalState(true);
                  setSelectedRoomData(row.original);
                }}
              >
                {generalI18n.edit}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDeleteModal(true);
                  setSelectedRoomData(row.original);
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
  return (
    <div className="p-4">
      <AlertConfirmDelete
        openState={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        onConfirm={() => {
          deleteMutation.mutate(selectedRoomData.Id);
        }}
      />
      <DetailedDataTable
        className="bg-cstm-secondary"
        visibility={{ Id: false, StatusId: false, TypeId: false }}
        isLoading={isLoading}
        columns={columns}
        columnToSearch={["RoomNumber", "TypeName", "StatusName"]}
        searchPlaceholder={roomsI18n.searchRoomNumber}
        filterByCol={[
          { column: "TypeName", filterValue: selectedRoomTypeOpt },
          { column: "StatusName", filterValue: selectedRoomStatusOpt },
        ]}
        data={roomsData || []}
        pageSize={8}
        title={roomsI18n.rooms}
      />
    </div>
  );
}
