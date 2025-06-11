import { Categories, Product, VALID_CATEGORIES } from "@/lib/definitions";
import { pluralise } from "@/lib/utils";
import ProductGrid from "@/ui/components/ProductGrid";
import Link from "next/link";

export default function BaseGridPage({
    displayedProducts,
    noProductMessage,
    category,
    asideContent,
    fixedOverlays,
    sortingUnit,
}: {
    displayedProducts: Product[];
    noProductMessage: string;
    category?: Categories | "all";
    asideContent?: React.ReactNode;
    fixedOverlays?: React.ReactNode;
    sortingUnit?: React.ReactNode;
}) {
    return (
        <>
            {category === "all" ? (
                <ul className="flex w-full border-b-2 gap-8 mb-8 py-2">
                    {Object.entries(VALID_CATEGORIES).map(([key, displayName]) => (
                        <li key={key}>
                            <Link href={`/category/${key}`}>
                                <div>{displayName}</div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : null}
            <div className="flex flex-row grow">
                {asideContent ?? null}
                <div className="flex flex-col w-full overflow-clip">
                    <div className="flex justify-between w-full pb-4 font-semibold">
                        <p className="flex items-center gap-1">
                            <span>{displayedProducts.length}</span>
                            <span>{pluralise("Item", displayedProducts.length)}</span>
                        </p>
                        {sortingUnit}
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
