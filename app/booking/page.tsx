"use client"
import React from "react";
import ProgressBar from "./ProgressBar";
import BookingHeader from "./BookingHeader";
import BookingForm from "./BookingForm";
import { Toaster } from "@/components/ui/sonner";
import ScreenSize from "@/components/ScreenSize";
import { BookingFooter } from "./Footer";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="relative flex h-screen w-full flex-col  overflow-auto">
      <ScreenSize />
      <div id="top">
        <BookingHeader />
      </div>
      <Toaster />
      <div className="flex flex-grow h-auto flex-col gap-4 py-4 relative">
        <ProgressBar />
        <BookingForm />
      </div>
      <BookingFooter />
      <Button
        onClick={(e) => {
            document.getElementById("top")!.scrollIntoView({behavior: "smooth"})
          }
        }
        className="fixed rounded-lg right-5 bottom-5 w-16 h-16 bg-cstm-secondary border-2 border-white p-5"
      >
        <ArrowUpIcon size={20} color="currentColor"></ArrowUpIcon>
      </Button>
    </div>
  );
}
