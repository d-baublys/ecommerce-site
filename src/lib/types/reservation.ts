import { z } from "zod";
import { reservedItemCreateSchema, reservedItemSchema } from "../schemas";

export type ReservedItem = z.infer<typeof reservedItemSchema>;

export type ReservedItemCreateInput = z.infer<typeof reservedItemCreateSchema>;
