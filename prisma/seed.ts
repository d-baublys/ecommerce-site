import { Prisma, PrismaClient } from "../generated/prisma";
import { slugify } from "../src/lib/utils";
import { Categories, Sizes } from "@/lib/definitions";

const prisma = new PrismaClient();

const generatePrice = () => (25 + Math.floor(Math.random() * (300 - 25))) * 100; // random between £25 and £299 in p

const products = [
    {
        name: "Black & large white graphic",
        gender: "womens",
        price: generatePrice(),
        src: "/tshirt1.jpg",
        alt: "Short black t-shirt with large white graphic",
        size: ["xs", "s", "m", "l", "xl"],
    },
    {
        name: "White & black company logo",
        gender: "womens",
        price: generatePrice(),
        src: "/tshirt2.jpg",
        alt: "White t-shirt with black company name",
        size: ["xs", "s", "m", "l", "xl"],
    },
    {
        name: "Black & small white print",
        gender: "womens",
        price: generatePrice(),
        src: "/tshirt7.jpg",
        alt: "Black t-shirt with small white text",
        size: ["xs", "s", "m", "l", "xl"],
    },
    {
        name: "Black & small white print 2",
        gender: "womens",
        price: generatePrice(),
        src: "/tshirt8.jpg",
        alt: "Black t-shirt with small white text",
        size: ["xs", "s", "m", "l", "xl"],
    },
    {
        name: "White & multicolour paint graphic",
        gender: "womens",
        price: generatePrice(),
        src: "/tshirt10.jpg",
        alt: "White t-shirt with multicolour paint graphic",
        size: ["xs", "s", "m", "l", "xl"],
    },
    {
        name: "Black & orange logo",
        gender: "womens",
        price: generatePrice(),
        src: "/tshirt11.jpg",
        alt: "Black t-shirt with striking orange logo",
        size: ["xs", "s", "m", "l", "xl"],
    },
    {
        name: "Black & white striped",
        gender: "womens",
        price: generatePrice(),
        src: "/tshirt14.jpg",
        alt: "Black & white striped t-shirt with single-word text",
        size: ["xs", "s", "m", "l", "xl"],
    },
    {
        name: "White & black text graphic",
        gender: "womens",
        price: generatePrice(),
        src: "/tshirt15.jpg",
        alt: "White t-shirt with black text graphic",
        size: ["xs", "s", "m", "l", "xl"],
    },
    {
        name: "White & small black graphic",
        gender: "mens",
        price: generatePrice(),
        src: "/tshirt3.jpg",
        alt: "White t-shirt with small black graphic",
        size: ["s", "m", "l", "xl", "xxl"],
    },
    {
        name: "White & large black logo",
        gender: "mens",
        price: generatePrice(),
        src: "/tshirt4.jpg",
        alt: "White t-shirt with large black company logo",
        size: ["s", "m", "l", "xl", "xxl"],
    },
    {
        name: "Blue & large white graphic",
        gender: "mens",
        price: generatePrice(),
        src: "/tshirt5.jpg",
        alt: "Blue t-shirt with large white text graphic",
        size: ["s", "m", "l", "xl", "xxl"],
    },
    {
        name: "Black & medium mixed print",
        gender: "mens",
        price: generatePrice(),
        src: "/tshirt6.jpg",
        alt: "Black t-shirt with medium mixed-colour print",
        size: ["s", "m", "l", "xl", "xxl"],
    },
    {
        name: "Red & small black logo",
        gender: "mens",
        price: generatePrice(),
        src: "/tshirt9.jpg",
        alt: "Red t-shirt with small black logo",
        size: ["s", "m", "l", "xl", "xxl"],
    },
    {
        name: "Black & white text graphic",
        gender: "mens",
        price: generatePrice(),
        src: "/tshirt12.jpg",
        alt: "Black t-shirt with styled white text graphic",
        size: ["s", "m", "l", "xl", "xxl"],
    },
    {
        name: "Dark grey & small logo",
        gender: "mens",
        price: generatePrice(),
        src: "/tshirt13.jpg",
        alt: "Dark grey t-shirt with small yellow logo",
        size: ["s", "m", "l", "xl", "xxl"],
    },
    {
        name: "Black & small company logo",
        gender: "mens",
        price: generatePrice(),
        src: "/tshirt16.jpg",
        alt: "Black t-shirt with small multicolour company logo",
        size: ["s", "m", "l", "xl", "xxl"],
    },
];

async function main() {
    for (let product of products) {
        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                gender: product.gender as Categories,
                price: product.price,
                slug: slugify(product.name),
                src: product.src,
                alt: product.alt,
                dateAdded: new Date(),
            },
        });

        const stockEntries: Prisma.StockCreateManyInput[] = product.size.map((size) => ({
            size: size as Sizes,
            quantity: Math.floor(Math.random() * 20),
            productId: createdProduct.id,
        }));

        await prisma.stock.createMany({
            data: stockEntries,
        });
    }
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
