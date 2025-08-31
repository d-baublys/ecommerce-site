import { createFakeOrderList } from "@/lib/test-factories";
import { wrapWithErrorBoundary } from "@/lib/test-utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OrdersPage from "@/app/orders/page";
import { OrderData } from "@/lib/definitions";
import { act } from "react";

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

jest.mock("@/lib/actions", () => ({
    getUserOrders: jest.fn(),
    updateOrder: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
    usePathname: () => "/orders",
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
    }),
}));

jest.mock("@/lib/utils", () => ({
    ...jest.requireActual("@/lib/utils"),
    checkIsWithinReturnWindow: jest.fn(),
}));

import { getUserOrders, updateOrder } from "@/lib/actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { checkIsWithinReturnWindow } from "@/lib/utils";

const setUpExistingSession = () => {
    (auth as jest.Mock).mockResolvedValue({
        user: {
            id: "1",
            email: "test@email.com",
            role: "admin",
        },
    });
};
const setUpResolvedFetch = (resolvedValue: OrderData[]) => {
    (getUserOrders as jest.Mock).mockResolvedValue({ data: resolvedValue });
};
const setUpPageComplete = async () => {
    (checkIsWithinReturnWindow as jest.Mock).mockReturnValue(true);
    setUpExistingSession();
    setUpResolvedFetch(fakeOrdersList);
    await renderOrdersPage();
};

const fakeOrdersList = createFakeOrderList();
const renderOrdersPage = async () => await act(async () => render(await OrdersPage()));
const getAllTiles = () => screen.getAllByTestId("order-tile");

describe("OrdersPage", () => {
    it("redirects if not logged in", async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        try {
            await renderOrdersPage();
            expect(redirect).toHaveBeenCalledWith("/login?redirect_after=orders");
        } catch {}
    });

    it("throws error if logged in but missing user ID", async () => {
        (auth as jest.Mock).mockResolvedValue({
            user: {
                id: undefined,
                email: "test@email.com",
                role: "admin",
            },
        });

        try {
            render(wrapWithErrorBoundary(await OrdersPage()));
            expect(screen.getByText(/Error caught by boundary/)).toBeInTheDocument();
        } catch {}
    });

    it("shows correct number of items", async () => {
        await setUpPageComplete();

        await waitFor(() => {
            expect(getAllTiles().length).toBe(2);
        });
    });

    it("shows fallback text when user has no orders", async () => {
        setUpExistingSession();
        setUpResolvedFetch([]);
        renderOrdersPage();

        await waitFor(() => {
            expect(screen.getByText("You have no orders yet!")).toBeInTheDocument();
        });
    });

    it("opens confirmation prompt modal when 'request return' button is clicked", async () => {
        setUpPageComplete();

        await waitFor(() => {
            const buttons = screen.getAllByRole("button", { name: /Request Return/ });
            fireEvent.click(buttons[0]);

            expect(
                screen.getByText(/Are you sure you want to return this order\?/)
            ).toBeInTheDocument();
        });
    });

    it("opens success modal on successful order return request", async () => {
        (updateOrder as jest.Mock).mockResolvedValue({ success: true });
        setUpPageComplete();

        await waitFor(() => {
            const buttons = screen.getAllByRole("button", { name: /Request Return/ });
            fireEvent.click(buttons[0]);
        });

        act(() => {
            screen.getByRole("button", { name: "Confirm" }).click();
        });

        expect(await screen.findByText("Return request successful.")).toBeInTheDocument();
        expect(
            screen.queryByText(/Are you sure you want to return this order\?/)
        ).not.toBeInTheDocument();
    });

    it("opens failure modal on server error during return request", async () => {
        (updateOrder as jest.Mock).mockResolvedValue({ success: false });
        setUpPageComplete();

        await waitFor(() => {
            const buttons = screen.getAllByRole("button", { name: /Request Return/ });
            fireEvent.click(buttons[0]);
        });

        act(() => {
            screen.getByRole("button", { name: "Confirm" }).click();
        });

        expect(
            await screen.findByText("Error updating order. Please try again later.")
        ).toBeInTheDocument();
        expect(
            screen.queryByText(/Are you sure you want to return this order\?/)
        ).not.toBeInTheDocument();
    });
});
