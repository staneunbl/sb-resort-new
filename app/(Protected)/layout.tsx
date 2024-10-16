import "server-only";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function layout({children,}: {children: React.ReactNode;}) {
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
    return (
      <div className="flex w-full flex-1">
        <NavBar className="w-[290px]" role={userdata?.RoleId} />
        <div className="flex h-screen w-auto flex-1 flex-col">
          <Header
            firstName={userdata?.FirstName}
            lastName={userdata?.LastName}
          />
          <ScrollArea className="h-11/12 flex flex-1">{children}</ScrollArea>
        </div>
      </div>
    );
  }
}
