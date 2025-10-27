import { Order } from "./order";
import { Product } from "./product";

export type CypressTestProductData = Pick<Product, "id" | "name" | "price" | "slug">;
export type CypressTestDataDeleteParams = {
    orderIds: Order["id"][];
    productIds: Product["id"][];
    productNames: Product["name"][];
};
