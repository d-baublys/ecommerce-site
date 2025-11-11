import { z } from "zod";
import { baseStockSchema } from "./stock";
import { priceSchema, productNameSchema } from "./base";

export const bagItemSchema = z.object({
    productName: productNameSchema,
    price: priceSchema,
    ...baseStockSchema.shape,
});

export const bagItemListSchema = z.array(bagItemSchema);
