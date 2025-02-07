"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Mail, Printer } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/useGlobalStore";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editReservationStatus, getReservation } from "@/app/ServerAction/reservations.action";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "next-export-i18n";
export default function ReservationDetailsController({ id }: { id: string }) {
  const { t } = useTranslation();
  const reservationI18n = t("ReservationsPage");
  const dashboardI18n = t("DashboardPage");
  const guestI18n = t("GuestPage");
  const generali18n = t("general");
  const locale = t("locale");
  const router = useRouter();

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["ReservationDetails", id],
    queryFn: async () => {
      const res = await getReservation(id);
      console.log(res)
      if (!res.success) throw new Error();
      return res.res;
    },
  });

  const { mutate: noShowMutate } = useMutation({
    mutationFn: async () => {
      const res = await editReservationStatus(id, 6);
      if (!res.success) throw new Error();
      return;
    },
    onSuccess: () => {
      router.push("/reservations");
    },
    onError: () => {},
  });
  const { mutate: cancelledMutate } = useMutation({
    mutationFn: async () => {
      const res = await editReservationStatus(id, 5);
      if (!res.success) throw new Error();
      return;
    },
    onSuccess: () => {
      router.push("/reservations");
    },
    onError: () => {},
  });

  return (
    <div className="border-b border-cstm-secondary">
      <div className="px-4 py-2">
        <div className="">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              className="h-min rounded bg-cstm-secondary p-1"
            >
              <ChevronLeft size="20" />
            </Button>
            <h1 className="text-2xl font-semibold">
              {reservationI18n.reservationId}
              {id}
            </h1>
          </div>
        </div>
      </div>
      {
        !(data?.ReservationStatus == "Done") &&
        <div className="flex items-center justify-between bg-cstm-primary/50 px-4 py-1">
          <div className="flex items-center gap-1">
            <h1 className="pr-3 font-semibold">{generali18n.updateStatus}:</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="h-min rounded bg-red-500 p-1" size="sm">
                  {generali18n.cancel}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {reservationI18n.updateCancelled}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {reservationI18n.areyousureCancel}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{generali18n.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => cancelledMutate()}>
                    {generali18n.continue}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* ============================ */}
            {/* <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="h-min rounded bg-gray-500 p-1" size="sm">
                  {reservationI18n.noShow}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {reservationI18n.updateNoShow}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {reservationI18n.areyousureNoShow}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{generali18n.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => noShowMutate()}>
                    {generali18n.continue}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog> */}
          </div>
          {/* <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="h-min rounded bg-black p-1">
                  <Mail size="20" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resend Email</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="h-min rounded bg-gray-500 p-1">
                  <Printer size="20" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print Document</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="h-min rounded bg-green-500 p-1">
                  <Download size="20" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download Document</TooltipContent>
            </Tooltip>
          </div> */}
        </div>
      }
    </div>
  );
}
