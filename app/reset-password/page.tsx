"use client";
import { Card, CardHeader } from "@/components/ui/card";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UpdatePassword } from "../ServerAction/auth.action";
import { toast } from "sonner";
import { useTranslation } from "next-export-i18n";

const formSchema = z
  .object({
    password: z.string().min(2, {}),
    confirmPassword: z.string().min(2, {}),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function page() {
  const { t: roomsI18n } = useTranslation("rooms");
  const mutation = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (data: string) => {
      return await UpdatePassword(data);
    },
    onSuccess: (data) => {
      toast.success(roomsI18n.toast.success, {
        description: "nice",
      });
    },
    onError: (error) => {
      toast.error(roomsI18n.toast.error, {
        description: "Error",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-1/4">
        <CardHeader className="rounded-t-sm bg-cstm-primary p-3 pl-5 text-center font-semibold text-white">
          Reset Password
        </CardHeader>
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
