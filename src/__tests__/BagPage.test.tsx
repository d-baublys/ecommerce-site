import BagPage from "@/app/bag/page";
import {
    buildReservedItem,
    buildTestBagItemList,
    buildTestProduct,
    getTestUpdatedData,
} from "@/lib/test-factories";
import { useBagStore } from "@/stores/bagStore";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { buildBagItem } from "@/lib/utils";
import { act } from "react";
import { SINGLE_ITEM_MAX_QUANTITY } from "@/lib/constants";
import {
    getConsoleErrorSpy,
    getFetchResolutionHelper,
    wrapWithErrorBoundary,
} from "@/lib/test-utils";

jest.mock("next/navigation", () => ({
    usePathname: () => "/bag",
    useRouter: () => ({
        push: jest.fn(),
    }),
    useSearchParams: () => {
        const params = new URLSearchParams("sort=c");
        return {
            get: (key: string) => params.get(key),
        };
    },
}));

jest.mock("@/lib/actions", () => ({
    getProducts: jest.fn(),
    deleteCheckoutSessions: jest.fn(),
    getReservedItems: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/auth", () => ({
    auth: jest.fn(),
}));

import { useSession } from "next-auth/react";
import { getProducts } from "@/lib/actions";

const { addToBag, clearBag } = useBagStore.getState();
const testBagData = buildTestBagItemList();
const testBagItems = testBagData.bagItems;
const testProducts = testBagData.products;
const bagUpdatedData = getTestUpdatedData();
const reservedItems = [buildReservedItem({ idx: 2 })];

const renderBagPage = async () => render(await BagPage());
const setUpTestBag = () =>
    testBagItems.forEach((item, idx) => {
        addToBag(testProducts[idx], item);
    });

const getSessionWithAuth = () => {
    (useSession as jest.Mock).mockReturnValue({
        data: {
            user: {
                id: "1",
                email: "test@email.com",
                role: "admin",
            },
        },
        status: "authenticated",
    });
};
const getSessionWithoutAuth = () => {
    (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: "unauthenticated",
    });
};

const setUpResolvedFetch = getFetchResolutionHelper(testProducts);

const getAllTiles = () => within(screen.getByTestId("bag-tile-ul")).getAllByRole("listitem");

describe("BagPage auth-agnostic tests", () => {
    beforeEach(() => {
        clearBag();
        getSessionWithoutAuth();
    });

    it("shows correct bag subtotal", async () => {
        setUpTestBag();
        setUpResolvedFetch();
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£253.00");
        });
    });

    it("shows fallback text when bag is empty", async () => {
        setUpResolvedFetch({ resolvedProducts: [] });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(screen.getByText("Your bag is empty!")).toBeInTheDocument();
        });
    });

    it("throws an error when fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (getProducts as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
        render(wrapWithErrorBoundary(await BagPage()));

        await waitFor(() => {
            expect(screen.getByText(/Error caught by boundary/)).toBeInTheDocument();
        });

        errorSpy.mockRestore();
    });

    it("updates subtotal if available stock has decreased to below bag quantity", async () => {
        setUpTestBag();
        setUpResolvedFetch({ resolvedProducts: bagUpdatedData });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£154.00");
        });
    });

    it("preselects correct quantities", async () => {
        setUpTestBag();
        setUpResolvedFetch();
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("2");
        });
    });

    it("updates quantity selections & shows info modal on page load if available stock has decreased to below bag quantity", async () => {
        setUpTestBag();
        setUpResolvedFetch({ resolvedProducts: bagUpdatedData });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(
                screen.getByText(/Available stock for some of your items has changed/)
            ).toBeInTheDocument();

            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("1");
        });
    });

    it("updates quantity selections & shows info modal on page load if there are relevant reserved items", async () => {
        setUpTestBag();
        setUpResolvedFetch({ resolvedReserved: reservedItems });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(
                screen.getByText(/Available stock for some of your items has changed/)
            ).toBeInTheDocument();

            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("1");
        });
    });

    it("shows 'out of stock' in place of combobox when available stock is nil", async () => {
        const testProduct = buildTestProduct({ overrides: { stock: { s: 1 } } });
        const latestTestProduct = buildTestProduct({ overrides: { stock: { s: 0 } } });
        const mockBagItem = buildBagItem(testProduct, "s");

        addToBag(testProduct, mockBagItem);
        setUpResolvedFetch({ resolvedProducts: [latestTestProduct] });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).queryByRole("combobox")).not.toBeInTheDocument();
            expect(bagTiles[0]).toHaveTextContent("Out of stock");
        });
    });

    it("shows all quantity options", async () => {
        const testProduct = buildTestProduct();

        addToBag(testProduct, buildBagItem(testProduct, "m"));
        setUpResolvedFetch({ resolvedProducts: [testProduct] });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();
            const options = within(bagTiles[0]).getAllByRole("option");

            expect(options.length).toBe(3);
            expect(options[0]).toHaveTextContent("1");
            expect(options[1]).toHaveTextContent("2");
            expect(options[2]).toHaveTextContent("3");
        });
    });

    it("updates subtotal when quantity selection changes", async () => {
        const testProduct = buildTestProduct();

        addToBag(testProduct, buildBagItem(testProduct, "s"));
        addToBag(testProduct, buildBagItem(testProduct, "s"));
        setUpResolvedFetch({ resolvedProducts: [testProduct] });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("2");
            expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£50.00");
        });

        const quantitySelect = screen.getByRole("combobox");
        fireEvent.change(quantitySelect, { target: { value: "1" } });

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£25.00");
        });
    });

    it("caps quantity options per the prescribed limit", async () => {
        const itemLimit = SINGLE_ITEM_MAX_QUANTITY;
        const testProduct = buildTestProduct({ overrides: { stock: { s: itemLimit + 5 } } });

        addToBag(testProduct, buildBagItem(testProduct, "s"));
        setUpResolvedFetch({ resolvedProducts: [testProduct] });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();
            const options = within(bagTiles[0]).getAllByRole("option");

            expect(options.length).toBe(itemLimit);
        });
    });

    it("removes items from bag as expected", async () => {
        setUpTestBag();
        setUpResolvedFetch();
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();
            expect(bagTiles.length).toBe(2);
        });

        const bagTiles = getAllTiles();
        const deleteButton = within(bagTiles[0]).getByLabelText("Remove from bag");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const bagTiles = getAllTiles();
            expect(bagTiles.length).toBe(1);
        });
    });

    it("doesn't render checkout button & shows correct amounts when some bag items are unstocked", async () => {
        const testProduct = buildTestProduct({ overrides: { stock: { s: 0, m: 1 } } });

        addToBag(testProduct, buildBagItem(testProduct, "s"));
        addToBag(testProduct, buildBagItem(testProduct, "m"));
        setUpResolvedFetch({ resolvedProducts: [testProduct] });
        act(() => {
            renderBagPage();
        });

        expect(await screen.findByRole("button", { name: "Checkout" })).not.toBeInTheDocument();
        expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£25.00");
        expect(screen.getByLabelText("Shipping cost")).toHaveTextContent("£5.00");
    });

    it("doesn't render checkout button & shows correct shipping when all bag items are unstocked", async () => {
        const testProduct = buildTestProduct({ overrides: { stock: { s: 0, m: 0 } } });

        addToBag(testProduct, buildBagItem(testProduct, "s"));
        addToBag(testProduct, buildBagItem(testProduct, "m"));
        setUpResolvedFetch({ resolvedProducts: [testProduct] });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toBeInTheDocument();
        });
        expect(screen.queryByRole("button", { name: "Checkout" })).not.toBeInTheDocument();
        expect(screen.getByLabelText("Shipping cost")).toHaveTextContent("-");
    });

    it("doesn't render checkout button & shows correct shipping when bag is empty", async () => {
        setUpResolvedFetch({ resolvedProducts: [] });
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toBeInTheDocument();
        });
        expect(screen.queryByRole("button", { name: "Checkout" })).not.toBeInTheDocument();
        expect(screen.getByLabelText("Shipping cost")).toHaveTextContent("-");
    });
});

describe("BagPage authenticated tests", () => {
    beforeEach(() => {
        clearBag();
        getSessionWithAuth();
    });

    it("initiates Stripe checkout session correctly when authenticated", async () => {
        const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
            json: async () => ({
                url: "https://stripe.com/checkout",
            }),
        } as Response);

        setUpTestBag();
        setUpResolvedFetch();
        act(() => {
            renderBagPage();
        });

        const checkoutBtn = await screen.findByRole("button", { name: "Checkout" });

        fireEvent.click(checkoutBtn);

        await waitFor(
            () => {
                expect(mockFetch).toHaveBeenCalledWith(
                    "/api/create-checkout-session",
                    expect.anything()
                );
            },
            { timeout: 2000 }
        );

        mockFetch.mockRestore();
    });

    it("updates quantity selections & shows info modal on checkout click if available stock has decreased to below bag quantity", async () => {
        setUpTestBag();
        setUpResolvedFetch();
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("2");
        });

        setUpResolvedFetch({ resolvedProducts: bagUpdatedData });

        fireEvent.click(screen.getByRole("button", { name: "Checkout" }));

        await waitFor(() => {
            expect(
                screen.getByText(/Available stock for some of your items has changed/)
            ).toBeInTheDocument();

            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("1");
        });
    });

    it("updates quantity selections & shows info modal on checkout click if there are relevant reserved items", async () => {
        setUpTestBag();
        setUpResolvedFetch();
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("2");
        });

        setUpResolvedFetch({ resolvedReserved: reservedItems });

        fireEvent.click(screen.getByRole("button", { name: "Checkout" }));

        await waitFor(() => {
            expect(
                screen.getByText(/Available stock for some of your items has changed/)
            ).toBeInTheDocument();

            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("1");
        });
    });
});
