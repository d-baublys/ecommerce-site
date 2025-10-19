import { z } from "zod";
import { categorySchema, productNoStockSchema, productSchema, sizeSchema } from "../schemas";

export type Product = z.infer<typeof productSchema>;
export type ProductNoStock = z.infer<typeof productNoStockSchema>;
export type Sizes = z.infer<typeof sizeSchema>;
export type Categories = z.infer<typeof categorySchema>;
