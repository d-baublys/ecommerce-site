import BagPage from "@/app/bag/page";
import {
    createFakeBagItems,
    createFakeProduct,
    getFakeUpdatedData,
    wrapWithErrorBoundary,
} from "@/lib/test-utils";
import { useBagStore } from "@/stores/bagStore";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

jest.mock("next/navigation", () => ({
    usePathname: () => "/bag",
}));

jest.mock("@/lib/actions", () => ({
    getProductData: jest.fn(),
}));

import { getProductData } from "@/lib/actions";
import { Product } from "@/lib/definitions";
import { createBagItem } from "@/lib/utils";

const { addToBag, clearBag } = useBagStore.getState();
const fakeBagItems = createFakeBagItems();
const bagUnchangedData = fakeBagItems.map((bagItem) => bagItem.product);
const bagUpdatedData = getFakeUpdatedData();

const renderBagPage = () => render(<BagPage />);
const setUpFakeBag = () =>
    fakeBagItems.forEach((item) => {
        addToBag(item);
    });
const setUpResolvedFetch = (resolvedValue: Product[]) => {
    (getProductData as jest.Mock).mockResolvedValue({ data: resolvedValue });
};
const getAllTiles = () => within(screen.getByTestId("bag-tile-ul")).getAllByRole("listitem");

describe("BagPage", () => {
    beforeEach(() => {
        clearBag();
    });

    it("shows correct bag subtotal", async () => {
        setUpFakeBag();
        setUpResolvedFetch(bagUnchangedData);
        renderBagPage();

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£253.00");
        });
    });

    it("shows fallback text when bag is empty", async () => {
        setUpResolvedFetch([]);
        renderBagPage();

        await waitFor(() => {
            expect(screen.getByText("Your bag is empty!")).toBeInTheDocument();
        });
    });

    it("throws an error when fetch fails", async () => {
        (getProductData as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
        render(wrapWithErrorBoundary(<BagPage />));

        await waitFor(() => {
            expect(screen.getByText(/Error caught by boundary/)).toBeInTheDocument();
        });
    });

    it("updates subtotal if latest size stock has decreased to below bag quantity", async () => {
        setUpFakeBag();
        setUpResolvedFetch(bagUpdatedData);
        renderBagPage();

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toHaveTextContent("£154.00");
        });
    });

    it("preselects correct quantities", async () => {
        setUpFakeBag();
        setUpResolvedFetch(bagUnchangedData);
        renderBagPage();

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("2");
        });
    });

    it("updates preselected quantities if latest size stock has decreased to below bag quantity", async () => {
        setUpFakeBag();
        setUpResolvedFetch(bagUpdatedData);
        renderBagPage();

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).getByRole("combobox")).toHaveValue("1");
            expect(within(bagTiles[1]).getByRole("combobox")).toHaveValue("1");
        });
    });

    it("shows 'out of stock' in place of combobox when latest size stock is nil", async () => {
        const fakeProduct = createFakeProduct({ overrides: { stock: { s: 1 } } });
        const latestFakeProduct = createFakeProduct({ overrides: { stock: { s: 0 } } });
        const mockBagItem = createBagItem(fakeProduct, "s");

        addToBag(mockBagItem);
        setUpResolvedFetch([latestFakeProduct]);
        renderBagPage();

        await waitFor(() => {
            const bagTiles = getAllTiles();

            expect(within(bagTiles[0]).queryByRole("combobox")).not.toBeInTheDocument();
            expect(bagTiles[0]).toHaveTextContent("Out of stock");
        });
    });

    it("shows all quantity options", async () => {
        const fakeProduct = createFakeProduct();

        addToBag(createBagItem(fakeProduct, "m"));
        setUpResolvedFetch([fakeProduct]);
        renderBagPage();

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
        const fakeProduct = createFakeProduct();

        addToBag(createBagItem(fakeProduct, "s"));
        addToBag(createBagItem(fakeProduct, "s"));
        setUpResolvedFetch([fakeProduct]);
        renderBagPage();

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
        const fakeProduct = createFakeProduct({ overrides: { stock: { s: itemLimit + 5 } } });

        addToBag(createBagItem(fakeProduct, "s"));
        setUpResolvedFetch([fakeProduct]);
        renderBagPage();

        await waitFor(() => {
            const bagTiles = getAllTiles();
            const options = within(bagTiles[0]).getAllByRole("option");

            expect(options.length).toBe(itemLimit);
        });
    });

    it("removes items from bag as expected", async () => {
        setUpFakeBag();
        setUpResolvedFetch(bagUnchangedData);
        renderBagPage();

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
        const fakeProduct = createFakeProduct({ overrides: { stock: { s: 0, m: 1 } } });

        addToBag(createBagItem(fakeProduct, "s"));
        addToBag(createBagItem(fakeProduct, "m"));
        setUpResolvedFetch([fakeProduct]);
        renderBagPage();

        expect(await screen.findByRole("button", { name: "Checkout" })).toBeInTheDocument();
        expect(screen.getByLabelText("Shipping cost")).not.toHaveTextContent("-");
    });

    it("doesn't render checkout button & shows correct shipping when all bag item sizes are unstocked", async () => {
        const fakeProduct = createFakeProduct({ overrides: { stock: { s: 0, m: 0 } } });

        addToBag(createBagItem(fakeProduct, "s"));
        addToBag(createBagItem(fakeProduct, "m"));
        setUpResolvedFetch([fakeProduct]);
        renderBagPage();

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toBeInTheDocument();
        });
        expect(screen.queryByRole("button", { name: "Checkout" })).not.toBeInTheDocument();
        expect(screen.getByLabelText("Shipping cost")).toHaveTextContent("-");
    });

    it("doesn't render checkout button & shows correct shipping when bag is empty", async () => {
        setUpResolvedFetch([]);
        renderBagPage();

        await waitFor(() => {
            expect(screen.getByLabelText("Bag subtotal")).toBeInTheDocument();
        });
        expect(screen.queryByRole("button", { name: "Checkout" })).not.toBeInTheDocument();
        expect(screen.getByLabelText("Shipping cost")).toHaveTextContent("-");
    });

    it("initiates Stripe checkout session correctly", async () => {
        const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
            json: async () => ({
                url: "https://stripe.com/checkout",
            }),
        } as Response);

        setUpFakeBag();
        setUpResolvedFetch(bagUnchangedData);
        renderBagPage();

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
