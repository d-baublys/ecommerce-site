import { z } from "zod";
import { reservedItemSchema, uniformReservedItemsSchema } from "../schemas";

export type ReservedItem = z.infer<typeof reservedItemSchema>;

export type UniformReservedItems = z.infer<typeof uniformReservedItemsSchema>;
