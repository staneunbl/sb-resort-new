import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MainOptions } from "@/types";

export default function SelectComponent({
  className,
  state,
  setState,
  options = [],
  valueType = "value",
  placeholder = "Select",
  defaultValue = "",
  required = false,
}: {
  className?: string;
  state?: string;
  setState?:
    | React.Dispatch<React.SetStateAction<string | number>>
    | ((value: string) => void);
  options: MainOptions[];
  valueType?: "value" | "label";
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {


  // Use the state directly to handle component state instead of relying solely on props
  // const handleValueChange = (value: string) => {
    
  //   if (value !== state) {
  //     setState?.(value);
  //   }
  // };

  const handleValueChange = (value: string) => {
    console.log("change " ,value)
    if(value == undefined || value == "") return
    if (setState) {
      setState(value);
    }
  };

  // if (options.length === 0) {
  //   return (
  //     <div className={cn("w-[180px] h-10 bg-gray-100 animate-pulse rounded", className)} />
  //   );
  // }

  return (
    <Select required={required} onValueChange={handleValueChange} value={state} defaultValue={defaultValue}>
      <SelectTrigger
        className={cn("w-[180px]", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={
              valueType === "value"
                ? option.value.toString().toLowerCase()
                : option.label.toLowerCase()
            }
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
