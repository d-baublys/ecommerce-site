import { ClientProduct } from "@/lib/types";
import { createTestProduct } from "@/lib/test-factories";
import ProductImage from "@/ui/components/ProductImage";
import { screen, waitFor } from "@testing-library/dom";
import { act, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => {
        const { src, alt, onLoad, fill, ...rest } = props;
        return <img src={src} alt={alt} onLoad={onLoad} {...rest} />;
    },
}));

const testProduct: ClientProduct = createTestProduct();
const renderProductImage = () => render(<ProductImage product={testProduct} />);

describe("ProductImage", () => {
    it("shows only the skeleton during loading", () => {
        renderProductImage();

        const imgContainer = screen.getByAltText("Test product image 1").closest("div");
        const skeleton = screen.getByTestId("image-skeleton");

        expect(imgContainer).toHaveClass("opacity-0");
        expect(skeleton).toBeInTheDocument();
    });

    it("shows only the image after it has loaded", async () => {
        renderProductImage();

        const image = screen.getByAltText("Test product image 1");
        const imgContainer = image.closest("div");
        const skeleton = screen.queryByTestId("image-skeleton");

        act(() => {
            image.dispatchEvent(new Event("load"));
        });

        await waitFor(() => {
            expect(skeleton).not.toBeInTheDocument();
            expect(imgContainer).toHaveClass("opacity-100");
        });
    });

    it("applies override classes correctly", () => {
        const { container } = render(
            <ProductImage product={testProduct} overrideClasses="!aspect-square" />
        );

        expect(container.firstChild).toHaveClass("!aspect-square");
    });

    it("has no accessibility violations", async () => {
        const { container } = renderProductImage();

        await waitFor(async () => {
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
