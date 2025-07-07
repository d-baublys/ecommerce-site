import { Product } from "@/lib/definitions";
import ProductTile from "@/ui/components/cards/ProductTile";

export default function ProductGrid({ productList }: { productList: Product[] }) {
    return (
        <div data-testid="product-grid" className="grid grid-cols-12 w-full p-0.5 gap-x-4 gap-y-8">
            {productList.map((product) => (
                <div key={product.id} className="col-span-6 xl:col-span-4 2xl:col-span-3">
                    <ProductTile product={product} />
                </div>
            ))}
        </div>
    );
}
