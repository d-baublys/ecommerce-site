"use server";

import { Product } from "@/lib/definitions";
import { updateProductStock } from "@/lib/utils";

export default async function stockUpdate(productId: string, stockObj: Product["stock"]) {
    try {
        await updateProductStock(productId, stockObj);
        return { success: true };
    } catch {
        return { success: false };
    }
}
