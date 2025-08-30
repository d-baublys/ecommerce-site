import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";
import { Prisma, PrismaClient, Product as PrismaProduct } from "@prisma/client";
import { createFakeOrderCypress, createFakeProduct } from "./src/lib/test-factories";
import { CypressSeedTestDataDelete, CypressSeedTestProduct } from "./src/lib/definitions";
import { convertClientProduct, hashPassword } from "./src/lib/utils";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.test.local") });

const prisma = new PrismaClient();

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("task", {
                async seedTestProduct() {
                    const fakeProduct: PrismaProduct = convertClientProduct(createFakeProduct());

                    const res = await prisma.product.create({ data: fakeProduct });
                    return { id: res.id, name: res.name, price: res.price };
                },
                async seedTestOrder({
                    productsDataArr,
                }: {
                    productsDataArr: CypressSeedTestProduct[];
                }) {
                    const dataObj: Prisma.OrderCreateArgs = {
                        data: createFakeOrderCypress({ productsDataArr }),
                    };

                    const res = await prisma.order.create(dataObj);
                    return res.id;
                },
                async seedTestUser() {
                    const hashedPassword = await hashPassword("testpassword123");

                    const res = await prisma.user.create({
                        data: { email: "test@example.com", password: hashedPassword, role: "user" },
                    });

                    return res.id;
                },
                async getTestProductSavedData({
                    productName,
                    imagePath,
                }: {
                    productName: PrismaProduct["name"];
                    imagePath: PrismaProduct["src"];
                }) {
                    const res = await prisma.product.findFirst({
                        where: { name: productName, src: imagePath },
                    });

                    return { id: res?.id, slug: res?.slug };
                },
                async getTestProductMultipleId(productNameArr: PrismaProduct["name"][]) {
                    const res = await prisma.product.findMany({
                        where: { name: { in: productNameArr } },
                    });

                    return res.map((product) => product.id);
                },
                async deleteTestData({ orderIdArr, productIdArr }: CypressSeedTestDataDelete) {
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
