import { Categories, Product } from "@/lib/definitions";
import ProductTile from "./ProductTile";
import GridAside from "./GridAside";

export default function ProductGrid({
    productData,
    category,
}: {
    productData: Product[];
    category: Categories;
}) {
    return (
        <div className="flex p-8 w-screen grow">
            <div id="filter-aside" className="[flex:1_0_200px] bg-blue-500">
                <GridAside category={category} products={productData}/>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] w-full p-4 gap-4">
                {productData.map((product) => (
                    <ProductTile key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
