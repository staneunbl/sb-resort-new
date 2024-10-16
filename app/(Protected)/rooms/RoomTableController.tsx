"use client";
import { FilterX, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/useGlobalStore";
import SelectComponent from "@/components/SelectComponent";
import { useEffect } from "react";
import { useTranslation } from "next-export-i18n";
export default function RoomTableController() {
  const {
    setRoomFormModalState,
    roomTypeOptionsQuery,
    roomStatusOptionsQuery,
    resetSelectOptState,
    setSelectedRoomTypeOpt,
    setSelectedRoomStatusOpt,
    selectedRoomStatusOpt,
    selectedRoomTypeOpt,
    setSelectedRoomData,
  } = useGlobalStore();
  const { data: roomTypeOption } = roomTypeOptionsQuery();
  const { data: roomStatusOption } = roomStatusOptionsQuery();
  const { t } = useTranslation();
  const roomsI18n = t("RoomsPage");
  useEffect(() => {
    resetSelectOptState();
  }, []);
  return (
    <div className="flex w-full flex-row items-center justify-between gap-2 border-b border-cstm-border px-4 py-3">
      <div className="flex w-full items-center gap-4">
        <SelectComponent
          options={roomTypeOption}
          placeholder={roomsI18n.selectRoomType}
          valueType="label"
          state={selectedRoomTypeOpt}
          setState={setSelectedRoomTypeOpt}
        />
        <SelectComponent
          options={roomStatusOption}
          placeholder={roomsI18n.selectStatus}
          valueType="label"
          state={selectedRoomStatusOpt}
          setState={setSelectedRoomStatusOpt}
        />
        <Button
          onClick={() => {
            resetSelectOptState();
          }}
          className="flex items-center gap-2 bg-cstm-primary text-cstm-tertiary"
        >
          <FilterX />
        </Button>
      </div>
      <Button
        className="flex items-center gap-2 bg-cstm-secondary text-cstm-tertiary"
        onClick={() => {
          setRoomFormModalState(true);
          setSelectedRoomData(null);
        }}
      >
        <Plus size={16} />
        {roomsI18n.addRoom}
      </Button>
    </div>
  );
}
