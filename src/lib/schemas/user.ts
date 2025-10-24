import { z } from "zod";
import { incrementedIdSchema, userRoleSchema } from "./base";
import { orderSchema } from "./order";

export const userSchema = z.object({
    id: incrementedIdSchema,
    password: z.string().min(8, "Password must be at least 8 characters long."),
    email: z.email("Invalid email address."),
    role: userRoleSchema,
    orders: z.array(orderSchema),
    createdAt: z.date(),
});

export const clientUserSchema = userSchema.omit({ orders: true });

export const userCreateSchema = userSchema
    .omit({ id: true, orders: true, createdAt: true })
    .extend({ role: userRoleSchema.default("user"), createdAt: userSchema.optional() });
