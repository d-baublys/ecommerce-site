import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";
import {
    Prisma,
    PrismaClient,
    Product as PrismaProduct,
    Sizes as PrismaSizes,
} from "@prisma/client";
import {
    createFakeOrderCypress,
    createFakeProduct,
    FakeOrderCypressParams,
} from "./src/lib/test-factories";
import { CypressTestDataDeleteParams, Product } from "./src/lib/definitions";
import { convertClientProduct, hashPassword } from "./src/lib/utils";

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
                    const fakeProduct: Product = createFakeProduct();
                    const convertedProduct: PrismaProduct = convertClientProduct(fakeProduct);

                    const createdProduct = await prisma.product.create({ data: convertedProduct });
                    await prisma.stock.createMany({
                        data: Object.entries(fakeProduct.stock).map(([size, quantity]) => ({
                            size: size as PrismaSizes,
                            quantity: quantity,
                            productId: createdProduct.id,
                        })),
                    });

                    return {
                        id: createdProduct.id,
                        name: createdProduct.name,
                        price: createdProduct.price,
                        slug: createdProduct.slug,
                    };
                },
                async createCypressTestOrder(params: FakeOrderCypressParams) {
                    const createObj: Prisma.OrderCreateArgs = {
                        data: createFakeOrderCypress(params),
                    };

                    const res = await prisma.order.create(createObj);
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
                async getTestProductMultipleId(productNameArr: PrismaProduct["name"][]) {
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
