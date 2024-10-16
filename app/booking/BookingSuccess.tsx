import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export function BookingSuccess() {
    return (
        <div className="w-full  sm:h-[500px] container mx-auto flex justify-center items-center">
            <div className="flex flex-col justify-center items-center bg-cstm-secondary rounded-lg p-10 max-w-[500px] mx-auto text-center">
                <div className="text-cstm-primary">
                    <CheckCircleIcon size={120} color="currentColor" />
                </div>
                <p className="text-2xl font-bold text-cstm-primary mt-4">Reservation Success!</p>
                <p className="text-lg text-white/[.7] mt-4">Your reservation has been created. Please wait for us to reach out regarding the payment.</p>
                <p className="text-lg text-white/[.7]">We wil also be sending an email with the details of your reservation.</p>
                <p className="text-lg text-white mt-4">Thank you for choosing ABC Resort!</p>

                <Link href="/" className="mt-4">
                    <Button>Back to Home</Button>
                </Link>
            </div>
        </div>
    );
}