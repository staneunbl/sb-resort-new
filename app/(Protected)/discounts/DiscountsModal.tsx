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
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "next-export-i18n";
import { toast } from "sonner";
import { isEmptyObj } from "@/utils/Helpers";
import { addPromos, updatePromos } from "@/app/ServerAction/promos.action";
export function DiscountsModal() {

    const { discountFormModalState, setDiscountFormModalState, selectedDiscountData } = useGlobalStore();

    const isEditMode = isEmptyObj(selectedDiscountData) ? false : true;


    
    return (
        <Dialog
            open={discountFormModalState}
            onOpenChange={(open) => {
                setDiscountFormModalState(open);
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{"Add Discount"}</DialogTitle>
                    <DialogDescription>
                        {"Please fill up the form to add a new discount."}
                    </DialogDescription>
                </DialogHeader>
                
                <div>
                    form goes here
                </div>
            </DialogContent>
        </Dialog>
    );
}