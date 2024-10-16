import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export default function ScreenSize() {
  return (
    <Card
      className={cn(
        "absolute right-0 top-0 z-50 bg-yellow-800 p-4",
        "sm:bg-green-800",
        "md:bg-blue-800",
        "lg:bg-red-800",
        "xl:bg-purple-800",
        "2xl:bg-pink-800",
      )}
    >
      <p className="text-white sm:hidden">SX</p>
      <p className="hidden text-white sm:block md:hidden">SM</p>
      <p className="hidden text-white md:block lg:hidden">MD</p>
      <p className="hidden text-white lg:block xl:hidden">LG</p>
      <p className="hidden text-white xl:block 2xl:hidden">XL</p>
      <p className="hidden text-white 2xl:block">2XL</p>
    </Card>
  );
}
