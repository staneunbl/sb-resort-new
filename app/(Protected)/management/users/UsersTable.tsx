"use client";
import DetailedDataTable from "@/components/DetailedDataTable";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { useState } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { resetUserPW } from "@/app/ServerAction/manage.action";
import { useTranslation } from "next-export-i18n";
export default function UsersTable() {
  const { t } = useTranslation();
  const generali18n = t("general");
  const [open, setOpen] = useState(false);
  const [resetPWopen, setResetPWopen] = useState(false);

  const [selectedId, setSelectedId] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");

  const { usersQuery, userRoleFilterOpt, setUserRoleFilterOpt } =
    useGlobalStore();

  const { data, isLoading } = usersQuery();

  const column = [
    {
      accessorKey: "Id",
    },
    {
      accessorKey: "FirstName",
    },
    {
      accessorKey: "LastName",
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ cell, row }: any) =>
        row.getValue("FirstName") + " " + row.getValue("LastName"),
    },
    {
      accessorKey: "Email",
      header: "Email",
    },
    {
      accessorKey: "Role",
      header: "Role",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setResetPWopen(true);
                  setSelectedEmail(record.Email);
                }}
              >
                Reset Password
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => {
                  setSelectedId(row.getValue("id"));
                  setOpen(true);
                }}
                className="font-medium text-red-500"
              >
                Delete
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const resetPWMutation = useMutation({
    mutationFn: (email: string) => {
      const res = resetUserPW(email);
      return res;
    },
    onSuccess: (data) => {
      toast.success(generali18n.success, {});
    },
    onError: (error) => {
      toast.error(generali18n.failed, {
        description: generali18n.somethingWentWrong,
      });
    },
    onSettled: () => {
      setResetPWopen(false);
    },
  });

  /*  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(1);
        }, 1000);
      });
    },
    onSuccess: (data) => {
      toast.success("Guest deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete guest");
    },
  }); */

  return (
    <div className="p-4">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to do this?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone, do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={resetPWopen} onOpenChange={setResetPWopen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to do this?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite the original password. Do you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetPWMutation.mutate(selectedEmail)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DetailedDataTable
        title="Users list"
        isLoading={isLoading}
        columns={column}
        columnToSearch={["Email", "FirstName", "LastName", "Role"]}
        data={data || []}
        filterByCol={[{ column: "Role", filterValue: userRoleFilterOpt }]}
        visibility={{
          FirstName: false,
          LastName: false,
          Id: false,
        }}
      />
    </div>
  );
}
