"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "next-export-i18n";
export default function AlertConfirmDelete({
  openState,
  onOpenChange,
  onConfirm,
}: {
  openState: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const i18n = t("general");
  return (
    <AlertDialog open={openState} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{i18n.alertConfirmDelete}</AlertDialogTitle>
          <AlertDialogDescription>
            {i18n.alertConfirmDelDesc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-destructive text-white hover:bg-red-500/95 hover:text-white">
            {i18n.cancel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {i18n.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
