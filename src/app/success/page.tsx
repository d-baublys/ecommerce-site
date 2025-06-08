import stripe from "@/lib/stripe";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IoCheckmarkCircle } from "react-icons/io5";
import { SuccessBagClearClient } from "./SuccessBagClearClient";
import RoundedButton from "@/ui/components/RoundedButton";

export default async function Page({ searchParams }: { searchParams: { session_id?: string } }) {
    const session_id = await searchParams.session_id;

    if (!session_id) notFound();

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") notFound();

    return (
        <>
            <SuccessBagClearClient />
            <div className="flex flex-col justify-center items-center gap-8">
                <div className="flex flex-col justify-between w-full sm:w-1/2 min-w-[300px] sm:min-w-[500px] border-2 p-2 gap-4">
                    <div className="flex items-center gap-3">
                        <IoCheckmarkCircle className="shrink-0 text-go-color" size={30} />
                        <span className="text-sz-subheading lg:text-sz-subheading-lg">
                            Thank you for your purchase!
                        </span>
                    </div>
                    <div>
                        <p>
                            You will receive an order confirmation by email shortly. If not, please
                            check your spam folder.
                        </p>
                    </div>
                </div>
                <Link href={"/"}>
                    <RoundedButton>Home</RoundedButton>
                </Link>
            </div>
        </>
    );
}
