import { createFakeProductList } from "@/lib/test-utils";
import SearchBar from "@/ui/components/SearchBar";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Product } from "@/lib/definitions";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock("@/lib/actions", () => ({
    getProductData: jest.fn(),
}));

import { getProductData } from "@/lib/actions";

const productList = { data: createFakeProductList() };

const mockResultClick = jest.fn();

const renderLocalSearch = () =>
    render(
        <SearchBar
            options={{ isGlobalSearch: false, showSuggestions: true }}
            handleResultClick={mockResultClick}
        />
    );

const mockResolvedFetch = () => {
    (getProductData as jest.Mock).mockResolvedValue(productList);
};

const mockFailedFetch = () => {
    (getProductData as jest.Mock).mockResolvedValue(undefined);
};

const getInput = () => screen.getByRole("searchbox");
const getSuggestionsContainer = () => screen.getByTestId("suggestions-ul");
const getSuggestions = () => within(getSuggestionsContainer()).getAllByRole("listitem");

const fireInputAndWait = async (queryText: string) => {
    await act(async () => {
        getInput().focus();
        fireEvent.change(getInput(), { target: { value: queryText } });

        await new Promise((res) => setTimeout(res, 300));
    });
};
const prepStandard = async () => {
    mockResolvedFetch();
    renderLocalSearch();

    await waitFor(() => {
        expect(getInput()).not.toBeDisabled();
    });
};

describe("SearchBar", () => {
    it("displays the expected number of suggestions", async () => {
        await prepStandard();
        await fireInputAndWait("Test");

        expect(within(getSuggestionsContainer()).getAllByRole("listitem").length).toBe(4);
    });

    it("displays fallback when there are no suggestions", async () => {
        await prepStandard();
        await fireInputAndWait("Testt");

        expect(getSuggestions().length).toBe(1);
        expect(within(getSuggestionsContainer()).getByText("No results found")).toBeInTheDocument();
    });

    it("behaves correctly with a passed handleResultClick function", async () => {
        const testList: Product[] = [];
        (mockResultClick as jest.Mock).mockImplementation((product) => {
            testList.push(product);
        });
        await prepStandard();
        await fireInputAndWait("Test");

        fireEvent.click(getSuggestions()[0]);

        await fireInputAndWait("Test");

        await waitFor(() => {
            expect(getSuggestionsContainer()).toBeInTheDocument();
        });

        fireEvent.click(getSuggestions()[1]);

        expect(testList.length).toBe(2);
    });

    it("keeps input disabled if data fetch fails", async () => {
        mockFailedFetch();
        renderLocalSearch();

        await waitFor(() => {
            expect(getInput()).toBeInTheDocument();
        });
        expect(getInput()).toBeDisabled();
    });
});
