import "server-only";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("UserProfile")
    .select()
    .eq("UserId", user?.id);
  if (!user && error && !data) {
    return redirect("/login");
  } else if (data) {
    const userdata = data[0];
    return <div>{children}</div>;
  }
}
