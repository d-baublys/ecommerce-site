import { z } from "zod";
import { ORDER_STATUS_OPTIONS, VALID_CATEGORIES, VALID_SIZES } from "./definitions";

const productNameSchema = z.string().min(4);
const priceSchema = z.int().gte(100);
const quantitySchema = z.int().positive();
export const sizeSchema = z.enum(VALID_SIZES);
export const categorySchema = z.enum(VALID_CATEGORIES.map((c) => c.key));
export const orderStatusSchema = z.enum(ORDER_STATUS_OPTIONS.map((s) => s.key));

export const productSchema = z.object({
    id: z.uuid(),
    name: productNameSchema,
    gender: categorySchema,
    price: priceSchema,
    slug: productNameSchema,
    src: z.string(),
    alt: z.string(),
    dateAdded: z.iso.date(),
    stock: z.partialRecord(sizeSchema, quantitySchema),
});

export const productNoStockSchema = productSchema.omit({ stock: true });

export const bagItemSchema = z.object({
    product: productSchema,
    size: sizeSchema,
    quantity: quantitySchema,
});

export const mergedBagItemSchema = z.intersection(
    bagItemSchema,
    z.object({ latestSizeStock: quantitySchema })
);

export const itemMetadataSchema = z.object({
    productId: productSchema.shape.id,
    name: productNameSchema,
    price: priceSchema,
    size: sizeSchema,
    quantity: quantitySchema,
});

export const clientOrderItemWithProductNoStockSchema = z.intersection(
    itemMetadataSchema,
    z.object({ product: productNoStockSchema })
);

export const orderSchema = z.object({
    id: z.int().positive(),
    subTotal: priceSchema,
    shippingTotal: priceSchema,
    total: priceSchema,
    status: orderStatusSchema,
    userId: z.int().positive().nullable(),
    email: z.email(),
    createdAt: z.date(),
    returnRequestedAt: z.date().nullable(),
    refundedAt: z.date().nullable(),
    sessionId: z.string(),
    paymentIntentId: z.string(),
    items: clientOrderItemWithProductNoStockSchema.array(),
});
