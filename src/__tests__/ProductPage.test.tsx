import { createFakeProduct, getConsoleErrorSpy } from "@/lib/test-utils";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ProductPage from "@/app/products/[slug]/page";

const fakeProduct = createFakeProduct();
const getLatestBag = () => useBagStore.getState().bag;
const { clearBag } = useBagStore.getState();

jest.mock("@/lib/actions", () => ({
    getProductData: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    usePathname: () => `/products/${encodeURIComponent(fakeProduct.slug)}`,
    notFound: jest.fn(() => {
        throw new Error("notFound called");
    }),
}));

import { getProductData } from "@/lib/actions";
import { useBagStore } from "@/stores/bagStore";

const renderPage = async () => render(await ProductPage({ params: { slug: fakeProduct.slug } }));

describe("ProductPage", () => {
    beforeEach(() => {
        clearBag();
    });

    it("displays product information", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [fakeProduct] });
        await renderPage();

        expect(screen.getByTestId("product-detail-name")).toHaveTextContent(/Test Product 1/);
        expect(screen.getByText("£25.00")).toBeInTheDocument();
    });

    it("invokes notFound when provided slug returns no matching products", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [] });

        expect(renderPage()).rejects.toThrow("notFound called");
    });

    it("throws an error when fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (getProductData as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

        expect(renderPage()).rejects.toThrow("Fetch failed");

        errorSpy.mockRestore();
    });

    it("shows disabled product add button by default", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [fakeProduct] });
        await renderPage();

        const btn = screen.getByRole("button", { name: "Add to Bag" });
        expect(btn).toBeDisabled();
        expect(btn.firstChild).toHaveClass(
            "bg-component-color border-component-color hover:!scale-none hover:!cursor-auto active:!drop-shadow-none"
        );
    });

    it("shows enabled product add button after selecting a size", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [fakeProduct] });
        await renderPage();

        fireEvent.change(screen.getByLabelText("Size selection"), { target: { value: "s" } });

        const btn = screen.getByRole("button", { name: "Add to Bag" });
        expect(btn).not.toBeDisabled();
        expect(btn.firstChild).toHaveClass("bg-go-color border-go-color");
    });

    it("disables product add button when all remaining stock is added to bag", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [fakeProduct] });
        await renderPage();

        const btn = screen.getByRole("button", { name: "Add to Bag" });

        fireEvent.change(screen.getByLabelText("Size selection"), { target: { value: "m" } });

        expect(btn).not.toBeDisabled();
        expect(btn.firstChild).toHaveClass("bg-go-color border-go-color");

        act(() => {
            fireEvent.click(btn);
            fireEvent.click(btn);
            fireEvent.click(btn);
        });

        expect(btn).toBeDisabled();
        expect(btn.firstChild).toHaveClass(
            "bg-component-color border-component-color hover:!scale-none hover:!cursor-auto active:!drop-shadow-none"
        );
    });

    it("disables product add button when added quantity reaches the prescribed limit", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [fakeProduct] });
        await renderPage();

        const btn = screen.getByRole("button", { name: "Add to Bag" });
        const itemLimit = Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY);

        fireEvent.change(screen.getByLabelText("Size selection"), { target: { value: "s" } });

        act(() => {
            for (let i = 0; i < itemLimit; i++) {
                fireEvent.click(btn);
            }
        });

        expect(btn).toBeDisabled();
        expect(btn.firstChild).toHaveClass(
            "bg-component-color border-component-color hover:!scale-none hover:!cursor-auto active:!drop-shadow-none"
        );
        expect(getLatestBag()[0].quantity).toBe(itemLimit);
    });

    it("includes all required size options", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [fakeProduct] });
        await renderPage();

        Object.keys(fakeProduct.stock).forEach((size) => {
            expect(
                screen.getByRole("option", { name: new RegExp(`${size.toUpperCase()}`) })
            ).toBeInTheDocument();
        });
    });

    it("disables size option when all remaining stock is added to bag", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [fakeProduct] });
        await renderPage();

        const selectedOption = screen.getByRole("option", { name: "M" });
        const btn = screen.getByRole("button", { name: "Add to Bag" });

        expect(selectedOption).not.toBeDisabled();
        expect(selectedOption).toHaveTextContent(`M`);

        fireEvent.change(screen.getByLabelText("Size selection"), { target: { value: "m" } });

        act(() => {
            fireEvent.click(btn);
            fireEvent.click(btn);
            fireEvent.click(btn);
        });

        expect(selectedOption).toBeDisabled();
        expect(selectedOption).toHaveTextContent(`M - out of stock`);
        expect(getLatestBag()[0].quantity).toBe(3);
    });

    it("caps single item bag quantity per the prescribed limit", async () => {
        (getProductData as jest.Mock).mockResolvedValue({ data: [fakeProduct] });
        await renderPage();

        const btn = screen.getByRole("button", { name: "Add to Bag" });
        const itemLimit = Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY);

        fireEvent.change(screen.getByLabelText("Size selection"), { target: { value: "s" } });

        act(() => {
            for (let i = 0; i < itemLimit + 5; i++) {
                fireEvent.click(btn);
            }
        });

        expect(getLatestBag()[0].quantity).toBe(itemLimit);
    });
});
