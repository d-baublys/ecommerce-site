import { z } from "zod";
import {
    categorySchema,
    clientProductSchema,
    clientStockSchema,
    featuredProductCreateSchema,
    featuredProductSchema,
    productCreateSchema,
    productSchema,
    sizeSchema,
    stockCreateSchema,
    stockSchema,
} from "../schemas";

export type Product = z.infer<typeof productSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ClientProduct = z.infer<typeof clientProductSchema>;
export type Sizes = z.infer<typeof sizeSchema>;
export type Stock = z.infer<typeof stockSchema>;
export type StockCreateInput = z.infer<typeof stockCreateSchema>;
export type ClientStock = z.infer<typeof clientStockSchema>;
export type Categories = z.infer<typeof categorySchema>;
export type FeaturedProduct = z.infer<typeof featuredProductSchema>;
export type FeaturedProductCreateInput = z.infer<typeof featuredProductCreateSchema>;
