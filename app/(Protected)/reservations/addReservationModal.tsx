"use client"
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SelectComponent from "@/components/SelectComponent";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
Form,
FormControl,
FormDescription,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import {
Popover,
PopoverTrigger,
PopoverContent,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
addReservationsLobby,
editReservations,
} from "@/app/ServerAction/reservations.action";
import { toast } from "sonner";
import { useCallback, useEffect } from "react";
import { isEmptyObj } from "@/utils/Helpers";
import { useTranslation } from "next-export-i18n";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrencyJP } from "@/utils/Helpers";

export default function AddReservationModal() {

    const { addReservationModalState, setAddReservationModalState } = useGlobalStore();

    const formSchema = z.object({
        dateRange: z.object({
                from: z.date(),
                to: z.date()
            },
            {
                message: "Please select a date range"
            }).
            default({from: new Date(), to: addDays(new Date(), 1)}).
            refine((data) => data.from < data.to, {
                path: ["dateRange"],
                message: "From date must be before to date",
            }),
        roomType: z.number().min(1, {message: "Please select a room type."}),
        adultGuests: z.number().min(1),
        childGuests: z.number().min(0),
        extraAdult: z.number().min(0),
        extraChild: z.number().min(0),
        request: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().min(1),
        phoneNumber: z.string().min(9).max(11),
        country: z.string(),
    
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dateRange: {from: new Date(), to: addDays(new Date(), 1)},
            roomType: undefined,
            adultGuests: 1,
            childGuests: 0,
            extraAdult: 0,
            extraChild: 0,
            request: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            country: "",
        }
    })

    return (
        <Dialog
        open={addReservationModalState}
        onOpenChange={(open) => {
          setAddReservationModalState(open);
        }}
      >
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>Add Reservation</DialogTitle>
            <DialogDescription>
                Create a reservation for a walk-in customer.
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <Form {...form}>
                <form className="flex gap-12">
                    <div className="flex flex-col w-1/2 gap-4">
                        <FormField
                            name="dateRange"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Check In/Out Dates</FormLabel>
                                    <FormControl className=" ">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                    "w-full pl-3 text-left font-normal  ",
                                                    !field.value && "text-muted-foreground",
                                                    )}
                                                >
                                                    {field.value?.from ? (
                                                    field.value?.to ? (
                                                        <>
                                                        {format(field.value?.from, "LLL dd, y")} -{" "}
                                                        {format(field.value?.to, "LLL dd, y")}
                                                        </>
                                                    ) : (
                                                        format(field.value?.from, "LLL dd, y")
                                                    )
                                                    ) : (
                                                    <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={field.value?.from}
                                                selected={field.value}
                                                onSelect={useCallback(field.onChange , [])}
                                                numberOfMonths={1}
                                                disabled={(date) => {
                                                    return date <= new Date();
                                                }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        Select a date range to get a list of available room types.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">Room Details</p>
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <FormField
                                        name="roomType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Room Type</FormLabel>
                                                <FormControl className=" ">
                                                    <SelectComponent
                                                        className="w-full"
                                                        setState={field.onChange}
                                                        state={field.value}
                                                        options={[]}
                                                        placeholder={"Select room type..."}
                                                    />
                                                </FormControl>
                                                <FormDescription>

                                                </FormDescription>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <FormField
                                        name="adultGuests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Adult Guests</FormLabel>
                                                <FormControl className=" ">
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    />    
                                </div>
                                <div className="w-1/2">
                                    <FormField
                                        name="childGuests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Child Guests</FormLabel>
                                                <FormControl className=" ">
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    />    
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">Guest Details</p>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <FormField
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl className=" ">
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    />    
                                </div>
                                <div className="w-1/2">
                                    <FormField
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl className=" ">
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    />    
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="">
                                    <FormField
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl className=" ">
                                                    <SelectComponent
                                                        className="w-full"
                                                        setState={field.onChange}
                                                        state={field.value}
                                                        options={[]}
                                                        placeholder={"Select country..."}
                                                    />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    />    
                                </div>
                                <div className="">
                                    <FormField
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl className=" ">
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    />    
                                </div>
                                <div className="">
                                    <FormField
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl className=" ">
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    />    
                                </div>
                                <div className="">
                                    <FormField
                                        name="request"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Special Requests</FormLabel>
                                                <FormControl className=" ">
                                                    <Textarea className="border" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    />    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <p className="text-lg font-bold">Booking Summary</p>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 text-sm">
                                <div>
                                    <p className="font-bold">Room</p>
                                    <div className="flex flex-col gap-2 ms-4">
                                        <div className="flex justify-between">
                                            <p className="text-black/[.70] ">{1} Weekday(s)</p>
                                            <p className="text-black font-bold">¥{formatCurrencyJP(1000)}</p>
                                        </div>  
                                        <div className="flex justify-between">
                                            <p className="text-black/[.70] ">{1} Weekend(s)</p>
                                            <p className="text-black font-bold">¥{formatCurrencyJP(1000)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className="font-bold">Extra Guests</p>
                                        <div className="flex flex-col gap-2 ms-4">
                                            <div className="flex justify-between">
                                                <p className="text-black/[.70] ">Adults x{1}</p>
                                                <p className="text-black font-bold">¥{formatCurrencyJP(1000)}</p>
                                            </div> 
                                            <div className="flex justify-between">
                                                <p className="text-black/[.70] ">Child x{1}</p>
                                                <p className="text-black font-bold">¥{formatCurrencyJP(1000)}</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            <hr></hr>
                            <div className="flex justify-between">
                                <p className="text-black/[.70] ">Subtotal</p>
                                <p className="text-black font-bold">¥{formatCurrencyJP(1000)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-black/[.70] ">VAT <span className="text-black/[.50] text-sm ">(12%)</span></p>
                                <p className="text-black font-bold">¥{formatCurrencyJP(1000)}</p>
                            </div>
                            <div className="border-t-2 p-t-2">
                            {/* <span>Total Bill</span>
                            <span className="font-bold">
                                {`₱ ${commafy(
                                selectedBillingData?.TotalPerAddOn +
                                    selectedBillingData?.InitialBill -
                                    selectedBillingData?.Deposit,
                                )}`}
                            </span> */}
                            <div className="flex justify-between bg-cstm-secondary p-4 rounded-md mt-2 items-start">
                                <p className="text-white/[.70] ">TOTAL</p>
                                <p className="text-white text-3xl font-bold">
                                    ¥{formatCurrencyJP(1000)}
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    )

}
