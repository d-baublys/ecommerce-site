import { Product } from "@/lib/definitions";
import { createTestProductList } from "@/lib/test-utils";
import CategoryGridPage from "@/ui/pages/CategoryGridPage";
import { act, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/lib/fetching-utils", () => ({
    fetchFilteredProducts: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useSearchParams: () => {
        const params = new URLSearchParams();
        return {
            get: (key: string) => params.get(key),
        };
    },
    useRouter: () => ({
        replace: () => jest.fn(),
    }),
    usePathname: () => "/category/all",
}));

import { fetchFilteredProducts } from "@/lib/fetching-utils";

describe("CategoryGridPage", () => {
    const mockProductList = createTestProductList();
    const filteredMockList: Product[] = mockProductList.filter((product) =>
        Object.values(product.stock).some((stockCount) => stockCount > 0)
    ); // parent would not pass list containing fully unstocked products

    it("shows correct number of products", async () => {
        (fetchFilteredProducts as jest.Mock).mockResolvedValue(filteredMockList);

        render(<CategoryGridPage category="all" />);

        await waitFor(() => {
            expect(screen.getByAltText("Test product image 1")).toBeInTheDocument();
            expect(screen.getByAltText("Test product image 2")).toBeInTheDocument();
            expect(screen.getByAltText("Test product image 3")).toBeInTheDocument();
            expect(screen.queryByAltText("Test product image 4")).not.toBeInTheDocument();
        });
    });
});
