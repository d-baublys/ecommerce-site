"use client";

import {
    addReturnWindowDelta,
    checkIsWithinReturnWindow,
    processDateForClientDate,
    stringifyConvertPrice,
} from "@/lib/utils";
import ProductListTile from "@/ui/components/cards/ProductListTile";
import { OrderData } from "@/lib/definitions";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import { useModalStore } from "@/stores/modalStore";
import { updateOrder } from "@/lib/actions";
import { SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface OrderTileProps {
    orderData: OrderData;
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

    const handleConfirm = async (orderId: OrderData["id"]) => {
        const returnConfirm = await openModal();

        if (returnConfirm) {
            try {
                const response = await updateOrder({
                    orderId,
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

    const buildEndContent = () => (
        <div className="flex h-full">
            <div>
                <p>{orderInfo}</p>
                {orderStatus === "paid" && isOrderWithinReturnWindow && (
                    <div className="mt-4">
                        <PlainRoundedButton
                            onClick={() => handleConfirm(orderData.id)}
                            overrideClasses="!bg-background-lightest !px-2"
                        >
                            Request Return
                        </PlainRoundedButton>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between p-2 border-2 border-b-0 gap-4">
                <p>{`Ordered ${processDateForClientDate(orderData.createdAt)}`}</p>
                <p>{`Total £${stringifyConvertPrice(orderData.total)}`}</p>
                <p>{`Order # ${orderData.id}`}</p>
            </div>
            <ProductListTile
                data={orderData}
                wrapWithLink={true}
                showSize={true}
                endContent={buildEndContent()}
                internalOverrides="!min-h-40"
            />
        </div>
    );
}
