import { z } from "zod";
import { productIdSchema, quantitySchema, sizeSchema } from "./base";

export const stockSchema = z.object({
    id: z.uuid(),
    size: sizeSchema,
    quantity: quantitySchema,
    productId: productIdSchema,
});
export const stockCreateSchema = stockSchema.omit({ id: true });
export const clientStockSchema = z.partialRecord(sizeSchema, quantitySchema);
