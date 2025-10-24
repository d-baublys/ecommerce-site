import { Prisma } from "@prisma/client";
import { Order } from "./types";

export const VALID_SIZES = ["xs", "s", "m", "l", "xl", "xxl"] as const;
export const VALID_CATEGORIES = [
    { key: "mens", label: "Men's" },
    { key: "womens", label: "Women's" },
] as const;
export const ORDER_STATUS_OPTIONS = [
    {
        key: "paid",
        label: "Paid",
    },
    {
        key: "pendingReturn",
        label: "Pending Return",
    },
    {
        key: "refunded",
        label: "Refunded",
    },
] as const;
export const ORDER_TABLE_COLUMNS: {
    key: keyof Omit<Order, "paymentIntentId" | "sessionId" | "items">;
    label: string;
}[] = [
    { key: "id", label: "Order #" },
    { key: "userId", label: "Customer Id" },
    { key: "email", label: "Customer Email" },
    { key: "subTotal", label: "Subtotal" },
    { key: "shippingTotal", label: "Shipping" },
    { key: "total", label: "Total" },
    { key: "createdAt", label: "Date Created" },
    { key: "returnRequestedAt", label: "Date Return Requested" },
    { key: "refundedAt", label: "Date Refunded" },
    { key: "status", label: "Status" },
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
export const FEATURED_COUNT = 5;
export const REFUND_WINDOW = 1000 * 60 * 60 * 24 * 30; // 30 days in ms
export const USER_ROLES = ["admin", "user"] as const;
