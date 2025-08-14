import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/lib/actions";
import MainLayout from "@/ui/layouts/MainLayout";
import OrderTile from "@/ui/components/cards/OrderTile";
import { OrderData } from "@/lib/definitions";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";
import ReturnConfirmModal from "@/ui/components/overlays/ReturnConfirmModal";

export const metadata: Metadata = {
    title: "My Orders",
};

export default async function OrdersPage() {
    const session = await auth();

    if (!(session && session.user)) {
        redirect("/login?redirect_after=orders");
    }

    if (session.user.id === undefined) throw new Error("User ID not found");

    const ordersFetch = await getUserOrders({ userId: Number(session.user.id) });
    const orderData: OrderData[] = ordersFetch.data;

    return (
        <>
            <MainLayout subheaderText="My Orders">
                <div className="flex grow justify-center items-start">
                    <div className="flex flex-col md:flex-row w-full max-w-[900px] h-full">
                        {orderData?.length ? (
                            <ul
                                id="order-tile-container"
                                data-testid="order-tile-ul"
                                className="flex flex-col w-full lg:gap-8"
                            >
                                {orderData.map((order) => (
                                    <li key={`${order.id}`} className="w-full mb-8 lg:mb-0">
                                        <OrderTile orderData={order} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex justify-center flex-col items-center w-full h-full p-8 md:p-0 gap-8">
                                <p>{"You have no orders yet!"}</p>
                                <div>
                                    <PlainRoundedButtonLink href={"/category/all"}>
                                        Shop
                                    </PlainRoundedButtonLink>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </MainLayout>
            <ReturnConfirmModal />
        </>
    );
}
