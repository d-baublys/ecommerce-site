import { z } from "zod";
import { ORDER_STATUS_OPTIONS, VALID_CATEGORIES, VALID_SIZES } from "../constants";

export const productNameSchema = z.string().min(4);
export const priceSchema = z.int().gte(100);
export const quantitySchema = z.int().positive();
export const sizeSchema = z.enum(VALID_SIZES);
export const categorySchema = z.enum(VALID_CATEGORIES.map((c) => c.key));
export const orderStatusSchema = z.enum(ORDER_STATUS_OPTIONS.map((s) => s.key));
