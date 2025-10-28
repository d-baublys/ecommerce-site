import { z } from "zod";
import {
    orderSchema,
    clientOrderSchema,
    orderCreateSchema,
    orderItemCreateSchema,
    orderItemSchema,
    orderUpdateSchema,
} from "../schemas";

export type Order = z.infer<typeof orderSchema>;
export type ClientOrder = z.infer<typeof clientOrderSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderItemCreateInput = z.infer<typeof orderItemCreateSchema>;
