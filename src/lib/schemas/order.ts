import { z } from "zod";
import { productSchema } from "./product";
import { incrementedIdSchema, orderStatusSchema, priceSchema } from "./base";
import { baseStockSchema } from "./stock";
import { bagItemSchema } from "./bag";

const { id, dateAdded, ...netProduct } = productSchema.shape;

export const orderItemSchema = z
    .object({
        id: z.uuid(),
        ...baseStockSchema.shape,
    })
    .extend(netProduct);

export const orderItemCreateInputSchema = z.array(orderItemSchema.omit({ id: true }));
export const orderItemCreateParamsSchema = z.array(bagItemSchema.omit({ productName: true }));

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
});
export const clientOrderSchema = orderSchema.extend({
    items: z.array(orderItemSchema),
});

export const orderCreateInputSchema = orderSchema
    .omit({
        id: true,
    })
    .extend({
        userId: orderSchema.shape.userId.optional(),
        status: orderSchema.shape.status.optional(),
        createdAt: orderSchema.shape.createdAt.optional(),
        returnRequestedAt: orderSchema.shape.returnRequestedAt.optional(),
        refundedAt: orderSchema.shape.refundedAt.optional(),
        items: orderItemCreateInputSchema,
    });

export const orderCreateParamsSchema = orderCreateInputSchema.extend({
    items: orderItemCreateParamsSchema,
});

export const orderUpdateSchema = z.intersection(
    orderSchema.pick({ id: true, status: true }),
    orderCreateInputSchema.pick({ returnRequestedAt: true, refundedAt: true })
);
