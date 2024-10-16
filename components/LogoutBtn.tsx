import { Logout } from "@/app/ServerAction/auth.action";

export default function LogoutBtn({ className }: { className?: string }) {
    return (
        <form className={className} action={Logout}>
            <button type="submit">Log-Out</button>
        </form>
    );
}
