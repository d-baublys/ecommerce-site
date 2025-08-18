"use client";

import { updateOrder } from "@/lib/actions";
import {
    ORDER_STATUS_OPTIONS,
    ORDER_TABLE_COLUMNS,
    OrderData,
    OrderStatus,
} from "@/lib/definitions";
import { processDateForClient, stringifyConvertPrice } from "@/lib/utils";
import { useModalStore } from "@/stores/modalStore";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import ConfirmModal from "@/ui/components/overlays/ConfirmModal";
import FailureModal from "@/ui/components/overlays/FailureModal";
import Modal from "@/ui/components/overlays/Modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";

export default function AdminOrdersClient({ ordersData }: { ordersData: OrderData[] }) {
    const columns = ORDER_TABLE_COLUMNS.map((columnData) => columnData.key);
    type TableColumns = (typeof columns)[number];
    type OrderOptions = "asc" | "desc";
    const [sortedData, setSortedData] = useState<OrderData[]>(ordersData);
    const [sortColumn, setSortColumn] = useState<TableColumns>("returnRequestedAt");
    const [sortOrder, setSortOrder] = useState<OrderOptions>("desc");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
    const [isFailureModalOpen, setIsFailureModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const { openModal } = useModalStore((state) => state);
    const router = useRouter();

    const issueRefund = async (orderId: OrderData["id"]) => {
        const res = await fetch("/api/refund", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderId,
            }),
        });

        const data = res.json();

        return data;
    };

    function compareValues<K extends TableColumns>(
        a: OrderData[K],
        b: OrderData[K],
        order: OrderOptions
    ): number {
        let result: number = 0;

        if (typeof a === "number" && typeof b === "number") {
            result = a - b;
        } else if (typeof a === "string" && typeof b === "string") {
            result = a.localeCompare(b);
        } else if (a instanceof Date && b instanceof Date) {
            result = a.getTime() - b.getTime();
        } else if (a instanceof Date) {
            result = a.getTime();
        } else if (b instanceof Date) {
            result = -b.getTime();
        }

        return order === "asc" ? result : -result;
    }

    const handleSortClick = (column: TableColumns) => {
        if (column !== sortColumn) {
            setSortOrder("desc");
        } else {
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
        }

        setSortColumn(column);
    };

    useEffect(() => {
        setSortedData(() => {
            const sorted = [...ordersData];
            sorted.sort((orderA, orderB) =>
                compareValues(orderA[sortColumn], orderB[sortColumn], sortOrder)
            );
            return sorted;
        });
    }, [sortOrder, sortColumn]);

    const handleApproval = async (orderId: OrderData["id"]) => {
        const returnConfirm = await openModal();

        if (returnConfirm) {
            const refund = await issueRefund(orderId);

            if (refund.success) {
                const orderUpdate = await updateOrder({
                    orderId,
                    status: "refunded",
                    refundedAt: new Date(),
                });

                if (orderUpdate.success) {
                    setModalMessage("Customer refund successful.");
                    setIsSuccessModalOpen(true);
                } else {
                    setModalMessage("Error updating order. Please try again later.");
                    setIsFailureModalOpen(true);
                }
            } else {
                setModalMessage("Error issuing refund. Please try again later.");
                setIsFailureModalOpen(true);
            }

            router.refresh();
        }
    };

    const processCellData = (
        cellData: string | number | Date | null,
        column: (typeof ORDER_TABLE_COLUMNS)[number]
    ) => {
        if (cellData instanceof Date) {
            return processDateForClient(cellData);
        } else if (column.key === "status") {
            return ORDER_STATUS_OPTIONS[cellData as OrderStatus];
        } else if (
            typeof cellData === "number" &&
            (column.key === "subTotal" || column.key === "shippingTotal" || column.key === "total")
        ) {
            return `£${stringifyConvertPrice(cellData)}`;
        } else {
            return cellData;
        }
    };

    return (
        <>
            <table className="w-full border-spacing-2">
                <thead>
                    <tr>
                        {ORDER_TABLE_COLUMNS.map((column, idx) => (
                            <th key={`col-${idx}`} className="border-2 p-4 bg-background-lightest">
                                <div className="flex justify-center items-center gap-1">
                                    <span>{column.label}</span>
                                    <button
                                        onClick={() => handleSortClick(column.key)}
                                        className="cursor-pointer"
                                    >
                                        <FaSort />
                                    </button>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="border-2">
                    {sortedData.map((order) => (
                        <tr key={order.id} className="border-2">
                            {ORDER_TABLE_COLUMNS.map((column, colIdx) => {
                                const cellData: string | number | null = processCellData(
                                    order[column.key],
                                    column
                                );

                                return (
                                    <td key={`${order.id}-${colIdx}`} className="border-2 p-2">
                                        {<p>{cellData}</p>}
                                        {column.key === "status" &&
                                            order.status === "pendingReturn" && (
                                                <div className="mt-4">
                                                    <PlainRoundedButton
                                                        onClick={() => handleApproval(order.id)}
                                                        overrideClasses="!bg-background-lightest px-2"
                                                    >
                                                        Approve Refund
                                                    </PlainRoundedButton>
                                                </div>
                                            )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
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
            <ConfirmModal promptText={"Are you sure you want to approve this refund?"} />
        </>
    );
}
