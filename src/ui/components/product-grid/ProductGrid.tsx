import { Product } from "@/lib/types";
import ProductGridTile from "@/ui/components/cards/ProductGridTile";

export default function ProductGrid({ productList }: { productList: Product[] }) {
    return (
        <div
            data-testid="product-grid"
            className="grid-tile-container grid grid-cols-12 w-full p-0.5 gap-x-4 gap-y-8"
        >
            {productList.map((product) => (
                <div key={product.id} className="col-span-6 xl:col-span-4 2xl:col-span-3">
                    <ProductGridTile product={product} />
                </div>
            ))}
        </div>
    );
}
