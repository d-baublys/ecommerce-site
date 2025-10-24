import { z } from "zod";
import {
    orderSchema,
    clientOrderSchema,
    orderCreateSchema,
    orderItemCreateSchema,
} from "../schemas";

export type Order = z.infer<typeof orderSchema>;
export type ClientOrder = z.infer<typeof clientOrderSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type OrderItemCreateInput = z.infer<typeof orderItemCreateSchema>;
