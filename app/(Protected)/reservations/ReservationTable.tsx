"use client";
import DetailedDataTable from "@/components/DetailedDataTable";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {} from "@/components/ui/dialog";
import { useGlobalStore } from "@/store/useGlobalStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteReservation } from "@/app/ServerAction/reservations.action";
import { useTranslation } from "next-export-i18n";
import AlertConfirmDelete from "@/components/AlertConfirmDelete";
import { useState } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";

export default function ReservationTable() {
  const { t } = useTranslation();
  const router = useRouter();
  const roomsI18n = t("RoomsPage");
  const generali18n = t("general");
  const reservationI18n = t("ReservationsPage");
  const guesti18n= t("GuestPage");
  const locale = t("locale");

  const {
    setSelectedReservationData,
    setReservationFormModalState,
    reservationQuery,
    reservationFilterRoomTypeOpt,
    reservationFilterStatusOpt,
    localeFns,
    billingFormModalState,
    setBillingFormModalState,
  } = useGlobalStore();
  const { data: reservations, isLoading, refetch } = reservationQuery();
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const mutation = useMutation({
    mutationKey: ["DeleteReservation"],
    mutationFn: async (id: number) => {
      const res = await deleteReservation(id);
      if (!res.success) throw new Error();
    },
    onSuccess: () => {
      console.log(generali18n);
      toast.success(generali18n.success, {
        description: reservationI18n.toast.deleteReservation,
      });
      setDeleteModalState(false);
      refetch();
    },
    onError: () => {
      toast.error(generali18n.failed, {
        description: generali18n.somethingWentWrong,
      });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "Id",
      header: reservationI18n.bookingReference,
      cell: ({ cell }: any) => {
        return <div className="text-center">{cell.getValue()}</div>;
      },
      filterFn: "includesString",
    },
    // {
    //   accessorKey: "CreatedAt",
    //   header: generali18n.createdAt,
    //   cell: ({ cell }: any) => {
    //     return format(new Date(cell.getValue()), "MMM dd, yyyy", {
    //       locale: localeFns[locale],
    //     });
    //   },
    // },
    // {
    //   accessorKey: "GuestData",
    //   header: reservationI18n.guestName,
    //   cell: ({ cell }: any) => {
    //     const cellData = cell.getValue();
    //     return cellData
    //       ? `${cellData.FirstName} 
    //             ${cellData.LastName} `
    //       : "N/A";
    //   },
    // },
    // {
    //   accessorKey: "GuestData",
    //   header: guesti18n.guestPhone,
    //   cell: ({cell}: any) => {
    //     const cellData = cell.getValue();
    //     return cellData ? `${cellData.Contact}` : "N/A"
    //   }
    // },
    // {
    //   accessorKey: "GuestData",
    //   header: guesti18n.guestEmail,
    //   cell: ({cell}: any) => {
    //     const cellData = cell.getValue();
    //     return cellData ? `${cellData.Email}` : "N/A"
    //   }
    // },
    {
      accessorFn: (row: any) => row.GuestData?.FirstName,
      id: "GuestFName",
      header: generali18n.firstname,
      cell: ({ cell }: any) => {
        return cell.getValue() ? `${cell.getValue()}` : "N/A"
      }
    },
    {
      accessorFn: (row: any) => row.GuestData?.LastName,
      id: "GuestLName",
      header: generali18n.lastname,
      cell: ({ cell }: any) => {
        return cell.getValue() ? `${cell.getValue()}` : "N/A"
      }
    },
    {
      accessorFn: (row: any) => row.GuestData?.Email,
      id: "GuestEmail",
      header: generali18n.email,
      cell: ({ cell }: any) => {
        return cell.getValue() ? `${cell.getValue()}` : "N/A"
      }
    },
    {
      accessorFn: (row: any) => row.GuestData?.Contact,
      id: "GuestPhone",
      header: generali18n.contactNumber,
      cell: ({ cell }: any) => {
        return cell.getValue() ? `${cell.getValue()}` : "N/A"
      }
    },
    {
      accessorKey: "CheckInDate",
      header: reservationI18n.checkInDate,
      cell: ({ cell }: any) => {
        return format(new Date(cell.getValue()), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "CheckOutDate",
      header: reservationI18n.checkOutDate,
      cell: ({ cell }: any) => {
        return format(new Date(cell.getValue()), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "CheckTime",
      header: () => {
        return (
          <div className="flex h-min flex-col justify-center gap-1">
            <p className="rounded-lg text-center text-xs font-semibold">
              {reservationI18n.checkInDate}
            </p>
            <p className="rounded-lg text-center text-xs font-semibold">
              {reservationI18n.checkOutDate}
            </p>
          </div>
        );
      },
      cell: ({ row }: any) => {
        return (
          <div className="flex h-min flex-col justify-center gap-1">
            <p className="rounded-lg bg-green-500 text-center text-xs font-semibold">
              {format(new Date(row.getValue("CheckInDate")), "MMM dd, yyyy", {
                locale: localeFns[locale],
              })}
            </p>
            <p className="rounded-lg bg-red-500 text-center text-xs font-semibold">
              {format(new Date(row.getValue("CheckOutDate")), "MMM dd, yyyy", {
                locale: localeFns[locale],
              })}
            </p>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "RoomCount",
    //   header: () => {
    //     return <div className="text-center">{reservationI18n.roomCount}</div>;
    //   },
    //   cell: ({ cell }: any) => {
    //     return <p className="text-center">{cell.getValue()}</p>;
    //   },
    // },
    {
      accessorKey: "ReservationStatus",
      header: () => (
        <div className="text-center">{reservationI18n.reservationStatus}</div>
      ),
      cell: ({ cell, row }: any) => {
        const status = cell.getValue() as string;

        return (
          <div className="flex h-min justify-center">
            <ReservationStatusBadge status={status} />
          </div>
        );
      },
    },
    {
      accessorKey: "ReservationType",
      header: reservationI18n.reservationType,
      cell: ({ cell }: any) => {
        return reservationI18n.type[cell.getValue()];
      },
    },
    {
      accessorKey: "RoomType",
      header: roomsI18n.roomType,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        const record = row.original;
        const isPending = row.getValue("ReservationStatus") === "Pending";
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
                  setSelectedReservationData(record);
                  router.push(`/reservations/details/${record.Id}`);
                }}
              >
                View Details
              </DropdownMenuItem>
              {isPending ? (
                <>
                  <DropdownMenuItem
                    disabled={!isPending}
                    onClick={() => {
                      console.log(record);
                      setSelectedReservationData(record);
                      setReservationFormModalState(true);
                    }}
                  >
                    {generali18n.edit}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!isPending}
                    onClick={() => {
                      setSelectedReservationData(record);
                      setBillingFormModalState(true);
                    }}
                  >
                    Bill Out
                  </DropdownMenuItem>
                </>
              ) : null }
              <DropdownMenuItem
                onClick={() => {
                  setDeleteModalState(true);
                  setDeleteId(record.Id);
                }}
                className="font-medium text-red-500"
              >
                {generali18n.delete}
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
        openState={deleteModalState}
        onOpenChange={setDeleteModalState}
        onConfirm={() => {
          mutation.mutate(deleteId);
        }}
      />
      <DetailedDataTable
        title={reservationI18n.reservations}
        columns={columns}
        isLoading={isLoading}
        data={reservations || []}
        pageSize={7}
        columnToSearch={["Id", "ReservationStatus", "ReservationType", "RoomType", "GuestEmail", "GuestPhone", "GuestFName", "GuestLName", "CheckInDate", "CheckOutDate"]}
        searchPlaceholder={reservationI18n.searchReservation}
        filterByCol={[
          {
            column: "ReservationStatus",
            filterValue: reservationFilterStatusOpt,
          },
          {
            column: "RoomType",
            filterValue: reservationFilterRoomTypeOpt,
          },
        ]}
        visibility={{
          firstName: false,
          lastName: false,
          CheckOutDate: false,
          CheckInDate: false,
        }}
      />
    </div>
  );
}
