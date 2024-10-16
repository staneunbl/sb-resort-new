import RefgisterForm from "./RegisterForm";

export default function page({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    return (
        <div className="flex w-full items-center justify-center">
            <RefgisterForm searchParams={searchParams} />
        </div>
    );
}
