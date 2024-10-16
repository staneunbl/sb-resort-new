import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Register } from "@/app/ServerAction/auth.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
export default function RefgisterForm({
  className,
  searchParams,
}: {
  className?: string;
  searchParams?: { message: string };
}) {
  return (
    <Card
      className={cn("flex h-max w-1/5 flex-col gap-2 px-5 py-4", className)}
    >
      <div>
        <h1 className="font-base text-center text-4xl">Create</h1>
      </div>
      <div className="h-6 p-1 text-center text-sm text-danger">
        {searchParams?.message}
      </div>
      <form className="flex flex-col gap-2" action={Register}>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password">Email </Label>
          <Input name="email" type="email" />
        </div>
        <div className="flex gap-3">
          <div className="w-1/2 flex flex-col gap-3">
            <Label htmlFor="password">First name</Label>
            <Input name="firstName" type="text" />
          </div>
          <div className="w-1/2 flex flex-col gap-3">
            <Label htmlFor="password">Last name</Label>
            <Input name="lastName" type="text" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password">Password</Label>

          <Input name="password" type="password" />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            name="confirmPassword"
            type="password"
            className={`${searchParams?.message ? "border-danger" : "border-default"}`}
          />
        </div>
        <Button type="submit">Register</Button>
      </form>
    </Card>
  );
}
