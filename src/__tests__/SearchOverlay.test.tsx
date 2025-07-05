import { getFilteredFakeProducts } from "@/lib/test-utils";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
    usePathname: () => "/",
}));

jest.mock("@/lib/fetching-utils", () => ({
    fetchFilteredProducts: jest.fn(),
}));

import { fetchFilteredProducts } from "@/lib/fetching-utils";
import SearchOverlay from "@/ui/components/overlays/SearchOverlay";
import { useSearchStore } from "@/stores/searchStore";

const productList = getFilteredFakeProducts();

const renderSearchOverlay = () => render(<SearchOverlay />);

const getInput = () => screen.getByRole("textbox");
const getSuggestionsContainer = () => screen.getByTestId("suggestions-ul");
const mockResolvedFetch = () => {
    (fetchFilteredProducts as jest.Mock).mockResolvedValue(productList);
};
const fireInputAndWait = async (queryText: string) => {
    await act(async () => {
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

        expect(pushMock).toHaveBeenCalledWith("/products/test-product-1");
    });
});
