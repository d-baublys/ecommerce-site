import { Metadata } from "next";
import BagPageClient from "./BagPageClient";

export const metadata: Metadata = {
    title: "My Bag",
};

export default function BagPage() {
    return <BagPageClient />;
}
