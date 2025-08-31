import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";
import { Prisma, PrismaClient, Product as PrismaProduct, Sizes } from "@prisma/client";
import {
    createFakeOrderCypress,
    createFakeProduct,
    FakeOrderCypressParams,
} from "./src/lib/test-factories";
import { CypressTestDataDeleteParams } from "./src/lib/definitions";
import { convertClientProductWithStock, hashPassword } from "./src/lib/utils";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.test.local") });

const prisma = new PrismaClient();

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("task", {
                async createCypressTestProduct() {
                    const fakeProduct = convertClientProductWithStock(createFakeProduct());
                    const { stock, ...netProduct } = fakeProduct;

                    const createdProduct = await prisma.product.create({ data: netProduct });
                    await prisma.stock.createMany({
                        data: Object.entries(fakeProduct.stock).map(([size, quantity]) => ({
                            size: size as Sizes,
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
                    const dataObj: Prisma.OrderCreateArgs = {
                        data: createFakeOrderCypress(params),
                    };

                    const res = await prisma.order.create(dataObj);
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
