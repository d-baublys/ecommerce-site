import { z } from "zod";
import { productIdSchema, quantitySchema, sizeSchema } from "./base";

export const reservedItemSchema = z.object({
    id: z.uuid(),
    productId: productIdSchema,
    size: sizeSchema,
    quantity: quantitySchema,
});

export const reservedItemCreateSchema = z.array(
    reservedItemSchema.omit({
        id: true,
    })
);

export const uniformReservedItemsSchema = z.array(reservedItemSchema).refine((items) => {
    if (items.length === 0) return true;

    const { productId, size } = items[0];

    return items.every((item) => item.productId === productId && item.size === size);
}, "All reserved items must have the same product ID and size");
