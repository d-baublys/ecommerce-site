import { Order } from "./order";
import { Product } from "./product";

export type CypressTestProductData = Pick<Product, "id" | "name" | "price" | "slug">;
export type CypressTestDataDeleteParams = {
    orderIdArr: Order["id"][];
    productIdArr: Product["id"][];
    productNameArr: Product["name"][];
};
