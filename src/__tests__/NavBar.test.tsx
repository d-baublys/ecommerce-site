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
import { buildBagItem } from "@/lib/utils";

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
            addToBag(
                testProductList[0],
                buildBagItem(testProductList[0], Object.keys(testProductList[0])[0] as Sizes)
            );
            addToBag(
                testProductList[1],
                buildBagItem(testProductList[1], Object.keys(testProductList[1])[0] as Sizes)
            );
            addToBag(
                testProductList[2],
                buildBagItem(testProductList[2], Object.keys(testProductList[2])[0] as Sizes)
            );

            addToBag(
                testProductList[2],
                buildBagItem(testProductList[2], Object.keys(testProductList[2])[0] as Sizes)
            );
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
