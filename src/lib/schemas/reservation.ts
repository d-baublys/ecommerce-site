import { z } from "zod";
import { productIdSchema, quantitySchema, sizeSchema } from "./base";

export const reservationItemSchema = z.object({
    id: z.uuid(),
    productId: productIdSchema,
    size: sizeSchema,
    quantity: quantitySchema,
    reservationId: z.uuid(),
});

export const reservationItemCreateSchema = reservationItemSchema.omit({
    id: true,
    reservationId: true,
});

export const reservationSchema = z.object({
    id: z.uuid(),
    createdAt: z.date(),
    expiresAt: z.date(),
});

export const reservationCreateSchema = reservationSchema.omit({ id: true }).extend({
    items: z.array(reservationItemCreateSchema),
    createdAt: reservationSchema.shape.createdAt.optional(),
});
