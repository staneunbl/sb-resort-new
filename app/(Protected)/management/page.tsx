
import { redirect } from "next/navigation";
export default function page() {
  redirect("/management/guests");
  return <div>page</div>;
}
