import { Product } from "@/lib/definitions";
import { createFakeProduct } from "@/lib/test-utils";
import ProductImage from "@/ui/components/ProductImage";
import { screen, waitFor } from "@testing-library/dom";
import { act, render } from "@testing-library/react";

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => {
        const { src, alt, onLoad, fill, ...rest } = props;
        return <img src={src} alt={alt} onLoad={onLoad} {...rest} />;
    },
}));

const fakeProduct: Product = createFakeProduct();
const renderProductImage = () => {
    render(<ProductImage product={fakeProduct} />);
};

describe("ProductImage", () => {
    it("shows only the skeleton during loading", () => {
        renderProductImage();

        const imgContainer = screen.getByAltText("Test product image").closest("div");
        const skeleton = screen.getByTestId("image-skeleton");

        expect(imgContainer).toHaveClass("opacity-0");
        expect(skeleton).toBeInTheDocument();
    });

    it("shows only the image after it has loaded", async () => {
        renderProductImage();

        const image = screen.getByAltText("Test product image");
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
            <ProductImage product={fakeProduct} overrideClasses="!aspect-square" />
        );

        expect(container.firstChild).toHaveClass("!aspect-square");
    });
});
