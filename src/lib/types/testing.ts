import { Order } from "./order";
import { Product } from "./product";

export type CypressTestProductData = Product;
export type CypressTestDataDeleteParams = {
    orderIds: Order["id"][];
    productIds: Product["id"][];
    productNames: Product["name"][];
};
