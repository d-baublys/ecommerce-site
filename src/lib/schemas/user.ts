import { z } from "zod";
import { incrementedIdSchema, userRoleSchema } from "./base";
import { orderSchema } from "./order";

export const userSchema = z.object({
    id: incrementedIdSchema,
    password: z.string().min(8, "Your password must have a minimum of 8 characters."),
    email: z.email("Invalid email address."),
    role: userRoleSchema,
    orders: z.array(orderSchema),
    createdAt: z.date().nullable(),
});

export const userCreateSchema = userSchema
    .omit({ id: true, orders: true, createdAt: true })
    .extend({ role: userRoleSchema.default("user") });
