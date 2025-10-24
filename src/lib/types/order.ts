import { z } from "zod";
import {
    itemMetadataSchema,
    orderSchema,
    clientOrderSchema,
    orderCreateSchema,
    orderItemCreateSchema,
    adminOrderSchema,
} from "../schemas";

export type ItemMetadata = z.infer<typeof itemMetadataSchema>;
export type Order = z.infer<typeof orderSchema>;
export type ClientOrder = z.infer<typeof clientOrderSchema>;
export type AdminOrder = z.infer<typeof adminOrderSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type OrderItemCreateInput = z.infer<typeof orderItemCreateSchema>;
