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

import { commafy } from "@/utils/Helpers";
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalize Bill</DialogTitle>
          <DialogDescription>
            Finalize the billing? This will process the billing and update the
            reservation status to "Checked Out".
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Billing Details</h1>
          <div className="grid grid-cols-2 border-y-2">
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
          </div>
          <div className="grid grid-cols-2 border-y-2">
            <span>Total Bill</span>
            <span className="font-bold">
              {`₱ ${commafy(
                selectedBillingData?.TotalPerAddOn +
                  selectedBillingData?.InitialBill -
                  selectedBillingData?.Deposit,
              )}`}
            </span>
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
