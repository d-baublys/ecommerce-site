import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
import {
    createTestOrderCypress,
    createTestProduct,
    TestOrderCypressParams,
} from "./src/lib/test-factories";
import { hashPassword, mapStockForProductCreate } from "./src/lib/utils";
import {
    ClientProduct,
    CypressTestDataDeleteParams,
    OrderCreateInput,
    Product,
    Sizes,
} from "./src/lib/types";

dotenv.config({
    path: [
        path.resolve(process.cwd(), ".env.test.local"),
        path.resolve(process.cwd(), ".env.local"),
        path.resolve(process.cwd(), ".env"),
    ],
});

const prisma = new PrismaClient();

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("task", {
                async createCypressTestProduct() {
                    const testProduct: ClientProduct = createTestProduct();
                    const { stock, ...netProduct } = testProduct;

                    const createdProduct = await prisma.product.create({
                        data: {
                            ...netProduct,
                            stock: { createMany: { data: mapStockForProductCreate(stock) } },
                        },
                    });

                    return {
                        id: createdProduct.id,
                        name: createdProduct.name,
                        price: createdProduct.price,
                        slug: createdProduct.slug,
                    };
                },
                async createCypressTestOrder(params: TestOrderCypressParams) {
                    const createObj: OrderCreateInput = createTestOrderCypress(params);

                    const res = await prisma.order.create({
                        data: { ...createObj, items: { createMany: { data: createObj.items } } },
                    });
                    return res.id;
                },
                async createCypressTestUser() {
                    const hashedPassword = await hashPassword("testpassword123");

                    const res = await prisma.user.create({
                        data: { email: "test@example.com", password: hashedPassword, role: "user" },
                    });

                    return res.id;
                },
                async getTestProductSavedData() {
                    const res = await prisma.product.findFirst({
                        where: { name: "White & medium dark print" },
                    });

                    return { id: res?.id, slug: res?.slug };
                },
                async getTestProductMultipleId(productNameArr: Product["name"][]) {
                    const res = await prisma.product.findMany({
                        where: { name: { in: productNameArr } },
                    });

                    return res.map((product) => product.id);
                },
                async deleteTestData({ orderIdArr, productIdArr }: CypressTestDataDeleteParams) {
                    await prisma.$transaction([
                        prisma.orderItem.deleteMany({ where: { orderId: { in: orderIdArr } } }),
                        prisma.order.deleteMany({ where: { id: { in: orderIdArr } } }),
                        prisma.stock.deleteMany({
                            where: { productId: { in: productIdArr } },
                        }),
                        prisma.product.deleteMany({
                            where: { id: { in: productIdArr } },
                        }),
                    ]);
                    return null;
                },
                async deleteTestUsers() {
                    await prisma.user.deleteMany({ where: { id: { gt: 2 } } });
                    return null;
                },
                async deleteTestManageFeaturedProducts() {
                    await prisma.featuredProduct.deleteMany();
                    return null;
                },
            });
        },
        baseUrl: process.env.NEXT_PUBLIC_APP_URL,
        experimentalRunAllSpecs: true,
    },
    env: {
        ...process.env,
    },
});
