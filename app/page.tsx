import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Index() {

  async function redirectToBooking() {
    "use server";
    redirect("/booking");
  }
  
  return (
    <div className="bg-[url('/beachImg.jpg')] bg-cover">
      <div className="flex h-screen w-screen flex-col items-center justify-between backdrop-blur-2xl">
        <h1 className="mt-20 text-center text-9xl font-extrabold">
          ABC Beach Resort
        </h1>
        <form action={redirectToBooking}>
          <Button
            size="lg"
            variant="ghost"
            className="text-8+xl mb-20 rounded-sm border-1.5 py-2 text-cstm-secondary"
            type="submit"
          >
            Book Now
          </Button>
        </form>
        <p>Copyright © 2024 ABC. All rights reserved.</p>
      </div>
    </div>
  );
}
