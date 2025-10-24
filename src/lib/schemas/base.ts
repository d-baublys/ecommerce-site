import { z } from "zod";
import { ORDER_STATUS_OPTIONS, USER_ROLES, VALID_CATEGORIES, VALID_SIZES } from "../constants";

export const productIdSchema = z.uuid();
export const incrementedIdSchema = z.int().positive();
export const productNameSchema = z
    .string()
    .min(4, "Product name must be at least 4 characters long");
export const priceSchema = z.int().gte(100, "Price must be at least 1.00");
export const quantitySchema = z
    .int({
        error: () => "Invalid quantity value",
    })
    .nonnegative("Invalid quantity value");
export const sizeSchema = z.enum(VALID_SIZES, "Invalid size value");
export const categorySchema = z.enum(VALID_CATEGORIES.map((c) => c.key));
export const orderStatusSchema = z.enum(ORDER_STATUS_OPTIONS.map((s) => s.key));
export const userRoleSchema = z.enum(USER_ROLES);
