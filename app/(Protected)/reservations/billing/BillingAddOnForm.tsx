"use client";
import React, { FormEvent, FormEventHandler, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAddOnsOpt,
  getBillingDetails,
  processBillingAddOns,
} from "@/app/ServerAction/reservations.action";
import { commafy, isEmptyObj } from "@/utils/Helpers";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check, LoaderCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useTranslation } from "next-export-i18n";

interface AddOn {
  value: number;
  label: string;
  Price: number;
}

export default function BillingAddOnForm() {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const reservationI18n = t("ReservationsPage");
  const generali18n = t("general");
  const roomsI18n = t("RoomsPage");
  const {
    billingAddOnFormModalState,
    setBillingAddOnFormModalState,
    selectedBillingData,
    billingsQuery,
  } = useGlobalStore();
  const { refetch: refetchBillings } = billingsQuery();

  const {
    data,
    isLoading,
    isFetched,
    refetch: refetchBillingDetails,
  } = useQuery({
    queryKey: ["getBillingDetails", selectedBillingData.Id],
    enabled: !isEmptyObj(selectedBillingData),
    queryFn: async () => {
      const res = await getBillingDetails(selectedBillingData.Id);
      if (!res.success) throw new Error();
      return res.res;
    },
  });

  const {
    data: AddOnDataOpt,
    isLoading: isAddOnOptLoading,
    refetch: refetchAddOnOpt,
  } = useQuery({
    queryKey: ["GetAddOnsOptions", selectedBillingData.Id],
    enabled: isFetched,
    queryFn: async () => {
      const selectedOpt = data?.map((item) => item.AddOnId);
      const res = await getAddOnsOpt(`(${selectedOpt})`);
      if (!res.success) throw new Error();
      return res.res;
    },
  });

  const { mutate: processBillingAddOnsMutate } = useMutation({
    mutationFn: async (values: any) => {
      const res = await processBillingAddOns(values, selectedBillingData.Id);
      if (!res.success) throw new Error();
      return res.res;
    },
    onSuccess: () => {
      toast.success(generali18n.success, {
        description: "Add on has been added successfully",
      });
      refetchBillings();
    },
    onError: () => {
      toast.success(generali18n.somethingWentWrong, {
        description: "There was an error, please try again",
      });
    },
    onSettled: () => {
      setBillingAddOnFormModalState(false);
      setAddedAddOn([]);
      refetchAddOnOpt();
      refetchBillingDetails();
    },
  });

  const [addedAddOn, setAddedAddOn] = useState<AddOn[]>([]);
  /* Old meaning the added add-ons before 
      New Meaning New Added add-ons 
  */

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const formEntries = Array.from(formData.entries()).map((item) => ({
      addOnId: parseInt(item[0] as string),
      addOnCount: parseInt(item[1] as string),
    }));
    processBillingAddOnsMutate(formEntries);
  }

  return (
    <Dialog
      open={billingAddOnFormModalState}
      onOpenChange={(val) => {
        setAddedAddOn([]);
        setBillingAddOnFormModalState(val);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{reservationI18n.addAddOn}</DialogTitle>
          <DialogDescription>{reservationI18n.addAddOnDesc}</DialogDescription>
        </DialogHeader>
        <Popover
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {reservationI18n.selectAddOn}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Add Add On" className="h-9" />
              <CommandList>
                {isAddOnOptLoading ? (
                  <CommandEmpty>Loading...</CommandEmpty>
                ) : (
                  <>
                    <CommandEmpty>No AddOn found.</CommandEmpty>
                    <CommandGroup>
                      {(AddOnDataOpt || []).map((item: any) => (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          data-value={item}
                          onSelect={(currentValue) => {
                            /* this is very complex and i dont have any idea how to explain it */
                            setAddedAddOn((prev) => {
                              if (prev.includes(item))
                                return prev.filter((item) => item !== item);
                              return [...prev, item];
                            });
                            setOpen(false);
                          }}
                        >
                          {item.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              addedAddOn.includes(item)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div>
          <div className="flex items-center border-y-2">
            <h1 className="w-3/6 text-center font-bold">
              {reservationI18n.addOns}
            </h1>
            <h1 className="w-2/6 border-x-2 text-center font-bold">
              {reservationI18n.unitPrice}
            </h1>
            <h1 className="w-1/6 text-center font-bold">{generali18n.quantity}</h1>
          </div>
          <ScrollArea className="over flex max-h-56 flex-col py-5">
            <form
              id="form"
              onSubmit={handleFormSubmit}
              className="flex flex-col"
            >
              {data?.length === 0 && addedAddOn.length === 0 && (
                <div className="flex justify-center">
                  <p className="text-cstm-border/50">
                    {reservationI18n.selectAddOn}
                  </p>
                </div>
              )}
              {!isFetched ? (
                <div className="flex items-center justify-center px-1">
                  <LoaderCircle className="animate-spin" />
                </div>
              ) : (
                data &&
                data.map((item: any) => (
                  <div className="flex items-center">
                    <label className="w-3/6 text-center">
                      {item.AddOnName}
                    </label>
                    <p className="w-2/6 border-x-2 text-center">{item.Price}</p>
                    <input
                      type="number"
                      name={item.AddOnId}
                      defaultValue={item.AddOnCount}
                      minLength={1}
                      className="input-decoration-none w-1/6 border-b text-center outline-none"
                    />
                  </div>
                ))
              )}
              {addedAddOn.map((item) => (
                <div className="flex items-center">
                  <label className="w-3/6 text-center">{item.label}</label>
                  <p className="w-2/6 border-x-2 text-center">{item.Price}</p>
                  <input
                    type="number"
                    name={item.value.toString()}
                    defaultValue="1"
                    minLength={1}
                    className="input-decoration-none w-1/6 border-b text-center outline-none"
                  />
                </div>
              ))}
            </form>
          </ScrollArea>
          <div className="border-y-2">
            <div className="flex items-center">
              <h1 className="w-5/6 font-bold">
                {reservationI18n.totalAddOnPrice}
              </h1>
              <h1 className="w-1/6 border-l-2 text-center font-bold">
                {commafy(10000)}
              </h1>
            </div>
            <div className="flex items-center">
              <h1 className="w-5/6 font-bold">{reservationI18n.initialBill}</h1>
              <h1 className="w-1/6 border-l-2 text-center font-bold">
                {commafy(10000)}
              </h1>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button form="form" type="submit">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
