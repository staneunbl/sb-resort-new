import { deleteAmenity, getAmenities } from "@/app/ServerAction/rooms.action";
import AlertConfirmDelete from "@/components/AlertConfirmDelete";
import DetailedDataTable from "@/components/DetailedDataTable";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { set } from "date-fns";
import { Ellipsis, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AmenitiesTable() {

    const {
        selectedAmenity,
        setSelectedAmenity,
        amenityFormModalState,
        setAmenityFormModalState,
    } = useGlobalStore()
    
    const {data: amenities, error, isLoading} = useQuery({
        queryKey: ["amenities"],
        queryFn: async () => {
            const res = await getAmenities();
            if (!res.success) throw new Error();
            return res.res;
        },
    })

    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(-1);

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await deleteAmenity(id);
            if (!res.success) return error;
            return res.res;
        },

        onSuccess: () => {
            toast.error("Deleted successfully", {
                description:`Amenity ID ${selectedId} deleted successfully.`,
            });
            setOpen(false);
            setSelectedId(-1);
        },
        onError: () => {
            console.log(error)
            setOpen(false);
            setSelectedId(-1);
        },
    });


    const column = [
        {
            accessorKey: "Id",
            header: "Amenity Id",
        },
        {
            accessorKey: "Label",
            header: "Label",
        },
        {
            accessorKey: "Description",
            header: "Description",
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
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedAmenity(record);
                        setAmenityFormModalState(true);
                      }}
                    >
                        <div className="flex justify-between w-full items-center">
                          <p>Edit</p>
                          <PencilIcon size={12} color="currentColor" />  
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setOpen(true);
                        setSelectedId(row.getValue("Id").toString());
                        setSelectedAmenity(record);
                        
                      }}
                      className="font-medium text-red-500"
                    >
                      <div className="flex justify-between w-full items-center">
                          <p>Delete</p>
                          <TrashIcon size={12} color="currentColor" />  
                        </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          }

    ];
    
    return (
        <div>
            <AlertConfirmDelete
                
                openState={open}
                onOpenChange={setOpen}
                onConfirm={() => {
                    console.log("trigger")
                    deleteMutation.mutate(selectedId)
                }}
            />
            <DetailedDataTable
                isLoading={isLoading}
                title={"Amenities"}
                data={amenities as any[] || []}
                searchPlaceholder={"Search amenities..."}
                columns={column}
                columnToSearch={["Id", "Label", "Description"]}
                pageSize={20}
            />
        </div>
    );
}