"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SelectComponent from "@/components/SelectComponent";
import { Filter } from "lucide-react";
import { generateYearsArray } from "@/utils/Helpers";
import { format } from "date-fns";
import { capitalizeFirstLetter } from "@/utils/Helpers";
import { useGlobalStore } from "@/store/useGlobalStore";
export default function SalesController({
  children,
}: {
  children?: React.ReactNode;
}) {
  const MonthOption = [
    {
      label: "January",
      value: "January",
    },
    {
      label: "February",
      value: "February",
    },
    {
      label: "March",
      value: "March",
    },
    {
      label: "April",
      value: "April",
    },
    {
      label: "May",
      value: "May",
    },
    {
      label: "July",
      value: "July",
    },
    {
      label: "August",
      value: "August",
    },
    {
      label: "September",
      value: "September",
    },
    {
      label: "October",
      value: "October",
    },
    {
      label: "November",
      value: "November",
    },
    {
      label: "December",
      value: "December",
    },
  ];
  const YearOption = generateYearsArray(2020, 2025);

  const getMonth = () => {
    const today = new Date();
    const month = format(today, "MMMM")
    console.log(month)
    return month.toLowerCase();
  }

  const [fromMonth, setFromMonth] = useState("january")
  const [fromYear, setFromYear] = useState(new Date().getFullYear().toString())
  const [toMonth, setToMonth] = useState("december")
  const [toYear, setToYear] = useState(new Date().getFullYear().toString())
  const {
    setSelectedReportRange,
    selectedReportRange
  } = useGlobalStore()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-row items-center gap-2 border-b border-cstm-border px-4 py-3">
        <div className="flex w-full items-center gap-4">
          <h1 className="text-2xl font-semibold">From</h1>
          <div className="flex flex-row gap-2">
            <SelectComponent
              className="w-[150px]"
              options={MonthOption}
              placeholder="Select Month"
              defaultValue={getMonth()}
              state={fromMonth}
              setState={setFromMonth}
            />
            <SelectComponent
              className="w-[120px]"
              options={YearOption}
              placeholder="Select Year"
              state={fromYear}
              setState={setFromYear}
            />
          </div>
          <h1 className="text-2xl font-semibold">To</h1>
          <div className="flex flex-row gap-2">
            <SelectComponent
              className="w-[150px]"
              options={MonthOption}
              placeholder="Select Month"
              state={toMonth}
              setState={setToMonth}
            />
            <SelectComponent
              className="w-[120px]"
              options={YearOption}
              placeholder="Select Year"
              state={toYear}
              setState={setToYear}
            />
          </div>
          <Button 
            className="flex items-center gap-2 bg-cstm-primary text-cstm-tertiary" 
            onClick={() => {
                setSelectedReportRange({from: new Date(`${fromMonth} 1 ${fromYear}`), to: new Date(`${toMonth} 1 ${toYear}`)}) 
                console.log(selectedReportRange)
              }
            }
          >
            Fetch Report
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
