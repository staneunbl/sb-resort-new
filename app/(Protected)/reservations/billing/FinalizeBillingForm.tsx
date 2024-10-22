"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useMutation } from "@tanstack/react-query";

import { commafy, formatCurrencyJP } from "@/utils/Helpers";
import { finalizeBill } from "@/app/ServerAction/reservations.action";
import { toast } from "sonner";

export default function FinalizeBillingForm() {
  const {
    finilizeBillingModalState,
    setFinilizeBillingModalState,
    selectedBillingData,
  } = useGlobalStore();

  const { mutate } = useMutation({
    mutationKey: ["FinalizeBill"],
    mutationFn: async (value: number) => {
      const res = await finalizeBill(value);
      if (!res.success) throw new Error();
      return res;
    },
    onSuccess: () => {
      setFinilizeBillingModalState(false);
      toast.success("Success", {
        description: "Billing Finalized Successfully",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "There was an error, please try again",
      });
    },
  });

  return (
    <Dialog
      open={finilizeBillingModalState}
      onOpenChange={setFinilizeBillingModalState}
    >
      <DialogContent className="w-full max-w-6xl">
        <DialogHeader>
          <DialogTitle>Finalize Bill</DialogTitle>
          <DialogDescription>
            Finalize the billing? This will process the billing and update the
            reservation status to "Checked Out".
          </DialogDescription>
        </DialogHeader>
        <p className="text-3xl font-bold text-cstm-secondary">Summary for Reservation #(id number)</p>
        <hr></hr>
        <div className="flex gap-4">
          <div className="w-3/5">
            <p className="text-sm font-bold text-black/[.50]">RESERVATION DETAILS</p>
            <div>
              <p className="text-2xl font-semibold text-black/[.80]">FirstName LastName</p>
              <p className="text-black/[.65]">Reservation ID #55</p>
              <div className="flex mt-4">
                <div className="w-1/2">
                  <p className="text-black/[.70] font-bold">Room Type</p>
                  <p className="text-black/[.65]">Deluxe</p>
                </div>
                <div className="w-1/2">
                  <p className="text-black/[.70] font-bold">Room Number</p>
                  <p className="text-black/[.65]">Room 1234</p>
                </div>
              </div>
              <div className="flex mt-4">
                <div className="w-1/2">
                  <p className="text-black/[.70] font-bold">Check-In</p>
                  <p className="text-black/[.65]">October 1, 2024</p>
                </div>
                <div className="w-1/2">
                  <p className="text-black/[.70] font-bold">Check-Out</p>
                  <p className="text-black/[.65]">October 4, 2024</p>
                </div>
              </div>
              <div className="flex mt-4">
                <div className="w-1/2">
                  <p className="text-black/[.70] font-bold">Adult Guests</p>
                  <p className="text-black/[.65]">2</p>
                </div>
                <div className="w-1/2">
                  <p className="text-black/[.70] font-bold">Child Guests</p>
                  <p className="text-black/[.65]">1</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-black/[.70] font-bold">Special Requests</p>
                <p className="text-black/[.65]">Use red bed sheets please.</p>
              </div>
              <div className="flex flex-col mt-4">
                <p className="text-black/[.70] font-bold">Add-Ons</p>
                <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 list-inside">
                  <p className="text-black/[.70]">• 2 Lifevest</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/5 flex flex-col gap-4">
          <p className="text-sm font-bold text-black/[.50]">BILLING DETAILS</p>
            <div className="flex flex-col gap-2 border-y-2 py-2">
              <div>
                <p className="font-bold">Room</p>
                <div className="flex flex-col gap-1 ms-4">
                  <div className="flex justify-between">
                      <p className="text-black/[.70] ">2 Weekends</p>
                      <p className="text-black font-bold">¥{formatCurrencyJP(6000)}</p>
                  </div>  
                  <div className="flex justify-between">
                      <p className="text-black/[.70] ">1 Weekday</p>
                      <p className="text-black font-bold">¥{formatCurrencyJP(1000)}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold">Extra Guests</p>
                <div className="flex flex-col gap-1 ms-4">
                  <div className="flex justify-between">
                      <p className="text-black/[.70] ">Adults x1</p>
                      <p className="text-black font-bold">¥{formatCurrencyJP(200)}</p>
                  </div>  
                  <div className="flex justify-between">
                      <p className="text-black/[.70] ">Child x1</p>
                      <p className="text-black font-bold">¥{formatCurrencyJP(100)}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold">Add-Ons</p>
                <div className="flex flex-col gap-1 ms-4">
                  <div className="flex justify-between">
                      <p className="text-black/[.70] ">Lifevest x2</p>
                      <p className="text-black font-bold">¥{formatCurrencyJP(500)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
                <p className="text-black/[.70] ">Subtotal</p>
                <p className="text-black font-bold">¥{formatCurrencyJP(9000)}</p>
            </div>
            <div className="flex justify-between">
                <p className="text-black/[.70] ">Deposit</p>
                <p className="text-black font-bold">- ¥{formatCurrencyJP(500)}</p>
            </div>
            <div className="flex justify-between">
                <p className="text-black/[.70] ">VAT</p>
                <p className="text-black font-bold">¥{formatCurrencyJP(9000 * 0.12)}</p>
            </div>
            {/* <div className="grid grid-cols-2 border-y-2">
              <span>Initial Bill</span>
              <span className="font-semibold">
                ₱ {commafy(selectedBillingData?.InitialBill)} +
              </span>
              <span>Add On Bill</span>
              <span className="font-semibold">
                ₱ {commafy(selectedBillingData?.TotalPerAddOn)} +
              </span>
              <span>Deposit</span>
              <span className="font-semibold">
                ₱ {commafy(selectedBillingData?.Deposit)} -
              </span>
            </div> */}
            <div className="border-t-2 p-t-2">
              {/* <span>Total Bill</span>
              <span className="font-bold">
                {`₱ ${commafy(
                  selectedBillingData?.TotalPerAddOn +
                    selectedBillingData?.InitialBill -
                    selectedBillingData?.Deposit,
                )}`}
              </span> */}
              <div className="flex justify-between bg-cstm-primary p-4 rounded-md mt-2 items-start">
                <p className="text-white/[.70] ">TOTAL</p>
                <p className="text-white text-3xl font-bold">¥{formatCurrencyJP(11200)}</p>
            </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              mutate(selectedBillingData?.Id);
            }}
            type="submit"
          >
            Finalize Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
