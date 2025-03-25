import AuditLogTable from "./AuditLogTable";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import AuditLogController from "./AuditLogController";

export default async function page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userdata = user?.user_metadata;

  if (userdata?.roleId === 3) {
    return notFound();
  }
  
  return (
    <div>
      <AuditLogController />
      <AuditLogTable />
    </div>
  );
}
