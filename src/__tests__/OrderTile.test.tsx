import { createTestOrder } from "@/lib/test-factories";
import OrderTile from "@/ui/components/cards/OrderTile";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
    ...jest.requireActual("@/lib/utils"),
    checkIsWithinReturnWindow: jest.fn(),
}));

import { checkIsWithinReturnWindow } from "@/lib/utils";

const testPaidOrder = createTestOrder();
const testPendingOrder = createTestOrder({
    overrides: { status: "pendingReturn", returnRequestedAt: new Date("2025-08-02") },
});
const testRefundedOrder = createTestOrder({
    overrides: {
        status: "refunded",
        returnRequestedAt: new Date("2025-08-02"),
        refundedAt: new Date("2025-08-03"),
    },
});

const renderPaidOrderTile = () =>
    render(
        <OrderTile
            orderData={testPaidOrder}
            messageSetter={messageSetterMock}
            openSuccessModal={openSuccessModalMock}
            openFailureModal={openFailureModalMock}
        />
    );
const renderPendingOrderTile = () =>
    render(
        <OrderTile
            orderData={testPendingOrder}
            messageSetter={messageSetterMock}
            openSuccessModal={openSuccessModalMock}
            openFailureModal={openFailureModalMock}
        />
    );
const renderRefundedOrderTile = () =>
    render(
        <OrderTile
            orderData={testRefundedOrder}
            messageSetter={messageSetterMock}
            openSuccessModal={openSuccessModalMock}
            openFailureModal={openFailureModalMock}
        />
    );

const messageSetterMock = jest.fn();
const openSuccessModalMock = jest.fn();
const openFailureModalMock = jest.fn();

describe("OrderTile", () => {
    it("shows correct unconditional text", async () => {
        renderPaidOrderTile();

        await waitFor(() => {
            expect(screen.getByText(/Ordered Aug 1 2025/)).toBeInTheDocument();
            expect(screen.getByText(/£55.00/)).toBeInTheDocument();
            expect(screen.getByText(/Qty 2/)).toBeInTheDocument();
        });
    });

    it("shows correct text for a paid order within the return window", async () => {
        (checkIsWithinReturnWindow as jest.Mock).mockReturnValue(true);
        renderPaidOrderTile();

        await waitFor(() => {
            expect(screen.getByText(/Return window closes Aug 31 2025/)).toBeInTheDocument();
        });
    });

    it("shows correct text for a paid order outside the return window", async () => {
        (checkIsWithinReturnWindow as jest.Mock).mockReturnValue(false);
        renderPaidOrderTile();

        await waitFor(() => {
            expect(screen.getByText(/Return window closed Aug 31 2025/)).toBeInTheDocument();
        });
    });

    it("shows correct text for an order pending return", async () => {
        renderPendingOrderTile();

        await waitFor(() => {
            expect(screen.getByText(/Return requested Aug 2 2025/)).toBeInTheDocument();
        });
    });

    it("shows correct text for a refunded order", async () => {
        renderRefundedOrderTile();

        await waitFor(() => {
            expect(screen.getByText(/Refunded Aug 3 2025/)).toBeInTheDocument();
        });
    });

    it("renders a 'return request' button for paid orders within the return window", async () => {
        (checkIsWithinReturnWindow as jest.Mock).mockReturnValue(true);
        renderPaidOrderTile();

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Request Return/ })).toBeInTheDocument();
        });
    });
});
