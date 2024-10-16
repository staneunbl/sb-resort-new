import UserFormModal from "./UserFormModal";
import UsersController from "./UsersController";
import UsersTable from "./UsersTable";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userdata = user?.user_metadata;

  if (![1,3].includes(userdata?.roleId)) {
    return notFound();
  }

  return (
    <div>
      <UserFormModal />
      <UsersController />
      <UsersTable />
    </div>
  );
}
