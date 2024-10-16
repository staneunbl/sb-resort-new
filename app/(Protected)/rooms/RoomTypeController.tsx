"use client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "next-export-i18n";
export default function RoomTypeController() {
  const router = useRouter();
  const { t } = useTranslation("rooms");
  const roomTypeI18n = t("RoomsPage");
  const { roomTypeOptionsQuery } = useGlobalStore();
  const { data: roomTypeOptions } = roomTypeOptionsQuery();

  return (
    <div className="flex w-full flex-row items-center justify-end gap-2 border-b border-cstm-border px-4 py-3">
      <Button
        className="flex items-center gap-2 bg-cstm-secondary text-cstm-tertiary"
        onClick={() => {
          router.push("/rooms/addroomtype");
        }}
      >
        <Plus size={16} />
        {roomTypeI18n.addRoomType}
      </Button>
    </div>
  );
}
