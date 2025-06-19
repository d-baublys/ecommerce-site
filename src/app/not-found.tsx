import RoundedButton from "@/ui/components/RoundedButton";
import Link from "next/link";
import BareLayout from "@/ui/layouts/BareLayout";

export default function NotFound() {
    return (
        <BareLayout>
            <p>{"Oops! It seems the page you're looking for doesn't exist."}</p>
            <Link href={"/"}>
                <RoundedButton>Home</RoundedButton>
            </Link>
        </BareLayout>
    );
}
