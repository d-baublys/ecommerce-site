import { z } from "zod";
import {
    clientOrderItemWithProductNoStockSchema,
    itemMetadataSchema,
    orderSchema,
} from "../schemas";

export type ItemMetadata = z.infer<typeof itemMetadataSchema>;
export type Order = z.infer<typeof orderSchema>;
export type ClientOrderItemWithProductNoStock = z.infer<
    typeof clientOrderItemWithProductNoStockSchema
>;
