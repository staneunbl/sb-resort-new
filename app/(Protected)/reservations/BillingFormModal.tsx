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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import {
  addBillings,
  getRoomOptions,
  updateCheckInTime,
} from "@/app/ServerAction/reservations.action";
import { getCurrentRoomTypesRate } from "@/app/ServerAction/rooms.action";
import {
  calculateInitialBill,
  formatCurrencyJP,
  getPercentage,
} from "@/utils/Helpers";
import { useTranslation } from "next-export-i18n";
export default function BillingFormModal() {
  const { t } = useTranslation();
  const reservationI18n = t("ReservationsPage");
  const generali18n = t("general");
  const roomsI18n = t("RoomsPage");
  const {
    billingFormModalState,
    setBillingFormModalState,
    selectedReservationData,
    reservationQuery,
  } = useGlobalStore();

  const { refetch: refetchReservation } = reservationQuery();

  const mutation = useMutation({
    mutationKey: ["AddBilling"],
    mutationFn: async (values: any) => {
      const res = await addBillings(values);
      const res2 = await updateCheckInTime(values.ReservationId, new Date());
      if (!res.success) throw new Error();
      if (!res2.success) throw new Error();
      return res;
    },
    onSuccess: () => {
      toast.success(generali18n.success, {
        description: "The guest reservation has been successfully updated.",
      });
      refetchReservation();
      setBillingFormModalState(false);
    },
    onError: () => {
      toast.error(generali18n.somethingWentWrong, {
        description: "Please try again later",
      });
    },
  });

  const { data: currentRoomtypeRate, isFetched } = useQuery({
    queryKey: ["RoomTypePrice", selectedReservationData?.RoomTypeId || 0],
    enabled: selectedReservationData ? true : false,
    queryFn: async () => {
      const res = await getCurrentRoomTypesRate(
        selectedReservationData?.RoomTypeId || 0,
      );
      if (!res.success) throw new Error();
      //console.log(selectedReservationData.CheckInDate, selectedReservationData.CheckOutDate)
      return calculateInitialBill(
        selectedReservationData.CheckInDate,
        selectedReservationData.CheckOutDate,
        res.res[0]?.BaseRoomRate,
        res.res[0]?.WeekendRoomRate,
        selectedReservationData?.ExtraAdult || 0,
        res.res[0]?.ExtraAdultRate,
        res.res[0]?.WeekendExtraAdultRate,
        selectedReservationData?.ExtraChild || 0,
        res.res[0]?.ExtraChildRate,
        res.res[0]?.WeekendExtraChildRate,
      );
    },
  });

  const { data: RoomOptions } = useQuery({
    queryKey: ["RoomsOpt", selectedReservationData?.RoomTypeId],
    enabled: selectedReservationData ? true : false,
    queryFn: async () => {
      const res = await getRoomOptions(selectedReservationData?.RoomTypeId);
      if (!res.success) throw new Error();
      return res.res;
    },
  });

  const formSchema = z.object({
    RoomNumbers: z.array(z.number()).min(selectedReservationData?.RoomCount, {
      message: "Please enter room number",
    }),
    InitialBill: z.number().min(1),
    Deposit: z.string().min(1, { message: "Please enter deposit amount" }),
    ReservationId: z.number().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      RoomNumbers: [],
      InitialBill: currentRoomtypeRate || 0,
      Deposit: "",
      ReservationId: selectedReservationData?.Id || 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    mutation.mutate(values);
  }

  const reservationBill = (price: number) => {
    const vat = price * 0.12;
    const subtotal = price + vat;
    const discountValue = selectedReservationData.DiscountId
      ? selectedReservationData.Discounts.DiscountType === "percentage"
        ? getPercentage(
          subtotal,
          selectedReservationData.Discounts.DiscountValue,
        )
        : selectedReservationData.Discounts.DiscountValue
      : 0;

    // console.log("Price :", price)
    // console.log("VAT: " , vat)
    // console.log("Discount: ", discountValue)
    return subtotal - discountValue;
  };

  return (
    <Dialog
      open={billingFormModalState}
      onOpenChange={(open) => {
        form.reset();
        setBillingFormModalState(open);
      }}
    >
      <DialogContent className="flex flex-col sm:max-w-[450px]">
        <DialogHeader className="mt-2 mb-3">
          <DialogTitle>{reservationI18n.billing}</DialogTitle>
          <DialogDescription>
            {reservationI18n.billingFormDesc}
          </DialogDescription>
          <div className="flex border-t border-cstm-secondary pt-2">
            <div className="w-1/2">
              <DialogDescription className="font-semibold">
                {reservationI18n.reservationId}: {selectedReservationData?.Id}
              </DialogDescription>
              <DialogDescription className="font-semibold">
                {reservationI18n.numberOfRooms}:{" "}
                {`${selectedReservationData?.RoomCount}`}
              </DialogDescription>
            </div>
            <div className="w-1/2">
              <DialogDescription className="font-semibold">
                {roomsI18n.roomType}: {selectedReservationData?.RoomType}
              </DialogDescription>
              <DialogDescription className="font-semibold">
                {reservationI18n.initialBill}:{" "}
                <span className="text-green-500">
                  {`${!isFetched && currentRoomtypeRate
                    ? "Calculating..."
                    : `P ${formatCurrencyJP(reservationBill(currentRoomtypeRate || 0))}`
                    }`}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-1 flex-col space-y-1"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Form fields container */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="RoomNumbers"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{roomsI18n.roomNumber}</FormLabel>
                    {/* Show message when no rooms are available */}
                    {!RoomOptions || RoomOptions.length === 0 ? (
                      <p className="text-sm text-red-500 font-semibold">
                        🚨 THERE ARE NO AVAILABLE ROOMS
                      </p>
                    ) : (
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="max-w text-sm">
                          <SelectValue placeholder={roomsI18n.roomNumber} />
                        </SelectTrigger>
                        <SelectContent>
                          {RoomOptions.map((item) => (
                            <SelectItem key={item.label} value={item.label.toString()}>
                              Room {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <div className="h-4">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{reservationI18n.deposit}</FormLabel>
                    <Input type="number" {...field} />
                    <div className="h-4">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-auto">
              <Button
                className="bg-cstm-secondary"
                type="submit"
                disabled={!RoomOptions || RoomOptions.length === 0} // Disable if no rooms available
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
