import { z } from "zod";
import {
    priceSchema,
    productIdSchema,
    productNameSchema,
    quantitySchema,
    sizeSchema,
} from "./base";

export const bagItemSchema = z.object({
    productId: productIdSchema,
    productName: productNameSchema,
    price: priceSchema,
    size: sizeSchema,
    quantity: quantitySchema,
});
