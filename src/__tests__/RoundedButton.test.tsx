import RoundedButton from "@/ui/components/buttons/RoundedButton";
import { render } from "@testing-library/react";

describe("RoundedButton", () => {
    it("applies override classes & button type correctly", () => {
        const { container } = render(
            <RoundedButton type="submit" overrideClasses="!bg-green-500" />
        );
        const btn = container.firstChild;

        expect(btn).toHaveClass("!bg-green-500");
        expect(btn).toHaveAttribute("type", "submit");
    });
});
