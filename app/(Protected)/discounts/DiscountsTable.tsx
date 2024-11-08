"use client"
import { Button } from "@/components/ui/button"
import { useGlobalStore } from "@/store/useGlobalStore"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, Ellipsis, PencilIcon, TrashIcon } from "lucide-react"
import { useTranslation } from "next-export-i18n"
import DetailedDataTable from "@/components/DetailedDataTable"
import { format } from "date-fns"

export function DiscountsTable() {

    const {
        getDiscountsQuery,
        setSelectedDiscountData,
        selectedDiscountData,
        discountFormModalState,
        setDiscountFormModalState,
    } = useGlobalStore()

    const { t } = useTranslation();
    const discountI18n = t("Discounts");
    const { data, isLoading } = getDiscountsQuery()

    const columns = [
        {
            accessorKey: "Id",
            header: ({column}: any) => {
                return (
                    <div className="flex">
                    <Button 
                        className="p-0 bg-transparent font-semibold flex gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        {discountI18n.discountId} {
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
            accessorKey: "DiscountName",
            header: ({column}: any) => {
                return (
                    <div className="flex">
                    <Button 
                        className="p-0 bg-transparent font-semibold flex gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        {discountI18n.discountName} {
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
            accessorKey: "DiscountCode",
            header: ({column}: any) => {
                return (
                    <div className="flex">
                    <Button 
                        className="p-0 bg-transparent font-semibold flex gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        {discountI18n.discountCode} {
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
            accessorKey: "DiscountType",
            id: "DiscountType",
            header: ({column}: any) => {
                return (
                    <div className="flex">
                    <Button 
                        className="p-0 bg-transparent font-semibold flex gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        {discountI18n.discountType} {
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
            accessorKey: "DiscountValue",
            header: ({column}: any) => {
                return (
                    <div className="flex">
                    <Button 
                        className="p-0 bg-transparent font-semibold flex gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        {discountI18n.discountValue} {
                        column.getIsSorted() === 'asc' ? 
                        <ChevronUpIcon size={12} /> : 
                        column.getIsSorted() === 'desc' ? <ChevronDownIcon size={12} /> : 
                        <ChevronsUpDownIcon size={12} strokeWidth={2} />
                        }
                    </Button>
                    </div>
                )
            },
            cell: ({ row, cell }: any) => {
                const type = row.original.DiscountType;
                const value = type === "flat" ? "₱" + cell.getValue().toString() : cell.getValue().toString() + "%";
                return value
            },
        },
        {
            accessorKey: "IsActive",
            header: ({column}: any) => {
                return (
                    <div className="flex">
                    <Button 
                        className="p-0 bg-transparent font-semibold flex gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        {discountI18n.isActive} {
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
            accessorKey: "StartDate",
            header: ({column}: any) => {
                return (
                    <div className="flex">
                    <Button 
                        className="p-0 bg-transparent font-semibold flex gap-1"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        {discountI18n.startDate} {
                        column.getIsSorted() === 'asc' ? 
                        <ChevronUpIcon size={12} /> : 
                        column.getIsSorted() === 'desc' ? <ChevronDownIcon size={12} /> : 
                        <ChevronsUpDownIcon size={12} strokeWidth={2} />
                        }
                    </Button>
                    </div>
                )
            },
            cell: ({ row, cell }: any) => {
                if(cell.getValue() === null) return "None"
                const date = new Date(cell.getValue());
                if(!date) return "None"
                return format(date, "MMM dd, yyyy");
            },
        },
        {
            accessorKey: "EndDate",
            header: ({column}: any) => {
                return (
                    <div className="flex">
                        <Button 
                            className="p-0 bg-transparent font-semibold flex gap-1"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            {discountI18n.endDate} {
                                column.getIsSorted() === 'asc' ? 
                                <ChevronUpIcon size={12} /> : 
                                column.getIsSorted() === 'desc' ? <ChevronDownIcon size={12} /> : 
                                <ChevronsUpDownIcon size={12} strokeWidth={2} />
                            }
                        </Button>
                    </div>
                )
            },
            cell: ({ row, cell }: any) => {
                if(cell.getValue() === null) return "None"
                const date = new Date(cell.getValue());
                if(date < new Date()) return <span className="text-red-500">{format(date, "MMM dd, yyyy")}</span>;
                return format(date, "MMM dd, yyyy");
            },
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

                      }}
                    >
                        <div className="flex justify-between w-full items-center">
                          <p>Edit</p>
                          <PencilIcon size={12} color="currentColor" />  
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        
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
    ]

    return (
        <div className="p-4">
            <DetailedDataTable
                isLoading={isLoading}
                title={"Discounts"}
                data={data as any[] || []}
                searchPlaceholder={"Search discounts..."}
                columns={columns}
                columnToSearch={["Id", "DiscountName", "DiscountCode", "DiscountType", "DiscountValue"]}
                pageSize={20}
                initialSort={[{ id: "Id", desc: true }]}
            />
        </div>)
}