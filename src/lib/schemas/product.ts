import { z } from "zod";
import { categorySchema, priceSchema, productIdSchema, productNameSchema } from "./base";
import { clientStockSchema } from "./stock";

export const productSchema = z.object({
    id: z.uuid(),
    name: productNameSchema,
    gender: categorySchema,
    price: priceSchema,
    slug: productNameSchema,
    src: z.string(),
    alt: z.string(),
    dateAdded: z.date(),
});
export const productCreateSchema = productSchema.omit({ id: true });
export const clientProductSchema = productSchema.extend({ stock: clientStockSchema });
export const productCreateInputSchema = z.intersection(productCreateSchema, clientProductSchema);
export const featuredProductSchema = z.object({ id: z.uuid(), productId: productIdSchema });
