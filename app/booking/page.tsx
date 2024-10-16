import React from "react";
import ProgressBar from "./ProgressBar";
import BookingHeader from "./BookingHeader";
import BookingForm from "./BookingForm";
import { Toaster } from "@/components/ui/sonner";
import ScreenSize from "@/components/ScreenSize";
import { BookingFooter } from "./Footer";

export default function page() {
  return (
    <div className="relative flex h-screen w-full flex-col  overflow-auto">
      <ScreenSize />
      <BookingHeader />
      <Toaster />
      <div className="flex flex-grow h-auto flex-col gap-4 py-4 relative">
        <ProgressBar />
        <BookingForm />
      </div>
      <BookingFooter />
    </div>
  );
}
