"use client";

import {
    addReturnWindowDelta,
    checkIsWithinReturnWindow,
    processDateForClientDate,
    stringifyConvertPrice,
} from "@/lib/utils";
import ProductListTile from "@/ui/components/cards/ProductListTile";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import { useModalStore } from "@/stores/modalStore";
import { updateOrder } from "@/lib/actions";
import { SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { ClientOrder, Order } from "@/lib/types";

interface OrderTileProps {
    orderData: ClientOrder;
    messageSetter: React.Dispatch<SetStateAction<string>>;
    openSuccessModal: () => void;
    openFailureModal: () => void;
}

export default function OrderTile(props: OrderTileProps) {
    const { orderData, openSuccessModal, openFailureModal, messageSetter } = props;
    const { openModal } = useModalStore((state) => state);
    const router = useRouter();

    const isOrderWithinReturnWindow = checkIsWithinReturnWindow(orderData.createdAt);
    const orderStatus = orderData.status;
    let orderInfo: string;

    switch (orderStatus) {
        case "paid":
            orderInfo = `Return window ${
                isOrderWithinReturnWindow ? "closes" : "closed"
            } ${processDateForClientDate(addReturnWindowDelta(orderData.createdAt))}`;
            break;

        case "pendingReturn":
            orderInfo = `Return requested ${processDateForClientDate(
                orderData.returnRequestedAt!
            )}`;
            break;
        case "refunded":
            orderInfo = `Refunded ${processDateForClientDate(orderData.refundedAt!)}`;
            break;
    }

    const handleReturnRequest = async (orderId: Order["id"]) => {
        const returnConfirm = await openModal();

        if (returnConfirm) {
            try {
                const response = await updateOrder({
                    id: orderId,
                    status: "pendingReturn",
                    returnRequestedAt: new Date(),
                });

                if (response.success) {
                    messageSetter("Return request successful.");
                    openSuccessModal();
                } else {
                    messageSetter("Error updating order. Please try again later.");
                    openFailureModal();
                }
            } catch (error) {
                messageSetter("Error updating order. Please try again later.");
                openFailureModal();
                console.error(error);
            } finally {
                router.refresh();
            }
        }
    };

    const buildEndContent = (idx: number) => (
        <div className="flex flex-col justify-between items-end h-full">
            <p className="text-sz-interm lg:text-sz-interm-lg">
                <span>£</span>
                <span>
                    {stringifyConvertPrice(
                        orderData.items[idx].price * orderData.items[idx].quantity
                    )}
                </span>
            </p>
            <div className="flex items-center gap-2 pr-2">
                <p>{`Qty ${orderData.items[idx].quantity}`}</p>
            </div>
        </div>
    );

    return (
        <div>
            <div className="grid grid-cols-12 min-w-[35rem] p-2 bg-background-lightest rounded-tl-lg rounded-tr-lg">
                <div className="flex items-center col-span-6">
                    <p className="font-semibold">{`Order #${orderData.id}`}</p>
                </div>
                <div className="flex justify-end items-center col-span-6">
                    <p className="font-semibold">{`Total £${stringifyConvertPrice(
                        orderData.total
                    )}`}</p>
                </div>
                <div className="flex items-center col-span-6 h-min">
                    <p>{`Ordered ${processDateForClientDate(orderData.createdAt)}`}</p>
                </div>
                <div className="flex flex-col items-end col-span-6">
                    <p className="whitespace-nowrap">{orderInfo}</p>
                    {orderStatus === "paid" && isOrderWithinReturnWindow && (
                        <div className="mt-2">
                            <PlainRoundedButton
                                onClick={() => handleReturnRequest(orderData.id)}
                                overrideClasses="!px-2"
                            >
                                Request Return
                            </PlainRoundedButton>
                        </div>
                    )}
                </div>
            </div>
            <ProductListTile
                inputData={orderData}
                wrapWithLink={true}
                showSize={true}
                endContent={(idx) => buildEndContent(idx)}
                internalOverrides="!h-40"
            />
        </div>
    );
}
