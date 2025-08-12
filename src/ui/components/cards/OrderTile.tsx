import {
    addReturnWindowDelta,
    checkIsWithinReturnWindow,
    processDateForClientDate,
    stringifyConvertPrice,
} from "@/lib/utils";
import ProductListTile from "@/ui/components/cards/ProductListTile";
import { OrderData } from "@/lib/definitions";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";

export default function OrderTile({ orderData }: { orderData: OrderData }) {
    const isOrderWithinReturnWindow = checkIsWithinReturnWindow(orderData.createdAt);

    const buildEndContent = () => (
        <div className="flex h-full">
            <div>
                <p>{`Return window ${
                    isOrderWithinReturnWindow ? "closes" : "closed"
                } ${processDateForClientDate(addReturnWindowDelta(orderData.createdAt))}`}</p>
                {isOrderWithinReturnWindow && (
                    <div className="mt-4">
                        <PlainRoundedButton overrideClasses="!bg-background-lightest">
                            Request Return
                        </PlainRoundedButton>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between p-2 border-2 border-b-0">
                <p>{`Ordered on ${processDateForClientDate(orderData.createdAt)}`}</p>
                <p>{`Total £${stringifyConvertPrice(orderData.total)}`}</p>
                <p>{`Order # ${orderData.id}`}</p>
            </div>
            <ProductListTile
                data={orderData}
                wrapWithLink={true}
                showSize={true}
                endContent={buildEndContent()}
            />
        </div>
    );
}
