import GeneralButton from "@/ui/components/GeneralButton";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center text-center gap-8">
            {"Oops! Looks like the page you're looking for doesn't exist."}
            <Link href={"/"}>
                <GeneralButton>Home</GeneralButton>
            </Link>
        </div>
    );
}
