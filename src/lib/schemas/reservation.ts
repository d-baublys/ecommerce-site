import { z } from "zod";
import { productIdSchema, quantitySchema, sizeSchema } from "./base";

export const reservedItemSchema = z.object({
    id: z.uuid(),
    productId: productIdSchema,
    size: sizeSchema,
    quantity: quantitySchema,
    createdAt: z.date(),
    expiresAt: z.date(),
});

export const reservedItemCreateSchema = z.array(
    reservedItemSchema
        .omit({
            id: true,
        })
        .extend({
            createdAt: reservedItemSchema.shape.createdAt.optional(),
        })
);
