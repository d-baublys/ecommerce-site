import { Product } from "@/lib/definitions";
import { pluralise } from "@/lib/utils";
import ProductGrid from "@/ui/components/product-grid/ProductGrid";

export default function BaseGridPage({
    displayedProducts,
    noProductMessage,
    categoryTabs,
    asideContent,
    fixedOverlays,
    sortingUnit,
}: {
    displayedProducts: Product[];
    noProductMessage: string;
    categoryTabs?: React.ReactNode;
    asideContent?: React.ReactNode;
    fixedOverlays?: React.ReactNode;
    sortingUnit?: React.ReactNode;
}) {
    return (
        <>
            {categoryTabs ?? null}
            <div className="flex flex-row grow">
                {asideContent ?? null}
                <div className="flex flex-col w-full overflow-clip">
                    <div className="flex justify-between w-full p-0.5 pb-4 font-semibold">
                        <p className="flex items-center gap-1">
                            <span>{displayedProducts.length}</span>
                            <span>{pluralise("Item", displayedProducts.length)}</span>
                        </p>
                        {sortingUnit ?? null}
                    </div>
                    <div className="flex grow">
                        {displayedProducts.length > 0 ? (
                            <ProductGrid productList={displayedProducts} />
                        ) : (
                            <div className="flex justify-center items-center w-full p-4 gap-4">
                                <p className="text-center">{noProductMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {fixedOverlays ?? null}
        </>
    );
}
