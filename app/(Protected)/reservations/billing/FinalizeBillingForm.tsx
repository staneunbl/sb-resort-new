"use client";
import React, { useEffect } from "react";
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

import { calculateFinalBill, calculateInitialBill, commafy, findWeekdaysInRange, formatCurrencyJP, getPercentage } from "@/utils/Helpers";
import { finalizeBill, updateCheckOutTime } from "@/app/ServerAction/reservations.action";
import { toast } from "sonner";
import { FormProvider } from "react-hook-form";
import { format } from "date-fns";
import { SiMastercard, SiVisa, SiAmericanexpress } from "@icons-pack/react-simple-icons";

export default function FinalizeBillingForm() {
  const {
    finilizeBillingModalState,
    setFinilizeBillingModalState,
    selectedBillingData,
    reservationSummaryQuery
  } = useGlobalStore();

  const {
    weekdays, weekends
  } = findWeekdaysInRange(selectedBillingData.CheckInDate, selectedBillingData.CheckOutDate);

  const subtotal = calculateFinalBill(
    selectedBillingData.CheckInDate,
    selectedBillingData.CheckOutDate,
    1,
    selectedBillingData.BaseRate,
    selectedBillingData.WEBaseRate,
    selectedBillingData.ExtraAdult,
    selectedBillingData.AdultRate,
    selectedBillingData.WEAdultRate,
    selectedBillingData.ExtraChild,
    selectedBillingData.ChildRate,
    selectedBillingData.WEChildRate,
    selectedBillingData.TotalPerAddOn
  )

  const vat = subtotal * 0.12;

  const discount = selectedBillingData.DiscountValue ? selectedBillingData.DiscountType === "percentage" ? getPercentage(subtotal + vat, selectedBillingData.DiscountValue) : selectedBillingData.DiscountValue : 0;

  const { refetch } = reservationSummaryQuery()

  useEffect(() => {
    console.log(selectedBillingData)
  }, [selectedBillingData])

  const { mutate } = useMutation({
    mutationKey: ["FinalizeBill"],
    mutationFn: async (value: number) => {
      const res = await finalizeBill(value);
      const res2 = await updateCheckOutTime(selectedBillingData.ReservationId, new Date());
      if (!res.success) throw new Error();
      if (!res2.success) throw new Error();
      return res;
    },
    onSuccess: () => {
      refetch();
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
       
          {
            !(selectedBillingData == undefined) &&
            <div className="flex flex-col gap-4">
              <p className="text-3xl font-bold text-cstm-secondary">Summary for Reservation #{selectedBillingData.ReservationId}</p>
              <hr></hr>
              <div className="flex">
                <div className="w-3/5">
                  <p className="text-sm font-bold text-black/[.50]">RESERVATION DETAILS</p>
                  <div>
                    <p className="text-2xl font-bold text-black/[.80]">{selectedBillingData.FirstName} {selectedBillingData.LastName}</p>
                    <p className="text-black/[.65]">Reservation ID#{selectedBillingData.ReservationId}</p>
                    <div className="flex mt-4">
                      <div className="w-1/2">
                        <p className="text-black/[.70] font-bold">Room Type</p>
                        <p className="text-black/[.65]">{selectedBillingData.RoomType}</p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-black/[.70] font-bold">Room Number</p>
                        <p className="text-black/[.65]">Room {selectedBillingData.RoomNumber}</p>
                      </div>
                    </div>
                    <div className="flex mt-4">
                      <div className="w-1/2">
                        <p className="text-black/[.70] font-bold">Check-In</p>
                        <p className="text-black/[.65]">{format(new Date(selectedBillingData?.CheckInDate || new Date()), "E, MMM dd yyyy")}</p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-black/[.70] font-bold">Check-Out</p>
                        <p className="text-black/[.65]">{format(new Date(selectedBillingData?.CheckOutDate || new Date()), "E, MMM dd yyyy")}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-black/[.70] font-bold">Special Requests</p>
                      <p className="text-black/[.65]">{selectedBillingData.Request ? selectedBillingData.Request : "None"}</p>
                    </div>
                    {
                      
                      <div className="flex flex-col mt-4">
                        <p className="text-black/[.70] font-bold">Add-Ons</p>
                        {
                          !(selectedBillingData.AddOns == undefined || selectedBillingData.AddOns.length == 0) ?
                          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 list-inside">
                            {selectedBillingData.AddOns.map((addOn: any) => {
                              return <p className="text-black/[.70]">• {addOn.Quantity} {addOn.AddOnName}</p>
                            })}
                          </div> :
                          <p className="text-black[/.50]">No add-ons.</p>
                        }
                      </div>
                    }
                  </div>
                </div>
                <div className="w-2/5 flex flex-col">
                  <p className="text-sm font-bold text-black/[.50]">BILLING DETAILS</p>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                      {
                        selectedBillingData.PromoCode &&
                        <div className="flex justify-between">
                            <p className="text-black font-bold ">Promo Code</p>
                            <p className=""><span className="text-white p-1 rounded bg-cstm-secondary">{selectedBillingData.PromoCode}</span></p>
                        </div>  
                      }
                      <div>
                        <p className="font-bold">Room</p>
                        <div className="flex flex-col gap-4 ms-4">
                          {
                            weekdays > 0 &&
                            <div className="flex justify-between">
                                <p className="text-black/[.70] ">{weekdays} Weekday(s)</p>
                                <p className="text-black font-bold">¥{formatCurrencyJP(selectedBillingData.BaseRate * weekdays)}</p>
                            </div>  
                          }
                          {
                            weekends > 0 && 
                            <div className="flex justify-between">
                                <p className="text-black/[.70] ">{weekends} Weekend(s)</p>
                                <p className="text-black font-bold">¥{formatCurrencyJP(selectedBillingData.WEBaseRate * weekends)}</p>
                            </div>
                          }
                        </div>
                      </div>
                      {
                        (selectedBillingData.ExtraAdult > 0 || selectedBillingData.ExtraChild > 0) &&
                        <div>
                          <p className="font-bold">Extra Guests</p>
                          <div className="flex flex-col gap-1 ms-4">
                            {
                              selectedBillingData.ExtraAdult > 0 &&
                              <div className="flex justify-between">
                                  <p className="text-black/[.70] ">Adults x{selectedBillingData.ExtraAdult}</p>
                                  <p className="text-black font-bold">¥{formatCurrencyJP(((selectedBillingData.AdultRate * weekdays) * selectedBillingData.ExtraAdult) + ((selectedBillingData.WEAdultRate * weekends) * selectedBillingData.ExtraAdult))}</p>
                              </div>  
                            }
                            {
                              selectedBillingData.ExtraChild > 0 &&
                              <div className="flex justify-between">
                                  <p className="text-black/[.70] ">Child x{selectedBillingData.ExtraChild}</p>
                                  <p className="text-black font-bold">¥{formatCurrencyJP(((selectedBillingData.ChildRate * weekdays) * selectedBillingData.ExtraChild) + ((selectedBillingData.WEChildRate * weekends) * selectedBillingData.ExtraChild))}</p>
                              </div>
                            }
                          </div>
                        </div>
                      }
                        {
                          !(selectedBillingData.AddOns == undefined || selectedBillingData.AddOns.length == 0)  &&
                          <div> 
                            <p className="font-bold">Add-Ons</p>
                            <div className="flex flex-col gap-1 ms-4">
                              <div className="flex flex-col justify-between">
                                {
                                  selectedBillingData.AddOns.map((addOn: any) =>{
                                    return <div className="flex justify-between">
                                      <p className="text-black/[.70] " onClick={() => console.log(selectedBillingData.AddOns)}>{addOn.AddOnName} x{addOn.Quantity}</p>
                                      <p className="text-black font-bold">¥{formatCurrencyJP(addOn.AddOnPrice * addOn.Quantity)}</p>
                                    </div>
                                  })
                                }
                              </div>
                            </div>
                          </div>
                        }
                    </div>
                    <hr></hr>
                    <div className="flex justify-between">
                        <p className="text-black/[.70] ">Subtotal</p>
                        <p className="text-black font-bold">¥{formatCurrencyJP(subtotal)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-black/[.70] ">VAT <span className="text-black/[.50] text-sm ">(12%)</span></p>
                        <p className="text-black font-bold">¥{formatCurrencyJP(subtotal * 0.12)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-black/[.70] ">Discount <span className="text-black/[.50] text-sm ">({selectedBillingData.DiscountCode})</span></p>
                        <p className="text-green-500 font-bold">- ¥{formatCurrencyJP(discount)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-black/[.70] ">Deposit</p>
                        <p className="text-black font-bold">- ¥{formatCurrencyJP(selectedBillingData.Deposit)}</p>
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
                          ¥{formatCurrencyJP(((subtotal + (subtotal * 0.12) - discount) - selectedBillingData.Deposit))}
                        </p>
                    </div>
                    <div className="flex gap-4 rounded bg-white p-1 justify-end">
                        <SiMastercard color="default"></SiMastercard>
                        <SiVisa color="default"></SiVisa>
                        <SiAmericanexpress color="default"></SiAmericanexpress>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            }
        <DialogFooter className="mt-4">
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
