import { z } from "zod";
import { productSchema } from "./product";
import {
    incrementedIdSchema,
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

export const orderItemSchema = itemMetadataSchema.extend({
    id: z.uuid(),
});

export const orderItemClientSchema = orderItemSchema.extend({ product: productSchema });

export const orderItemCreateSchema = z.array(orderItemSchema.omit({ id: true }));

export const orderSchema = z.object({
    id: incrementedIdSchema,
    subTotal: priceSchema,
    shippingTotal: priceSchema,
    total: priceSchema,
    status: orderStatusSchema,
    userId: incrementedIdSchema.nullable(),
    email: z.email(),
    createdAt: z.date(),
    returnRequestedAt: z.date().nullable(),
    refundedAt: z.date().nullable(),
    sessionId: z.string(),
    paymentIntentId: z.string(),
    items: z.array(orderItemSchema),
});

export const clientOrderSchema = orderSchema.extend({ items: z.array(orderItemClientSchema) });

export const adminOrderSchema = orderSchema.omit({ items: true });

export const orderCreateSchema = orderSchema
    .omit({
        id: true,
    })
    .extend({
        userId: orderSchema.shape.userId.optional(),
        status: orderSchema.shape.status.optional(),
        createdAt: orderSchema.shape.createdAt.optional(),
        returnRequestedAt: orderSchema.shape.returnRequestedAt.optional(),
        refundedAt: orderSchema.shape.refundedAt.optional(),
        items: orderItemCreateSchema,
    });
