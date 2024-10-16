import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  return (
    <Select required={required} onValueChange={setState} value={state} defaultValue={defaultValue}>
      <SelectTrigger
        className={cn("w-[180px] border-cstm-secondary", className)}
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
