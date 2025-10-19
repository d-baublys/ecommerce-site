import { z } from "zod";
import { productSchema } from "./product";
import { quantitySchema, sizeSchema } from "./base";

export const bagItemSchema = z.object({
    product: productSchema,
    size: sizeSchema,
    quantity: quantitySchema,
});

export const mergedBagItemSchema = z.intersection(
    bagItemSchema,
    z.object({ latestSizeStock: quantitySchema })
);
