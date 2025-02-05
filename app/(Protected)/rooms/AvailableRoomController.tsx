"use client";
import { Filter, FilterX } from "lucide-react";
import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { enUS, ja } from "date-fns/locale";
import { useTranslation } from "next-export-i18n";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGlobalStore } from "@/store/useGlobalStore";

export default function AvailableRoomController() {
  const { t } = useTranslation();
  const locale: string = t("locale");
  const localeFns: { [key: string]: any } = {
    en: enUS,
    ja: ja,
  };

  const {
    availableRoomsDateSelect,
    setAvailableRoomsDateSelect
   } = useGlobalStore()

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  const handleDateSelect = (selected: any) => {
    setDate(selected);
    setAvailableRoomsDateSelect(selected);
    
    console.log(availableRoomsDateSelect);
  }

  return (
    <div className="flex w-full flex-row items-center justify-between gap-2 border-b border-cstm-border px-4 py-3">
      <div className="flex w-full items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start border-cstm-secondary text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y", {
                      locale: localeFns[locale],
                    })}{" "}
                    -{" "}
                    {format(date.to, "LLL dd, y", {
                      locale: localeFns[locale],
                    })}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="border-1.5 w-auto border-cstm-secondary p-0"
            align="start"
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button className="flex items-center gap-2 bg-cstm-primary text-cstm-tertiary"
        onClick = {() => {
          //to reset local date state
          setDate({ from: undefined, to: undefined }); 
          // Reset correctly
          setAvailableRoomsDateSelect({ from: undefined, to: undefined }); // Reset global store
        }
        }
        >
          <FilterX size={20} />
        </Button>
      </div>
    </div>
  );
}
