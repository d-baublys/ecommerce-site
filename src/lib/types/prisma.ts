import { Prisma } from "@prisma/client";

export type PrismaOrderNoStock = Prisma.OrderGetPayload<{
    include: { items: { include: { product: true } } };
}>;
