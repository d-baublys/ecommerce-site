import { getFilteredTestProducts } from "@/lib/test-factories";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import SearchOverlay from "@/ui/components/overlays/SearchOverlay";
import { useSearchStore } from "@/stores/searchStore";

expect.extend(toHaveNoViolations);

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
    usePathname: () => "/",
}));

jest.mock("@/lib/fetching-utils", () => ({
    getFilteredProducts: jest.fn(),
}));

jest.mock("@/lib/actions", () => ({
    getProducts: jest.fn(),
}));

import { getFilteredProducts } from "@/lib/fetching-utils";

const productList = getFilteredTestProducts();

const renderSearchOverlay = () => render(<SearchOverlay />);

const getInput = () => screen.getByRole("searchbox");
const getSuggestionsContainer = () => screen.getByTestId("suggestions-ul");
const mockResolvedFetch = () => {
    (getFilteredProducts as jest.Mock).mockResolvedValue(productList);
};
const fireInputAndWait = async (queryText: string) => {
    await act(async () => {
        getInput().focus();
        fireEvent.change(getInput(), { target: { value: queryText } });

        await new Promise((res) => setTimeout(res, 300));
    });
};

const prepStandard = async () => {
    mockResolvedFetch();
    renderSearchOverlay();

    act(() => {
        useSearchStore.setState({
            isSearchLoaded: true,
            isSearchOpen: true,
        });
    });

    await waitFor(() => {
        expect(getInput()).not.toBeDisabled();
    });
};

describe("SearchOverlay", () => {
    it("navigates to search results page on submit button click", async () => {
        await prepStandard();
        await fireInputAndWait("Test");

        fireEvent.click(screen.getByLabelText("Submit search"));

        expect(pushMock).toHaveBeenCalledWith("/results?q=Test");
    });

    it("navigates to search results page on Enter button press", async () => {
        await prepStandard();
        await fireInputAndWait("Test");

        fireEvent.submit(screen.getByRole("search"));

        expect(pushMock).toHaveBeenCalledWith("/results?q=Test");
    });

    it("navigates to product page on suggestion click", async () => {
        await prepStandard();
        await fireInputAndWait("Test");

        const firstSuggestion = within(getSuggestionsContainer()).getAllByRole("listitem")[0];
        fireEvent.click(firstSuggestion);

        expect(pushMock).toHaveBeenCalledWith(
            "/products/aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaa1/test-product-1"
        );
    });

    it("has no accessibility violations", async () => {
        await prepStandard();
        const container = screen.getByTestId("search-overlay-container");

        await waitFor(async () => {
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
