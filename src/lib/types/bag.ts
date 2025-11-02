import { z } from "zod";
import { bagItemSchema } from "../schemas";

export type BagItem = z.infer<typeof bagItemSchema>;
