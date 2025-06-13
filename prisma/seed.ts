import { v4 as uuid } from "uuid";

import { PrismaClient } from "../generated/prisma";
import { processDateForClient, slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
    const createProductOne = async () => {
        const name = "T-shirt design 1";

        const createdProduct = await prisma.product.create({
            data: {
                name,
                gender: "womens",
                price: 2200,
                slug: slugify(name),
                src: "/tshirt1.jpg",
                alt: "T-shirt design 1",
                dateAdded: new Date(),
            },
        });

        await prisma.stock.createMany({
            data: [
                {
                    size: "xs",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "s",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "m",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "l",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "xl",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
            ],
        });
    };

    const createProductTwo = async () => {
        const name = "T-shirt design 2";

        const createdProduct = await prisma.product.create({
            data: {
                name,
                gender: "womens",
                price: 3600,
                slug: slugify(name),
                src: "/tshirt2.jpg",
                alt: "T-shirt design 2",
                dateAdded: new Date(),
            },
        });

        await prisma.stock.createMany({
            data: [
                {
                    size: "xs",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "s",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "m",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "l",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "xl",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
            ],
        });
    };

    const createProductThree = async () => {
        const name = "T-shirt design 3";

        const createdProduct = await prisma.product.create({
            data: {
                name,
                gender: "mens",
                price: 8200,
                slug: slugify(name),
                src: "/tshirt3.jpg",
                alt: "T-shirt design 3",
                dateAdded: new Date(),
            },
        });

        await prisma.stock.createMany({
            data: [
                {
                    size: "s",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "m",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "l",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "xl",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "xxl",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
            ],
        });
    };
    const createProductFour = async () => {
        const name = "T-shirt design 4";

        const createdProduct = await prisma.product.create({
            data: {
                name,
                gender: "mens",
                price: 11000,
                slug: slugify(name),
                src: "/tshirt4.jpg",
                alt: "T-shirt design 4",
                dateAdded: new Date(),
            },
        });

        await prisma.stock.createMany({
            data: [
                {
                    size: "s",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "m",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "l",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "xl",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "xxl",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
            ],
        });
    };
    const createProductFive = async () => {
        const name = "T-shirt design 5";

        const createdProduct = await prisma.product.create({
            data: {
                name,
                gender: "mens",
                price: 20500,
                slug: slugify(name),
                src: "/tshirt5.jpg",
                alt: "T-shirt design 5",
                dateAdded: new Date(),
            },
        });

        await prisma.stock.createMany({
            data: [
                {
                    size: "s",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "m",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "l",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "xl",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
                {
                    size: "xxl",
                    quantity: Math.floor(Math.random() * 20),
                    productId: createdProduct.id,
                },
            ],
        });
    };

    await Promise.all([
        createProductOne(),
        createProductTwo(),
        createProductThree(),
        createProductFour(),
        createProductFive(),
    ]);
}

main()
    .then(() => {
        console.log("Seeding complete.");
    })
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
