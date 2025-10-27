"use client";

import { updateOrder } from "@/lib/actions";
import { ORDER_STATUS_OPTIONS, ORDER_TABLE_COLUMNS } from "@/lib/constants";
import { Order, TableSortOptions, TableColumns } from "@/lib/types";
import { processDateForClient, stringifyConvertPrice } from "@/lib/utils";
import { useModalStore } from "@/stores/modalStore";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import RoundedTable from "@/ui/components/forms/RoundedTable";
import TableBodyCell from "@/ui/components/forms/TableBodyCell";
import TableHeadCell from "@/ui/components/forms/TableHeadCell";
import ConfirmModal from "@/ui/components/overlays/ConfirmModal";
import FailureModal from "@/ui/components/overlays/FailureModal";
import Modal from "@/ui/components/overlays/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";

export default function AdminOrdersClient({ ordersData }: { ordersData: Order[] }) {
    const [sortedData, setSortedData] = useState<Order[]>(ordersData);
    const [sortColumn, setSortColumn] = useState<TableColumns>("returnRequestedAt");
    const [sortOrder, setSortOrder] = useState<TableSortOptions>("desc");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
    const [isFailureModalOpen, setIsFailureModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const { openModal } = useModalStore((state) => state);
    const router = useRouter();

    const requestRefund = async (orderId: Order["id"]) => {
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
        a: Order[K],
        b: Order[K],
        order: TableSortOptions
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

    const handleApproval = async (orderId: Order["id"]) => {
        const returnConfirm = await openModal();

        if (returnConfirm) {
            const refund = await requestRefund(orderId);

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
        inputData: string | number | Date | null,
        column: (typeof ORDER_TABLE_COLUMNS)[number]
    ) => {
        if (inputData instanceof Date) {
            return processDateForClient(inputData);
        } else if (column.id === "status") {
            return ORDER_STATUS_OPTIONS.find((s) => s.id === inputData)!.label;
        } else if (
            typeof inputData === "number" &&
            (column.id === "subTotal" || column.id === "shippingTotal" || column.id === "total")
        ) {
            return `£${stringifyConvertPrice(inputData)}`;
        } else {
            return inputData;
        }
    };

    const buildHeadCells = () =>
        ORDER_TABLE_COLUMNS.map((column, colIdx) => (
            <TableHeadCell
                key={column.id}
                variant={
                    colIdx === 0
                        ? "leftEnd"
                        : colIdx === ORDER_TABLE_COLUMNS.length - 1
                        ? "rightEnd"
                        : "middle"
                }
                overrideClasses="p-4"
            >
                <div className="flex justify-center items-center gap-1">
                    <span>{column.label}</span>
                    <button
                        aria-label={`Sort by ${column.label.toLocaleLowerCase()}`}
                        title={`Sort by ${column.label.toLocaleLowerCase()}`}
                        onClick={() => handleSortClick(column.id)}
                        className="cursor-pointer"
                    >
                        <FaSort />
                    </button>
                </div>
            </TableHeadCell>
        ));

    const buildBodyCells = () =>
        sortedData.map((order, rowIdx) => (
            <tr key={`order-${order.id}`}>
                {ORDER_TABLE_COLUMNS.map((column, colIdx) => {
                    const cellData: string | number | Date | null = processCellData(
                        order[column.id],
                        column
                    );
                    return (
                        <TableBodyCell
                            key={`${order.id}-${column.id}`}
                            variant={
                                colIdx === 0
                                    ? "leftEnd"
                                    : colIdx === ORDER_TABLE_COLUMNS.length - 1
                                    ? "rightEnd"
                                    : "middle"
                            }
                            isLastRow={rowIdx === sortedData.length - 1}
                            overrideClasses="p-2"
                        >
                            {column.id === "id" ? (
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="font-semibold underline decoration-1"
                                >
                                    {cellData}
                                </Link>
                            ) : (
                                <p>{cellData}</p>
                            )}
                            {column.id === "status" && order.status === "pendingReturn" && (
                                <div className="mt-4">
                                    <PlainRoundedButton
                                        onClick={() => handleApproval(order.id)}
                                        overrideClasses="!bg-background-lightest px-2"
                                    >
                                        Approve Refund
                                    </PlainRoundedButton>
                                </div>
                            )}
                        </TableBodyCell>
                    );
                })}
            </tr>
        ));

    return (
        <>
            <div className="flex justify-center items-center grow w-full">
                {ordersData.length ? (
                    <div className="overflow-x-scroll max-w-[85vw]">
                        <RoundedTable
                            id="orders-table"
                            tableHeadCells={buildHeadCells()}
                            tableBodyCells={buildBodyCells()}
                            overrideClasses="p-2"
                        />
                    </div>
                ) : (
                    <p>No orders to show</p>
                )}
            </div>
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
