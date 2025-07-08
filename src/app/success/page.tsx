import stripe from "@/lib/stripe";
import { notFound } from "next/navigation";
import { IoCheckmarkCircle } from "react-icons/io5";
import { SuccessBagClearClient } from "./SuccessBagClearClient";
import BareLayout from "@/ui/layouts/BareLayout";
import { getOrder } from "@/lib/actions";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";

export default async function Page({ searchParams }: { searchParams: { session_id?: string } }) {
    const params = await searchParams;
    const session_id = params.session_id;

    if (!session_id) notFound();

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") notFound();

    const savedOrder = await getOrder({ sessionId: session.id });
    const orderNumber = savedOrder.data?.id;

    return (
        <BareLayout>
            <SuccessBagClearClient />
            <div className="flex flex-col grow justify-center items-center h-full gap-8">
                <div className="flex flex-col justify-between w-full gap-4">
                    <div className="flex flex-col justify-center items-center gap-3 text-sz-subheading lg:text-sz-subheading-lg">
                        <IoCheckmarkCircle className="shrink-0 text-go-color" size={36} />
                        <span className="">Thank you for your purchase!</span>
                        <div>
                            <p>
                                <span>Your order number is: </span>
                                <span className="font-semibold">{orderNumber}</span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <p>
                            You will receive an order confirmation by email shortly. If not, please
                            check your spam folder.
                        </p>
                    </div>
                </div>
                <div>
                    <PlainRoundedButtonLink href={"/"}>Home</PlainRoundedButtonLink>
                </div>
            </div>
        </BareLayout>
    );
}
