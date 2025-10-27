import {
    ORDER_STATUS_OPTIONS,
    ORDER_TABLE_COLUMNS,
    PRICE_FILTER_OPTIONS,
    SORT_OPTIONS,
} from "../constants";

export type ProductFormMode = "add" | "edit";
export type StockTableMode = ProductFormMode | "display";
export type PriceFilterId = keyof typeof PRICE_FILTER_OPTIONS;
export type ProductSortId = keyof typeof SORT_OPTIONS;
export type OrderStatus = (typeof ORDER_STATUS_OPTIONS)[number]["id"];
export type TableColumns = (typeof ORDER_TABLE_COLUMNS)[number]["id"];
export type TableSortOptions = "asc" | "desc";
