import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { useGlobalStore } from "@/store/useGlobalStore";
import { addWeeks } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import SelectComponent from "@/components/SelectComponent";
import { useTranslation } from "next-export-i18n";
import { addRoomRate, editRoomRate } from "@/app/ServerAction/rooms.action";
import { useEffect } from "react";

export function AmenitiesModal() {

    const {
        amenityFormModalState,
        setAmenityFormModalState,
        selectedAmenity
    } = useGlobalStore()

    return (
        <Dialog
          open={amenityFormModalState}
          onOpenChange={(open) => {
            setAmenityFormModalState(open);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Edit Amenity
              </DialogTitle>
              <DialogDescription>
                Edit an Amenity's Label and Description
              </DialogDescription>
            </DialogHeader>
            <p>{selectedAmenity.Label}</p>
            <p>{selectedAmenity.Description}</p>
          </DialogContent>
        </Dialog>
      );
}