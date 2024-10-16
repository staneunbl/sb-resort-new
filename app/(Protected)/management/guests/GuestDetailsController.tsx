"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Mail, Printer } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
export default function GuestDetailsController({ id = "1" }: { id?: string }) {
  const router = useRouter();
  return (
    <div className="border-b border-cstm-secondary">
      <div className="px-4 py-2">
        <div className="">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              className="h-min rounded bg-cstm-secondary p-1"
            >
              <ChevronLeft size="20" />
            </Button>
            <h1 className="text-2xl font-semibold">
              Guest Number:{` `}
              {id}{" "}
            </h1>
            <span className="text-sm font-light text-foreground">Details</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-cstm-primary/50 px-4 py-1">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="h-min rounded bg-black p-1">
                <Mail size="20" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Resend Email</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="h-min rounded bg-gray-500 p-1">
                <Printer size="20" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print Document</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="h-min rounded bg-green-500 p-1">
                <Download size="20" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download Document</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
