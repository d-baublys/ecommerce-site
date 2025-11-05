import { z } from "zod";
import { checkoutSessionCreateSchema, checkoutSessionSchema } from "../schemas";

export type CheckoutSession = z.infer<typeof checkoutSessionSchema>;

export type CheckoutSessionCreateInput = z.infer<typeof checkoutSessionCreateSchema>;
