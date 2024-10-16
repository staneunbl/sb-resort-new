import LoginForm from "./LoginForm";

export default function page({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    return (
        <div className="flex h-dvh">
            <div className="h-full w-6/12 bg-[url('/beachImg.jpg')] bg-cover shadow-md">
                <div className="flex h-full items-center justify-center backdrop-blur">
                    <h1 className="text-center text-8xl font-extrabold text-white">
                        Resort Reservation System
                    </h1>
                </div>
            </div>
            <div className="flex w-1/2 flex-1 items-center justify-center shadow">
                <LoginForm searchParams={searchParams} />
            </div>
        </div>
    );
}
