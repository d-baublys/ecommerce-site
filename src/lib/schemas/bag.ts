import { z } from "zod";
import { clientProductSchema } from "./product";
import { quantitySchema, sizeSchema } from "./base";

export const bagItemSchema = z.object({
    product: clientProductSchema,
    size: sizeSchema,
    quantity: quantitySchema,
});

export const mergedBagItemSchema = z.intersection(
    bagItemSchema,
    z.object({ latestSizeStock: quantitySchema })
);
