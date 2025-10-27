import BagPage from "@/app/bag/page";
import { buildTestBagItemList, buildTestProduct, getTestUpdatedData } from "@/lib/test-factories";
import { useBagStore } from "@/stores/bagStore";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Product } from "@/lib/types";
import { buildBagItem } from "@/lib/utils";
import { act } from "react";

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
import { getConsoleErrorSpy, wrapWithErrorBoundary } from "@/lib/test-utils";

const { addToBag, clearBag } = useBagStore.getState();
const testBagItems = buildTestBagItemList();
const bagUnchangedData = testBagItems.map((bagItem) => bagItem.product);
const bagUpdatedData = getTestUpdatedData();

const renderBagPage = async () => render(await BagPage());
const setUpTestBag = () =>
    testBagItems.forEach((item) => {
        addToBag(item);
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

const setUpResolvedFetch = (resolvedValue: Product[]) => {
    (getProducts as jest.Mock).mockResolvedValue({ data: resolvedValue });
};
const getAllTiles = () => within(screen.getByTestId("bag-tile-ul")).getAllByRole("listitem");

describe("BagPage auth-agnostic tests", () => {
    beforeEach(() => {
        clearBag();
        getSessionWithoutAuth();
    });

    it("shows correct bag subtotal", async () => {
        setUpTestBag();
        setUpResolvedFetch(bagUnchangedData);
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£253.00");
        });
    });

    it("shows fallback text when bag is empty", async () => {
        setUpResolvedFetch([]);
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

    it("updates subtotal if latest size stock has decreased to below bag quantity", async () => {
        setUpTestBag();
        setUpResolvedFetch(bagUpdatedData);
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£154.00");
        });
    });

    it("preselects correct quantities", async () => {
        setUpTestBag();
        setUpResolvedFetch(bagUnchangedData);
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("2");
        });
    });

    it("updates preselected quantities if latest size stock has decreased to below bag quantity", async () => {
        setUpTestBag();
        setUpResolvedFetch(bagUpdatedData);
        act(() => {
            renderBagPage();
        });

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("1");
        });
    });

    it("shows 'out of stock' in place of combobox when latest size stock is nil", async () => {
        const testProduct = buildTestProduct({ overrides: { stock: { s: 1 } } });
        const latestTestProduct = buildTestProduct({ overrides: { stock: { s: 0 } } });
        const mockBagItem = buildBagItem(testProduct, "s");

        addToBag(mockBagItem);
        setUpResolvedFetch([latestTestProduct]);
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

        addToBag(buildBagItem(testProduct, "m"));
        setUpResolvedFetch([testProduct]);
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

        addToBag(buildBagItem(testProduct, "s"));
        addToBag(buildBagItem(testProduct, "s"));
        setUpResolvedFetch([testProduct]);
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
        const itemLimit = Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY);
        const testProduct = buildTestProduct({ overrides: { stock: { s: itemLimit + 5 } } });

        addToBag(buildBagItem(testProduct, "s"));
        setUpResolvedFetch([testProduct]);
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
        setUpResolvedFetch(bagUnchangedData);
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

    it("renders checkout button & shows correct shipping when at least some bag item sizes are stocked", async () => {
        const testProduct = buildTestProduct({ overrides: { stock: { s: 0, m: 1 } } });

        addToBag(buildBagItem(testProduct, "s"));
        addToBag(buildBagItem(testProduct, "m"));
        setUpResolvedFetch([testProduct]);
        act(() => {
            renderBagPage();
        });

        expect(await screen.findByRole("button", { name: "Checkout" })).toBeInTheDocument();
        expect(screen.getByLabelText("Shipping cost")).not.toHaveTextContent("-");
    });

    it("doesn't render checkout button & shows correct shipping when all bag item sizes are unstocked", async () => {
        const testProduct = buildTestProduct({ overrides: { stock: { s: 0, m: 0 } } });

        addToBag(buildBagItem(testProduct, "s"));
        addToBag(buildBagItem(testProduct, "m"));
        setUpResolvedFetch([testProduct]);
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
        setUpResolvedFetch([]);
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
        setUpResolvedFetch(bagUnchangedData);
        act(() => {
            renderBagPage();
        });

        const checkoutBtn = await screen.findByRole("button", { name: "Checkout" });

        fireEvent.click(checkoutBtn);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                "/api/create-checkout-session",
                expect.anything()
            );
        });

        mockFetch.mockRestore();
    });
});
