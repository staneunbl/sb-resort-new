"use client";
import React from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { cn } from "@/lib/utils";

export default function ProgressBar() {
  const steps = [
    "Booking Date",
    "Rooms",
    "Room Rates",
    "Guest Detail",
    "Confirm",
  ];
  const { pageState } = useBookingStore();
  return (
    <div className="mx-auto flex w-full justify-between sm:w-8/12 md:w-7/12">
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "before:absolute before:right-2/4 before:top-1/3 before:h-1 before:w-full before:-translate-y-2/4 before:content-[''] before:first:hidden",
            `relative flex w-full flex-col items-center justify-center`,
            pageState >= index
              ? "before:bg-cstm-primary"
              : "before:bg-cstm-secondary",
          )}
        >
          <div
            className={`relative z-10 flex size-6 items-center justify-center rounded-full font-semibold text-white ${pageState >= index ? "bg-cstm-primary" : "bg-cstm-secondary"} sm:size-10 md:size-12`}
          >
            {index + 1}
          </div>
          <p
            className={cn(
              "font-base text-2xs text-nowrap",
              "md:text-xs",
              "lg:text-medium lg:text-base",
              pageState >= index
                ? "text-cstm-primary"
                : "text-cstm-secondary",
            )}
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}
