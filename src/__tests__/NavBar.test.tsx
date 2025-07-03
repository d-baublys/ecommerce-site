import { Sizes } from "@/lib/definitions";
import { createFakeProductList } from "@/lib/test-utils";
import { useBagStore } from "@/stores/bagStore";
import NavBarClient from "@/ui/components/NavBarClient";
import { screen } from "@testing-library/dom";
import { act, render } from "@testing-library/react";

jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
}));

import { useSession } from "next-auth/react";

const { addToBag, clearBag } = useBagStore.getState();
const fakeProductList = createFakeProductList();
const renderNavBar = () => render(<NavBarClient />);

const getSessionWithAuth = () => {
    (useSession as jest.Mock).mockReturnValue({
        data: {
            user: "test-user",
            email: "test@email.com",
        },
    });
};
const getSessionWithoutAuth = () => {
    (useSession as jest.Mock).mockReturnValue(null);
};

describe("NavBar", () => {
    beforeEach(() => {
        clearBag();
    });

    it("shows correct total bag item count", async () => {
        getSessionWithAuth();
        renderNavBar();

        act(() => {
            addToBag({
                product: fakeProductList[0],
                size: Object.keys(fakeProductList[0])[0] as Sizes,
                quantity: 1,
            });
            addToBag({
                product: fakeProductList[1],
                size: Object.keys(fakeProductList[1])[0] as Sizes,
                quantity: 1,
            });
            addToBag({
                product: fakeProductList[2],
                size: Object.keys(fakeProductList[2])[0] as Sizes,
                quantity: 1,
            });

            addToBag({
                product: fakeProductList[2],
                size: Object.keys(fakeProductList[2])[0] as Sizes,
                quantity: 1,
            });
        });

        expect(screen.getByLabelText("Bag item count")).toHaveTextContent("4");
    });

    it("doesn't show admin button by default", async () => {
        getSessionWithoutAuth();
        renderNavBar();

        expect(screen.queryByLabelText("Admin")).not.toBeInTheDocument();
    });

    it("shows admin button when authenticated", async () => {
        getSessionWithAuth();
        renderNavBar();

        expect(screen.getByLabelText("Admin")).toBeInTheDocument();
    });
});
