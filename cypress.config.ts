import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
import {
    buildTestOrderDataCypress,
    buildTestProduct,
    TestOrderCypressParams,
} from "./src/lib/test-factories";
import { hashPassword, mapStockForProductCreate } from "./src/lib/utils";
import {
    ClientProduct,
    CypressTestDataDeleteParams,
    OrderCreateInput,
    Product,
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
                    const testProduct: ClientProduct = buildTestProduct();
                    const { stock, ...netProduct } = testProduct;

                    const createdProduct = await prisma.product.create({
                        data: {
                            ...netProduct,
                            stock: { createMany: { data: mapStockForProductCreate(stock) } },
                        },
                    });

                    return createdProduct;
                },
                async createCypressTestOrder(params: TestOrderCypressParams) {
                    const orderCreateData: OrderCreateInput = buildTestOrderDataCypress(params);

                    const res = await prisma.order.create({
                        data: {
                            ...orderCreateData,
                            items: { createMany: { data: orderCreateData.items } },
                        },
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
                async getTestProductMultipleIds(productNames: Product["name"][]) {
                    const res = await prisma.product.findMany({
                        where: { name: { in: productNames } },
                    });

                    return res.map((product) => product.id);
                },
                async deleteTestData({ orderIds, productIds }: CypressTestDataDeleteParams) {
                    await prisma.$transaction([
                        prisma.order.deleteMany({ where: { id: { in: orderIds } } }),
                        prisma.product.deleteMany({
                            where: { id: { in: productIds } },
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
