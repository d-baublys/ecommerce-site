import { z } from "zod";
import { categorySchema, priceSchema, productIdSchema, productNameSchema } from "./base";
import { clientStockSchema } from "./stock";

export const productSchema = z.strictObject({
    id: z.uuid(),
    name: productNameSchema,
    gender: categorySchema,
    price: priceSchema,
    slug: productNameSchema,
    src: z.string().min(4, "Invalid image filepath"),
    alt: z.string().min(4, "Image description must be at least 4 characters long"),
    dateAdded: z.date(),
});
export const clientProductSchema = productSchema.extend({ stock: clientStockSchema });
export const productCreateSchema = productSchema.omit({ id: true });
export const clientProductCreateSchema = clientProductSchema.omit({ id: true });
export const featuredProductSchema = z.object({ id: z.uuid(), productId: productIdSchema });
export const featuredProductCreateSchema = z.array(featuredProductSchema.pick({ productId: true }));
