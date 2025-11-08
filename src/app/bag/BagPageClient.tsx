"use client";

import GoButton from "@/ui/components/buttons/GoButton";
import BagTile from "@/ui/components/cards/BagTile";
import { useBagStore } from "@/stores/bagStore";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import { getReservedItems, getProducts, deleteCheckoutSessions } from "@/lib/actions";
import {
    calculateTotalReservedQty,
    getUniformReservedItems,
    stringifyConvertPrice,
} from "@/lib/utils";
import MainLayout from "@/ui/layouts/MainLayout";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";
import LoadingIndicator from "@/ui/components/overlays/LoadingIndicator";
import { ClientProduct, ReservedItem } from "@/lib/types";
import FailureModal from "@/ui/components/overlays/FailureModal";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BagPageClient() {
    const [products, setProducts] = useState<ClientProduct[]>();
    const [groupedReservedItems, setGroupedReservedItems] = useState<ReservedItem[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isFailureModalOpen, setIsFailureModalOpen] = useState<boolean>(false);
    const [checkoutTrigger, setCheckoutTrigger] = useState<boolean>(false);
    const modalStateRef = useRef<boolean>(false);

    const { bag, removeFromBag, hasHydrated } = useBagStore((state) => state);
    const emptyBag = !bag.length;
    const bagProductIds = bag.map((bagItem) => bagItem.productId);
    const router = useRouter();
    const session = useSession();
    const searchParams = useSearchParams();

    const orderSubtotal = bag.reduce(
        (subTotal, bagItem) => subTotal + bagItem.price * bagItem.quantity,
        0
    );
    const shippingCost = !emptyBag && orderSubtotal ? 500 : 0;
    const orderTotal = orderSubtotal + shippingCost;

    const checkoutPermitted = !(emptyBag || bag.some((item) => item.quantity === 0));

    useEffect(() => {
        if (!hasHydrated) return;

        const getData = async () => {
            try {
                const productsFetch = await getProducts({ id: { in: bagProductIds } });
                setProducts(productsFetch.data);

                const reservedFetch = await getReservedItems({
                    productIds: bagProductIds,
                });

                setGroupedReservedItems(reservedFetch.data);
            } catch {
                setError(new Error("Error fetching product data. Please try again later."));
            }
        };

        getData();
    }, [hasHydrated, checkoutTrigger]);

    useEffect(() => {
        if (session.data?.user?.id === undefined) return;

        const id = session.data.user.id;

        const resetUserSessions = async () => {
            await deleteCheckoutSessions(Number(id));
        };

        resetUserSessions();
    }, [session]);

    useEffect(() => {
        modalStateRef.current = isFailureModalOpen;
    }, [isFailureModalOpen]);

    const goToCheckout = async () => {
        const res = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bagItems: bag,
                shippingCost,
                userId: Number(session.data?.user?.id),
            }),
        });

        const data = await res.json();

        if (process.env.NEXT_PUBLIC_APP_ENV === "test") return;

        if (data.url) {
            await stripePromise;
            window.location.href = data.url;
        } else if (data.error) {
            setError(new Error(data.error));
        } else {
            setError(new Error("Error starting checkout. Please try again later."));
        }
    };

    const handleCheckout = async () => {
        if (session.status === "unauthenticated") {
            router.push("/login?redirect_after=bag");
            return;
        } else if (session.status === "authenticated") {
            setCheckoutTrigger((prev) => !prev);
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                if (modalStateRef.current) return;
                goToCheckout();
            }, 1000);
        }
    };

    useEffect(() => {
        const redirect = searchParams.get("from_login");

        if (redirect === "true") {
            handleCheckout();
        }
    }, [session]);

    if (error) throw error;

    if (!products || !groupedReservedItems) return null;

    const getReservedQuantity = (
        productId: ReservedItem["productId"],
        size: ReservedItem["size"]
    ) => {
        return calculateTotalReservedQty(
            getUniformReservedItems({ items: groupedReservedItems, productId, size })
        );
    };

    return (
        <>
            <MainLayout subheaderText="My Bag">
                <div className="flex flex-col md:flex-row w-full h-full">
                    {!emptyBag ? (
                        <ul
                            id="bag-tile-container"
                            data-testid="bag-tile-ul"
                            className="flex flex-col w-full lg:gap-8"
                        >
                            {bag.map((bagItem) => {
                                const productData = products.find(
                                    (product) => product.id === bagItem.productId
                                );

                                if (!productData)
                                    throw new Error(
                                        "Bag item data not found in product data fetch"
                                    );

                                return (
                                    <li
                                        key={`${bagItem.productId}-${bagItem.size}`}
                                        className="bag-tile w-full mb-8 lg:mb-0"
                                    >
                                        <BagTile
                                            bagItem={bagItem}
                                            productData={productData}
                                            handleDelete={() =>
                                                removeFromBag(bagItem.productId, bagItem.size)
                                            }
                                            modalSetter={setIsFailureModalOpen}
                                            reservedQty={getReservedQuantity(
                                                bagItem.productId,
                                                bagItem.size
                                            )}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="flex flex-col justify-center items-center w-full h-full p-8 md:p-0 gap-8">
                            <p>{"Your bag is empty!"}</p>
                            <div>
                                <PlainRoundedButtonLink
                                    href={"/category/all"}
                                    overrideClasses="!bg-background-lightest"
                                >
                                    Shop
                                </PlainRoundedButtonLink>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col px-8 py-6 w-full h-min md:w-2/5 md:ml-8 justify-evenly bg-background-lightest rounded-sm">
                        <p className="pb-6 font-semibold text-sz-subheading lg:text-sz-subheading-lg whitespace-nowrap">
                            Order Summary
                        </p>
                        <div>
                            <div className="flex justify-between py-3">
                                <p>Subtotal</p>
                                <p aria-label="Bag subtotal">
                                    £{stringifyConvertPrice(orderSubtotal)}
                                </p>
                            </div>
                            <div className="flex justify-between py-3 border-b-2">
                                <p>Shipping</p>
                                <p aria-label="Shipping cost">
                                    {shippingCost ? (
                                        <>
                                            <span>£</span>
                                            <span>{stringifyConvertPrice(shippingCost)}</span>
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </p>
                            </div>
                            <div className="flex justify-between py-3 font-semibold">
                                <p>Total</p>
                                <p aria-label="Bag total">£{stringifyConvertPrice(orderTotal)}</p>
                            </div>
                        </div>
                        {checkoutPermitted && (
                            <div className="flex pt-4 w-full justify-center">
                                <GoButton
                                    onClick={handleCheckout}
                                    predicate={checkoutPermitted}
                                    disabled={!checkoutPermitted}
                                >
                                    Checkout
                                </GoButton>
                            </div>
                        )}
                    </div>
                </div>
            </MainLayout>
            {isLoading && <LoadingIndicator />}
            {isFailureModalOpen && (
                <FailureModal
                    message={
                        <>
                            Available stock for some of your items has changed.
                            <br />
                            <br />
                            Quantity selections have been automatically updated.
                        </>
                    }
                    handleClose={() => setIsFailureModalOpen(false)}
                    isOpenState={isFailureModalOpen}
                />
            )}
        </>
    );
}
