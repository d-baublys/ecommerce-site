import { Product as PrismaProduct, Order as PrismaOrder } from "@prisma/client";
import { Product } from "./product";

export type CypressTestProductData = Pick<Product, "id" | "name" | "price" | "slug">;
export type CypressTestDataDeleteParams = {
    orderIdArr: PrismaOrder["id"][];
    productIdArr: PrismaProduct["id"][];
    productNameArr: PrismaProduct["name"][];
};
