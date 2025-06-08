import RoundedButton from "@/ui/components/RoundedButton";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center text-center gap-8">
            <p>{"Oops! Looks like the page you're looking for doesn't exist."}</p>
            <Link href={"/"}>
                <RoundedButton>Home</RoundedButton>
            </Link>
        </div>
    );
}
