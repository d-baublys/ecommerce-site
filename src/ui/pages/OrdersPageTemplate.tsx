import { ClientOrder } from "@/lib/types";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";
import OrdersPageClient from "@/app/orders/OrdersPageClient";
import ConstrainedLayout from "@/ui/layouts/ConstrainedLayout";

export default function OrdersPageTemplate({
    orderData,
    subheaderText,
}: {
    orderData: ClientOrder[];
    subheaderText: string;
}) {
    return (
        <ConstrainedLayout subheaderText={subheaderText}>
            {orderData?.length ? (
                <OrdersPageClient orderData={orderData} />
            ) : (
                <div className="flex justify-center flex-col items-center w-full h-full p-8 md:p-0 gap-8">
                    <p>{"You have no orders yet!"}</p>
                    <div>
                        <PlainRoundedButtonLink
                            href={"/category/all"}
                            overrideClasses="!bg-background-lightest"
                        >
                            Shop
                        </PlainRoundedButtonLink>
                    </div>
                </div>
            )}
        </ConstrainedLayout>
    );
}
