import { z } from "zod";
import { reservedItemCreateSchema } from "./reservation";
import { userSchema } from "./user";

export const checkoutSessionSchema = z.object({
    id: z.string(),
    userId: userSchema.shape.id,
    createdAt: z.date(),
    expiresAt: z.date(),
});

export const checkoutSessionCreateSchema = checkoutSessionSchema.extend({
    items: reservedItemCreateSchema,
    createdAt: checkoutSessionSchema.shape.createdAt.optional(),
});
