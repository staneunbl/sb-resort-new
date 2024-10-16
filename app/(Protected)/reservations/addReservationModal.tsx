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
import { format } from "date-fns";
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
import { useEffect } from "react";
import { isEmptyObj } from "@/utils/Helpers";
import { useTranslation } from "next-export-i18n";
import { Textarea } from "@/components/ui/textarea";

export default function AddReservationModal() {
    return <p>WIP</p>

}
