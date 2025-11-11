import { z } from "zod";
import { productIdSchema, quantitySchema, sizeSchema } from "./base";

export const baseStockSchema = z.object({
    size: sizeSchema,
    quantity: quantitySchema,
    productId: productIdSchema,
});

export const stockSchema = z.object({
    id: z.uuid(),
    ...baseStockSchema.shape,
});

export const stockCreateSchema = stockSchema.omit({ id: true, productId: true });
export const stockUpdateSchema = stockSchema.omit({ id: true });

export const clientStockSchema = z
    .partialRecord(sizeSchema, quantitySchema)
    .refine(
        (stockData) => Object.keys(stockData).length > 0,
        "Stock table must include at least one size"
    );
