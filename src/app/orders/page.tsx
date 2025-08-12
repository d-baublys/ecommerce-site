import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/lib/actions";
import MainLayout from "@/ui/layouts/MainLayout";
import OrderTile from "@/ui/components/cards/OrderTile";
import { OrderData } from "@/lib/definitions";

export const metadata: Metadata = {
    title: "My Orders",
};

export default async function OrdersPage() {
    const session = await auth();

    if (session && session.user) {
        session.user = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
        };
    } else {
        redirect("/login?redirect_after=orders");
    }

    const ordersFetch = await getUserOrders({ userId: session.user.id });
    const orderData: OrderData[] = ordersFetch.data;

    return (
        <MainLayout subheaderText="My Orders">
            <div className="flex flex-col md:flex-row w-full h-full">
                {orderData.length ? (
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
                    <div className="flex justify-center items-center w-full h-full p-8 md:p-0">
                        <p>{"You have no orders yet"}</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
