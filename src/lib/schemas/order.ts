import { z } from "zod";
import { productNoStockSchema, productSchema } from "./product";
import {
    orderStatusSchema,
    priceSchema,
    productNameSchema,
    quantitySchema,
    sizeSchema,
} from "./base";

export const itemMetadataSchema = z.object({
    productId: productSchema.shape.id,
    name: productNameSchema,
    price: priceSchema,
    size: sizeSchema,
    quantity: quantitySchema,
});

export const clientOrderItemWithProductNoStockSchema = z.intersection(
    itemMetadataSchema,
    z.object({ product: productNoStockSchema })
);

export const orderSchema = z.object({
    id: z.int().positive(),
    subTotal: priceSchema,
    shippingTotal: priceSchema,
    total: priceSchema,
    status: orderStatusSchema,
    userId: z.int().positive().nullable(),
    email: z.email(),
    createdAt: z.date(),
    returnRequestedAt: z.date().nullable(),
    refundedAt: z.date().nullable(),
    sessionId: z.string(),
    paymentIntentId: z.string(),
    items: z.array(clientOrderItemWithProductNoStockSchema),
});
