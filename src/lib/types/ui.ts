import { ORDER_STATUS_OPTIONS, PRICE_FILTER_OPTIONS, SORT_OPTIONS } from "../constants";

export type ProductFormMode = "add" | "edit";
export type StockTableMode = ProductFormMode | "display";
export type PriceFilterKey = keyof typeof PRICE_FILTER_OPTIONS;
export type ProductSortKey = keyof typeof SORT_OPTIONS;
export type OrderStatus = (typeof ORDER_STATUS_OPTIONS)[number]["key"];
