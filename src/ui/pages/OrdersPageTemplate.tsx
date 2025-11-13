import { ClientOrder } from "@/lib/types";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";
import OrdersPageClient from "@/app/orders/OrdersPageClient";
import ConstrainedLayout from "@/ui/layouts/ConstrainedLayout";
import LoadingIndicator from "../components/overlays/LoadingIndicator";

export default function OrdersPageTemplate({
    orderData,
    subheaderText,
}: {
    orderData?: ClientOrder[];
    subheaderText: string;
}) {
    return (
        <ConstrainedLayout subheaderText={subheaderText}>
            {orderData?.length ? (
                <OrdersPageClient orderData={orderData} />
            ) : (
                <div className="flex justify-center flex-col items-center w-full h-full p-8 md:p-0 gap-8">
                    {orderData ? (
                        <>
                            <p>{"You have no orders yet!"}</p>
                            <div>
                                <PlainRoundedButtonLink
                                    href={"/category/all"}
                                    overrideClasses="!bg-background-lightest"
                                >
                                    Shop
                                </PlainRoundedButtonLink>
                            </div>
                        </>
                    ) : (
                        <LoadingIndicator />
                    )}
                </div>
            )}
        </ConstrainedLayout>
    );
}
