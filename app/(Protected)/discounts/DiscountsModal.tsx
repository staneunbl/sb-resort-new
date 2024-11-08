"use client"
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addWeeks, format } from "date-fns";
import { cn } from "@/lib/utils";

import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectComponent from "@/components/SelectComponent";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "next-export-i18n";
import { toast } from "sonner";
import { isEmptyObj } from "@/utils/Helpers";
import { addPromos, updatePromos } from "@/app/ServerAction/promos.action";
import { DatePicker } from "@/components/ui/calendar2";
import { useEffect } from "react";
import { addDiscount } from "@/app/ServerAction/discounts.action";
export function DiscountsModal() {

    const { discountFormModalState, setDiscountFormModalState, selectedDiscountData, roomTypeOptionsQuery, getDiscountsQuery } = useGlobalStore();

    const isEditMode = isEmptyObj(selectedDiscountData) ? false : true;
    const { data: RoomTypeOption } = roomTypeOptionsQuery();
    const { refetch } = getDiscountsQuery();
    const formSchema = z.object({
        discountName: z.string().min(1, {message: "Please enter a discount name."}),
        discountCode: z.string().min(1, {message: "Please enter a discount code."}),
        discountType: z.string().min(1, {message: "Please select a discount type."}),
        discountValue: z.coerce.number().min(1, {message: "Please enter a discount value."}),
        discountStartDate: z.date().optional(),
        discountEndDate: z.date().optional(),
        minimumStay: z.number().optional(),
        maximumStay: z.number().optional(),
        minimumTotal: z.number().optional(),
        maximumTotal: z.number().optional(),
        maxUsage: z.number().optional(),
        roomTypes: z.array(z.number()).optional(),
        enabled: z.boolean().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            discountName: "",
            discountCode: "",
            discountType: "",
            discountValue: undefined,
            discountStartDate: undefined,
            discountEndDate: undefined,
            minimumStay: undefined,
            maximumStay: undefined,
            minimumTotal: undefined,
            maximumTotal: undefined,
            maxUsage: undefined,
            roomTypes: undefined,
            enabled: undefined
        },
        values: {
            discountName: selectedDiscountData ? selectedDiscountData.discountName : "",
            discountCode: selectedDiscountData ? selectedDiscountData.discountCode : "",
            discountType: selectedDiscountData ? selectedDiscountData.discountType : "",
            discountValue: selectedDiscountData ? selectedDiscountData.discountValue : undefined,
            discountStartDate: selectedDiscountData ? selectedDiscountData.discountStartDate : undefined,
            discountEndDate: selectedDiscountData ? selectedDiscountData.discountEndDate : undefined,
            minimumStay: selectedDiscountData ? selectedDiscountData.minimumStay : undefined,
            maximumStay: selectedDiscountData ? selectedDiscountData.maximumStay : undefined,            
            minimumTotal: selectedDiscountData ? selectedDiscountData.minimumTotal : undefined,
            maximumTotal: selectedDiscountData ? selectedDiscountData.maximumTotal : undefined,
            maxUsage: selectedDiscountData ? selectedDiscountData.maxUsage : undefined,
            roomTypes: selectedDiscountData ? selectedDiscountData.roomTypes : undefined,
            enabled: selectedDiscountData ? selectedDiscountData.enabled : undefined
        }
    })

    const addDiscountMutation = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const obj = {
                DiscountName: data.discountName,
                DiscountCode: data.discountCode,
                DiscountType: data.discountType === "flat" ? "flat" : "percentage",
                DiscountValue: data.discountValue,
                StartDate: data.discountStartDate || null,
                EndDate: data.discountEndDate || null,
                IsActive: data.enabled || false ,
                MinNight: data.minimumStay || 0,
                MaxNight: data.maximumStay || 0,
                MinAmount: data.minimumTotal || 0,
                MaxAmount: data.maximumTotal || 0,
                MaxUsage: data.maxUsage || 0
            }
            console.log(obj)
            const { res } = await addDiscount(obj, data.roomTypes || []);
            if (!res) {
                throw new Error("error");
            } 
            return res
        },
        onSuccess: () => {
            toast.success("Discount added successfully.");
            refetch();
            setDiscountFormModalState(false);
        },
        onError: () => {
            toast.error("Discount could not be added.");
        }
    })

    const editMutation = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const obj = {
                Id: selectedDiscountData?.Id,
                DiscountName: data.discountName,
                DiscountCode: data.discountCode,
                DiscountType: data.discountType,
                DiscountValue: data.discountValue,
                StartDate: data.discountStartDate || null,
                EndDate: data.discountEndDate || null,
                IsActive: data.enabled,
                MinNight: data.minimumStay || 0,
                MaxNight: data.maximumStay || 0,
                MinAmount: data.minimumTotal || 0,
                MaxAmount: data.maximumTotal || 0,
                MaxUsage: data.maxUsage || 0
            }
            return await updatePromos(obj);
        },
        onSuccess: () => {
            toast.success("Discount updated successfully.");
            refetch();
            setDiscountFormModalState(false);
        },
        onError: () => {
            toast.error("Discount could not be added.");
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
        addDiscountMutation.mutate(data);
    }

    useEffect(() => {
        console.log(form.getValues("roomTypes"))
    }, [form.watch("roomTypes")])
    
    return (
        <Dialog
            open={discountFormModalState}
            onOpenChange={(open) => {
                setDiscountFormModalState(open);
            }}
        >
            <DialogContent className="sm:max-w-[800px] max-h-[1200px]">
                <DialogHeader>
                    <DialogTitle>{"Add Discount"}</DialogTitle>
                    <DialogDescription>
                        {"Please fill up the form to add a new discount."}
                    </DialogDescription>
                </DialogHeader>
                
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex">
                                <div className="flex flex-col gap-4 w-2/3 pr-4">
                                    <div className="flex flex-col">
                                        <p className="text-lg font-semibold text-cstm-secondary mb-2">Discount Details</p>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="discountName"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Discount Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Sample Discount"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="discountCode"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Discount Code</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="ABC123"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="discountType"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Discount Type</FormLabel>
                                                            <FormControl>
                                                            <SelectComponent
                                                                className="w-full"
                                                                setState={field.onChange}
                                                                state={field.value}
                                                                options={[
                                                                    {
                                                                        label: "Percentage",
                                                                        value: "Percentage"
                                                                    },
                                                                    {
                                                                        label: "Flat",
                                                                        value: "Flat"
                                                                    }
                                                                ]}
                                                                placeholder={"Select Discount Type"}
                                                            />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="discountValue"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Discount Value</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="0"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <div className="flex flex-col mb-2">
                                            <p className="text-lg font-semibold text-cstm-secondary mb-0">Discount Criteria</p>
                                            <p className="text-sm text-black/[.70]">Optional criteria for discount eligibility.</p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="discountStartDate"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Start Date</FormLabel>
                                                            <FormControl>
                                                                <DatePicker date={field.value} setDate={field.onChange} />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">
                                                                Date when the discount becomes available.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="discountEndDate"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>End Date</FormLabel>
                                                            <FormControl>
                                                                <DatePicker date={field.value} setDate={field.onChange} />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">
                                                                Date when the discount expires.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="minimumStay"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Minimum Stay</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Minimum stay"
                                                                    type="number"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">
                                                                Minimum nights required for eligibility.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="maximumStay"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Maximum Stay</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Maximum stay"
                                                                    type="number"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">
                                                                Maximum nights allowed for eligibility.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="minimumTotal"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Minimum Total</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Minimum total"
                                                                    type="number"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-xs"> 
                                                                Minimum booking cost to qualify.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="maximumTotal"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Maximum Total</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Maximum total"
                                                                    type="number"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">
                                                                Maximum booking cost to qualify.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="maxUsage"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel>Maximum Usage</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Maximum usage"
                                                                    type="number"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">
                                                                Total times this discount can be redeemed.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="flex flex-col w-1/3 border-l pl-4 ">
                                    <p className="text-lg font-semibold text-cstm-secondary mb-2">Eligible Room Types</p>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <FormField
                                                control={form.control}
                                                name="roomTypes"
                                                render={({ field }) => {
                                                    const allSelected = RoomTypeOption.every((type: any) => field.value?.includes(type.value));
                                                    const handleSelectAll = () => {
                                                        const allLabels = RoomTypeOption.map((type: any) => type.value);
                                                        field.onChange(allSelected ? [] : allLabels); // Toggle all options
                                                    };
                                                    const handleCheckboxChange = (option: number) => {
                                                        const newValue = (field.value ?? []).includes(option)
                                                          ? field.value?.filter((item) => item !== option)
                                                          : [...(field.value ?? []), option];
                                                        field.onChange(newValue); // Update form field
                                                      };
                                                    return (
                                                        <FormItem className="w-full">
                                                            <FormLabel>List of Rooms</FormLabel>
                                                            <FormControl>
                                                                <div className="grid grid-cols-1 max-h-[700px] overflow-auto">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                        type="checkbox"
                                                                        checked={allSelected}
                                                                        onChange={handleSelectAll}
                                                                        />
                                                                        <span className="font-semibold text-sm">Select All</span>
                                                                    </label>
                                                                    <hr className="my-2"></hr>
                                                                    {
                                                                        RoomTypeOption?.map((type: any) => (
                                                                            <label key={type.value} className="flex items-center space-x-2 w-full">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={field.value?.includes(type.value)}
                                                                                    onChange={() => handleCheckboxChange(type.value)}
                                                                                />
                                                                                <span className="w-full">{type.label}</span>
                                                                            </label>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t flex gap-4 justify-end">
                                <Button variant="outline">
                                    Cancel
                                </Button>
                                <Button>
                                    Add Discount
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}