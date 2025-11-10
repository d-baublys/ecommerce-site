import { Prisma } from "@prisma/client";
import { Order } from "./types";

export const VALID_SIZES = ["xs", "s", "m", "l", "xl", "xxl"] as const;
export const VALID_CATEGORIES = [
    { id: "mens", label: "Men's" },
    { id: "womens", label: "Women's" },
] as const;
export const ORDER_STATUS_OPTIONS = [
    {
        id: "paid",
        label: "Paid",
    },
    {
        id: "pendingReturn",
        label: "Pending Return",
    },
    {
        id: "refunded",
        label: "Refunded",
    },
] as const;
export const ORDER_TABLE_COLUMNS: {
    id: keyof Omit<Order, "paymentIntentId" | "sessionId" | "items">;
    label: string;
}[] = [
    { id: "id", label: "Order #" },
    { id: "userId", label: "Customer Id" },
    { id: "email", label: "Customer Email" },
    { id: "subTotal", label: "Subtotal" },
    { id: "shippingTotal", label: "Shipping" },
    { id: "total", label: "Total" },
    { id: "createdAt", label: "Date Created" },
    { id: "returnRequestedAt", label: "Date Return Requested" },
    { id: "refundedAt", label: "Date Refunded" },
    { id: "status", label: "Status" },
];
export const PRICE_FILTER_OPTIONS = {
    a: { min: 0, max: 5000 },
    b: { min: 5000, max: 10000 },
    c: { min: 10000, max: 15000 },
    d: { min: 15000, max: 20000 },
    e: { min: 20000, max: Infinity },
};
export const SORT_OPTIONS = {
    a: { sort: { price: "asc" as Prisma.SortOrder }, label: "Price (Low to High)" },
    b: { sort: { price: "desc" as Prisma.SortOrder }, label: "Price (High to Low)" },
    c: { sort: { dateAdded: "desc" as Prisma.SortOrder }, label: "Newest" },
};
export const SINGLE_ITEM_MAX_QUANTITY = Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY);
export const FEATURED_COUNT = Number(process.env.NEXT_PUBLIC_FEATURED_COUNT);
export const REFUND_WINDOW = 1000 * 60 * 60 * 24 * 30; // 30 days in ms
export const USER_ROLES = ["admin", "user"] as const;
