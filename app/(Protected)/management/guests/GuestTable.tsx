"use client";
import DetailedDataTable from "@/components/DetailedDataTable";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, Ellipsis, Pencil, Trash } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteGuest, getGuests } from "@/app/ServerAction/manage.action";
import { useTranslation } from "next-export-i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AlertConfirmDelete from "@/components/AlertConfirmDelete";
import { set } from "date-fns";
import { useGlobalStore } from "@/store/useGlobalStore";
import GuestModal from "./GuestModal";
export default function GuestTable() {
  const router = useRouter();
  const { t } = useTranslation();
  const generalI18n = t("general");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);

  const { setSelectedGuestData, setGuestEditModalState, selectedGuestData } = useGlobalStore()

  const { data: realData, isLoading, refetch } = useQuery({
    queryKey: ["GetGuests"],
    queryFn: async () => {
      const res = await getGuests();
      if (!res.success) {
        throw new Error();
      }
      return res.res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteGuest(id);
      if (!res.success) {
        throw new Error(res.toString());
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Guest deleted.", {
        description: "Guest deleted successfully",
      });
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete guest.", {
        description: "There was an error deleting the guest. Please try again later."
      })
    }
  })

  const column = [
    {
      accessorKey: "Id",
      header: ({column}: any) => {
        return (
          <div className="flex">
            <Button 
              className="p-0 bg-transparent font-semibold flex gap-1"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {"Id"} {
                column.getIsSorted() === 'asc' ? 
                <ChevronUpIcon size={12} /> : 
                column.getIsSorted() === 'desc' ? <ChevronDownIcon size={12} /> : 
                <ChevronsUpDownIcon size={12} strokeWidth={2} />
              }
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "FirstName",
      header: "First Name",
    },
    {
      accessorKey: "LastName",
      header: "Last Name"
    },
    // {
    //   accessorKey: "name",
    //   header: "Name",
    //   cell: ({ cell, row }: any) => {
    //     return (
    //       <div className="text-center">
    //         {row.getValue("FirstName") + " " + row.getValue("LastName")}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "Email",
      header: "Email",
    },
    {
      accessorKey: "Contact",
      header: "Phone",
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/management/guests/details/${record.Id}`);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedGuestData(row.original);
                console.log(selectedGuestData)
                setGuestEditModalState(true);
              }}>
                {generalI18n.edit}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedId(row.original.Id);
                  setOpen(true);
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
      <GuestModal></GuestModal>
      {/* <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to do this?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone, do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <AlertConfirmDelete
        openState={open}
        onOpenChange={setOpen}
        onConfirm={() => deleteMutation.mutate(selectedId)}
      />
      <DetailedDataTable
        title="Guests list"
        columnToSearch={["Email", "FirstName", "LastName", "Contact"]}
        columns={column}
        data={realData || []}
        visibility={{
          firstName: false,
          lastName: false,
          id: false,
        }}
        initialSort={[{id: "Id", desc: true}]}
      />
    </div>
  );
}
