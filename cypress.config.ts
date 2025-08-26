import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";
import { Prisma, PrismaClient, Product as PrismaProduct } from "@prisma/client";
import { createFakeOrderCypress, createFakeProduct } from "./src/lib/test-factories";
import { CypressSeedTestDataDelete, CypressSeedTestProduct } from "./src/lib/definitions";
import { convertClientProduct } from "./src/lib/utils";

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
                async deleteTestData({ orderIdArr, productIdArr }: CypressSeedTestDataDelete) {
                    await prisma.$transaction([
                        prisma.orderItem.deleteMany({ where: { orderId: { in: orderIdArr } } }),
                        prisma.order.deleteMany({ where: { id: { in: orderIdArr } } }),
                        prisma.product.deleteMany({ where: { id: { in: productIdArr } } }),
                    ]);
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
