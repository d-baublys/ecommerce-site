import { z } from "zod";
import { categorySchema, priceSchema, productNameSchema, quantitySchema, sizeSchema } from "./base";

export const productSchema = z.object({
    id: z.uuid(),
    name: productNameSchema,
    gender: categorySchema,
    price: priceSchema,
    slug: productNameSchema,
    src: z.string(),
    alt: z.string(),
    dateAdded: z.iso.date(),
    stock: z.partialRecord(sizeSchema, quantitySchema),
});

export const productNoStockSchema = productSchema.omit({ stock: true });
