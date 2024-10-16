"use client";
import DetailedDataTable from "@/components/DetailedDataTable";
import { SimpleDataTable } from "@/components/SimpleDataTable";
import { Card, CardHeader } from "@/components/ui/card";
import { useTranslation } from "next-export-i18n";
import { useQuery } from "@tanstack/react-query";
import { getGuestDetails } from "@/app/ServerAction/manage.action";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuestDetails({ id }: { id: string }) {
  const { t } = useTranslation();
  const cardHeaderClass =
    "flex rounded-t-md bg-cstm-primary p-1 pl-4 text-xl font-semibold text-white";

  const { isLoading, data: guest } = useQuery({
    queryKey: ["GetGuestsDetails"],
    queryFn: async () => {
      const res = await getGuestDetails(id);
      if (!res.success) {
        throw new Error();
      }
      console.log(res)
      return res.res;
    },
  });

  const columns = [
    {
      accessorKey: "Id",
      header: "Reservation ID",
    },
    {
      accessorKey: "RoomType",
      header: "Room Type",
    },

    {
      accessorKey: "CheckInDate",
      header: "Check-in",
    },
    {
      accessorKey: "CheckOutDate",
      header: "Check-out",
    },
  ];

  return (
    <div className="flex gap-4 p-4">
      <div className="flex w-2/5 flex-col gap-4">
        <Card>
          <CardHeader className={cardHeaderClass}>Guest Details</CardHeader>
          {isLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <div className="p-4">
              <div className="flex w-full">
                <h1 className="w-1/2 font-semibold">Name</h1>
                <p className="w-1/2">{`${guest?.[0].FirstName} ${guest?.[0].LastName}`}</p>
              </div>
              <div className="flex w-full">
                <h1 className="w-1/2 font-semibold">Email</h1>
                <p className="w-1/2">{guest?.[0].Email}</p>
              </div>
              <div className="flex w-full">
                <h1 className="w-1/2 font-semibold">Contact Number</h1>
                <p className="w-1/2">{guest?.[0].Contact}</p>
              </div>
              <div className="flex w-full">
                <h1 className="w-1/2 font-semibold">Nationality</h1>
                <p className="w-1/2">{guest?.[0].Nationality}</p>
              </div>
              <div className="flex w-full">
                <h1 className="w-1/2 font-semibold">Birthdate</h1>
                <p className="w-1/2"> 
                  {format(new Date(guest?.[0].BirthDate), "MMMM, d yyyy")}
                </p>
              </div>
              <div className="flex w-full">
                <h1 className="w-1/2 font-semibold">Register Date</h1>
                <p className="w-1/2">
                  {format(new Date(guest?.[0].CreatedAt), "MMMM, d yyyy")}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
      <div className="w-3/5">
        <DetailedDataTable
          title="Guest Reservation History"
          columns={columns}
          columnToSearch={["Id", "CheckInDate", "CheckOutDate", "RoomType"]}
          isLoading={isLoading}
          data={guest?.[1] || []}
        />
      </div>
    </div>
  );
}
