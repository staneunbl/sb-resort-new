import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userdata = user?.user_metadata;
  if (userdata?.role === 3) {
    return notFound();
  }
  return <div>{children}</div>;
}
