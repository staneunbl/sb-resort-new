import React from "react";
import { Badge } from "./ui/badge";
import { useTranslation } from "next-export-i18n";
import { capitalizeFirstLetter } from "@/utils/Helpers";
export default function ReservationStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const generali18n = t("general");
  const badgeColor = {
    percentage: "bg-orange-500",
    flat: "bg-blue-500",
  }[status];
  return (
    <Badge className={`${badgeColor} hover:${badgeColor}`}>
      {capitalizeFirstLetter(status)}
    </Badge>
  );
}
