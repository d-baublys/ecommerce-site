import { z } from "zod";
import {
    orderSchema,
    clientOrderSchema,
    orderCreateInputSchema,
    orderItemSchema,
    orderUpdateSchema,
    orderCreateParamsSchema,
    orderItemCreateParamsSchema,
    orderItemCreateInputSchema,
} from "../schemas";

export type Order = z.infer<typeof orderSchema>;
export type ClientOrder = z.infer<typeof clientOrderSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateInputSchema>;
export type OrderCreateParams = z.infer<typeof orderCreateParamsSchema>;
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderItemCreateParams = z.infer<typeof orderItemCreateParamsSchema>;
export type OrderItemCreateInput = z.infer<typeof orderItemCreateInputSchema>;
