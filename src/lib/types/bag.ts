import { z } from "zod";
import { bagItemSchema, mergedBagItemSchema } from "../schemas";

export type BagItem = z.infer<typeof bagItemSchema>;
export type MergedBagItem = z.infer<typeof mergedBagItemSchema>;
