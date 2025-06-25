import { render, screen, fireEvent } from "@testing-library/react";
import ProductTile from "@/ui/components/cards/ProductTile";
import { Product } from "@/lib/definitions";
import { createTestProduct } from "@/lib/test-utils";
import { act } from "react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const mockStockedProduct: Product = createTestProduct({ stock: { s: 3, m: 0, l: 8 } });
const mockUnstockedProduct: Product = createTestProduct({ stock: { s: 0 } });

const renderAndGetTile = (product: Product = mockStockedProduct) => {
    render(<ProductTile product={product} />);
    const tile = screen.getByText("Test Product 1").closest("div");
    if (!tile) throw new Error("No tile found");
    return tile;
};

describe("ProductTile", () => {
    it("renders product name and price", () => {
        renderAndGetTile();
        const container = screen.getByText("£").parentElement;

        expect(screen.getByText("Test Product 1")).toBeInTheDocument();
        expect(container).toHaveTextContent("£25.00");
    });

    it("shows quick add button & wishlist button on mouse hover", () => {
        const tile = renderAndGetTile();
        fireEvent.mouseEnter(tile);

        expect(screen.getByRole("button", { name: "Quick Add" })).toBeInTheDocument();
        expect(screen.getByLabelText("Add or remove from wishlist")).toBeInTheDocument();
    });

    it("shows quick add button & wishlist button on touch hold", () => {
        jest.useFakeTimers();

        const tile = renderAndGetTile();

        act(() => {
            fireEvent.touchStart(tile);
        });
        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(screen.getByRole("button", { name: "Quick Add" })).toBeInTheDocument();
        expect(screen.getByLabelText("Add or remove from wishlist")).toBeInTheDocument();

        jest.useRealTimers();
    });

    it("only shows buttons for extant size stock", () => {
        const tile = renderAndGetTile();
        fireEvent.mouseEnter(tile);

        const button = screen.getByRole("button", { name: "Quick Add" });
        fireEvent.click(button!);

        expect(screen.getByRole("button", { name: "S" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "L" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "M" })).not.toBeInTheDocument();
    });

    it("shows out of stock instead of quick add for unstocked products", () => {
        const tile = renderAndGetTile(mockUnstockedProduct);
        fireEvent.mouseEnter(tile);

        expect(screen.queryByRole("button", { name: "Quick Add" })).not.toBeInTheDocument();
        expect(screen.getByText("Out of stock")).toBeInTheDocument();
    });

    it("shows confirmation modal on quick add", () => {
        const tile = renderAndGetTile();
        fireEvent.mouseEnter(tile);

        const quickAdd = screen.getByRole("button", { name: "Quick Add" });
        fireEvent.click(quickAdd!);
        const sizeBtn = screen.getByRole("button", { name: "S" });
        fireEvent.click(sizeBtn);

        expect(screen.getByText("Item added to bag")).toBeInTheDocument();
    });

    it("has no accessiblity violations", async () => {
        const { container } = render(<ProductTile product={mockStockedProduct} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
