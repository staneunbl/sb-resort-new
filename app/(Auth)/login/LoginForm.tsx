import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Login } from "@/app/ServerAction/auth.action";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Label } from "@/components/ui/label";

export default async function LoginForm({
    className,
    searchParams,
}: {
    className?: string;
    searchParams?: { message: string };
}) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return redirect("/dashboard");
    }
    return (
      <Card className={cn("flex flex-col h-max w-2/3 gap-2 px-5 py-4", className)}>
        <div>
          <h1 className="font-base text-center text-4xl">Login</h1>
          <div className="h-6 p-1 text-center text-sm text-danger">
            {searchParams?.message}
          </div>
        </div>
        <form className="flex flex-col gap-2" action={Login}>
          <div className="h-[80px] flex flex-col gap-3">
            <Label htmlFor="email">Email / Username</Label>
            <Input  placeholder="Enter Email / Username" name="email" type="email" />
          </div>
          <div className="h-[80px] flex flex-col gap-3">
            <Label htmlFor="password">Password</Label>
            <Input placeholder="Enter Password" name="password" type="password" />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </Card>
    );
}
