"use client";

import { Order } from "@/lib/definitions";
import OrderTile from "@/ui/components/cards/OrderTile";
import FailureModal from "@/ui/components/overlays/FailureModal";
import Modal from "@/ui/components/overlays/Modal";
import { useState } from "react";

export default function OrdersPageClient({ orderData }: { orderData: Order[] }) {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
    const [isFailureModalOpen, setIsFailureModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    return (
        <>
            <ul
                id="order-tile-container"
                data-testid="order-tile-ul"
                className="flex flex-col w-full lg:gap-8"
            >
                {orderData.map((order) => (
                    <li
                        key={`${order.id}`}
                        className="order-tile w-full mb-8 lg:mb-0"
                        data-testid="order-tile"
                    >
                        <OrderTile
                            orderData={order}
                            openSuccessModal={() => setIsSuccessModalOpen(true)}
                            openFailureModal={() => setIsFailureModalOpen(true)}
                            messageSetter={setModalMessage}
                        />
                    </li>
                ))}
            </ul>
            {isSuccessModalOpen && (
                <Modal
                    handleClose={() => setIsSuccessModalOpen(false)}
                    isOpenState={isSuccessModalOpen}
                    hasCloseButton={true}
                >
                    <div className="flex justify-center w-full items-center text-center">
                        <p>{modalMessage}</p>
                    </div>
                </Modal>
            )}
            {isFailureModalOpen && (
                <FailureModal
                    message={modalMessage}
                    handleClose={() => setIsFailureModalOpen(false)}
                    isOpenState={isFailureModalOpen}
                />
            )}
        </>
    );
}
