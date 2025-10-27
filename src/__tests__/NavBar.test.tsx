import { Sizes } from "@/lib/types";
import { buildTestProductList } from "@/lib/test-factories";
import { useBagStore } from "@/stores/bagStore";
import NavBar from "@/ui/components/NavBar";
import { screen, waitFor } from "@testing-library/dom";
import { act, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
    usePathname: () => "/",
}));

import { useSession } from "next-auth/react";

const { addToBag, clearBag } = useBagStore.getState();
const testProductList = buildTestProductList();
const renderNavBar = () => render(<NavBar />);

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

describe("NavBar", () => {
    beforeEach(() => {
        clearBag();
    });

    it("shows correct total bag item count", async () => {
        getSessionWithAuth();
        renderNavBar();

        act(() => {
            addToBag({
                product: testProductList[0],
                size: Object.keys(testProductList[0])[0] as Sizes,
                quantity: 1,
            });
            addToBag({
                product: testProductList[1],
                size: Object.keys(testProductList[1])[0] as Sizes,
                quantity: 1,
            });
            addToBag({
                product: testProductList[2],
                size: Object.keys(testProductList[2])[0] as Sizes,
                quantity: 1,
            });

            addToBag({
                product: testProductList[2],
                size: Object.keys(testProductList[2])[0] as Sizes,
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

    it("has no accessibility violations", async () => {
        getSessionWithAuth();
        const { container } = renderNavBar();

        await waitFor(async () => {
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
