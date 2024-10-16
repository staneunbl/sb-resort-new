import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
export default function BookingHeader({ className }: { className?: string }) {
  return (
    <div className={cn(className, "border-b-1 bg-cstm-secondary p-4 flex justify-center")}>
        <Link href="/">
          <h1 className="text-4xl font-semibold text-cstm-tertiary">
            ABC Resort
          </h1>
        </Link>
      </div>
  );
}
