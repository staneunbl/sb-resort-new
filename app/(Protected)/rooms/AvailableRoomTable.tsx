"use client";

import DetailedDataTable from "@/components/DetailedDataTable";
import { addDays, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getAvailableRooms, getAvailableRoomsRPC, getAvailableRoomTypeRPC } from "@/app/ServerAction/rooms.action";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "next-export-i18n";
import { enUS, ja } from "date-fns/locale";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";

interface AvailableRoom {
  TypeName: string;
  [key: number]: number;
}

export default function AvailableRoomTable() {
  const { t } = useTranslation();
  const locale: string = t("locale");
  const roomsI18n = t("RoomsPage");
  const localeFns: { [key: string]: any } = {
    en: enUS,
    ja: ja,
  };
  const {
    availableRoomsDateSelect,
    setAvailableRoomsDateSelect,
    availableRoomsQuery,
  } = useGlobalStore()

  const { data: roomsData, isFetching } = useQuery({
    queryKey: ["GetAvailableRooms"],
    queryFn: async () => (await getAvailableRooms()).res as AvailableRoom[],
  });

  const {data: availRoomType, isFetching: isFetchingAvailRoom, refetch: refetchAvailRoom} = useQuery({
    queryKey: ["GetAvailableRoomType"],
    queryFn: async () => (await getAvailableRoomTypeRPC((availableRoomsDateSelect?.to ? availableRoomsDateSelect?.to : new Date("2024-07-03")), availableRoomsDateSelect?.from ? availableRoomsDateSelect?.from : new Date("2024-09-06"))).res as any
  })
  const {data: availRoomsRPC, isFetching: isFetchingRPC, refetch: refetchAvailRPC} = useQuery({
    queryKey: ["GetAvailableRoomsRPC"],
    queryFn: async () => (await getAvailableRoomsRPC((availableRoomsDateSelect?.to ? availableRoomsDateSelect?.to : new Date("2024-07-03")), availableRoomsDateSelect?.from ? availableRoomsDateSelect?.from : new Date("2024-09-06"))).res as any,
  })

  useEffect(() => {
    console.log(availableRoomsDateSelect)
    refetchAvailRPC()
    refetchAvailRoom()
  }, [availableRoomsDateSelect])

  const columns: ColumnDef<AvailableRoom>[] = [
    {
      accessorKey: "roomtype",
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
      size: 100
    },
    // ...Array.from({ length: 10 }, (_, index) => {
    //   const date = addDays(new Date(), index);
    //   const formattedDate = format(date, "MMMM dd", {
    //     locale: localeFns[locale],
    //   });
    //   return {
    //     accessorKey: `${index + 1}`,
    //     header: formattedDate,
    //   };
    // }),
    {
      accessorKey: "availablerooms",
      header: "Available Rooms",
      size: 100,
      maxSize: 100
    },
    {
      header: "Room Numbers",

      cell: ({cell}) => {
        const roomType = cell.row.getValue("roomtype")
        
        if(!availRoomsRPC || isFetchingRPC) {
          return <p>Loading...</p>
        }
        
        let rooms = availRoomsRPC.filter((item: any) => item.room_type === roomType)
        return (
          <div className='flex flex-wrap gap-2'>
            {
              rooms.map((item: any, index: number) => {
                return (
                  <div className="border-2 p-2 rounded hover:bg-cstm-primary transition" key={index}>
                    {item.room_number}
                  </div>
                )
              })


            }
          </div>
        )
      }
    }
  ];

  return (
    <div className="p-4">
      {/* <p>{availableRoomsDateSelect?.from?.toLocaleDateString()} - {availableRoomsDateSelect?.to?.toLocaleDateString()}</p>
      <Button 
        variant="ghost"
        onClick={() => {
          console.log(
            availRoomsRPC.filter((item: any) => item.room_type === "Single")
          )
        }}>
          Test
      </Button> */}
      <DetailedDataTable
        title={`${roomsI18n.availableRooms} (${format(availableRoomsDateSelect.from!, "MMM dd, yyyy")} to ${format(availableRoomsDateSelect.to!, "MMM dd, yyyy")})`}
        searchPlaceholder={roomsI18n.searchRoomType}
        isLoading={isFetchingAvailRoom}
        columns={columns}
        columnToSearch={["roomtype"]}
        data={availRoomType || []}
      />
    </div>
  );
}
