import { Prisma, PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/utils";
import { Categories, Product, Sizes } from "@/lib/definitions";

const prisma = new PrismaClient();

const prices: number[] = [2500, 3300, 5100, 7200, 10500, 13500, 18300, 21000]; // 2/2/2/1/1
prices.push(...prices); // mirror for each category

const createAlternatingStock = (rows: number) => {
    const result: number[][] = [];

    for (let i = 0; i < rows; i++) {
        if (i === rows - 1) {
            result.push([0, 0, 0, 0, 0]);
        } else if (i === Math.floor(rows / 2) - 1) {
            result.push([0, 0, 0, 1, 2]);
        } else {
            result.push([20, 20, 20, 20, 20]);
        }
    }
    return result;
};

const stockCounts: number[][] = createAlternatingStock(16);
const dates: string[] = [
    "2025-07-01",
    "2025-07-02",
    "2025-07-03",
    "2025-07-04",
    "2025-07-04",
    "2025-07-03",
    "2025-07-02",
    "2025-07-01",
];
dates.push(...dates); // mirror for each category

const productStubs: Omit<Product, "id" | "dateAdded" | "slug" | "price" | "stock">[] = [
    {
        name: "Black & large white graphic",
        gender: "womens",
        src: "/tshirt1.jpg",
        alt: "Black t-shirt with large white graphic",
    },
    {
        name: "White & dark company logo",
        gender: "womens",
        src: "/tshirt2.jpg",
        alt: "White t-shirt with dark company name print",
    },
    {
        name: "Black & small white print",
        gender: "womens",
        src: "/tshirt7.jpg",
        alt: "Black t-shirt with small white text print",
    },
    {
        name: "Black & small white print 2",
        gender: "womens",
        src: "/tshirt8.jpg",
        alt: "Black t-shirt with small white text print",
    },
    {
        name: "White & multicolour paint graphic",
        gender: "womens",
        src: "/tshirt10.jpg",
        alt: "White t-shirt with multicolour paint graphic",
    },
    {
        name: "Black & orange logo",
        gender: "womens",
        src: "/tshirt11.jpg",
        alt: "Black t-shirt with medium orange logo",
    },
    {
        name: "Black & white striped",
        gender: "womens",
        src: "/tshirt14.jpg",
        alt: "Black & white striped t-shirt with faint text print",
    },
    {
        name: "White & medium dark print",
        gender: "womens",
        src: "/tshirt16.jpg",
        alt: "White t-shirt with dark text print",
    },
    {
        name: "White & small dark graphic",
        gender: "mens",
        src: "/tshirt3.jpg",
        alt: "White t-shirt with small dark graphic",
    },
    {
        name: "White & large dark logo",
        gender: "mens",
        src: "/tshirt4.jpg",
        alt: "White t-shirt with large dark company logo",
    },
    {
        name: "Blue & large white print",
        gender: "mens",
        src: "/tshirt5.jpg",
        alt: "Blue t-shirt with large white text print",
    },
    {
        name: "Black & medium mixed print",
        gender: "mens",
        src: "/tshirt6.jpg",
        alt: "Black t-shirt with medium mixed-colour print",
    },
    {
        name: "Red & small dark logo",
        gender: "mens",
        src: "/tshirt9.jpg",
        alt: "Red t-shirt with small black logo",
    },
    {
        name: "Black & medium white print",
        gender: "mens",
        src: "/tshirt12.jpg",
        alt: "Black t-shirt with white text print",
    },
    {
        name: "Dark grey & small logo",
        gender: "mens",
        src: "/tshirt13.jpg",
        alt: "Dark grey t-shirt with small yellow logo",
    },
    {
        name: "Black & small company logo",
        gender: "mens",
        src: "/tshirt15.jpg",
        alt: "Black t-shirt with small multicolour company logo",
    },
];

async function main() {
    const mensSizes: Sizes[] = ["s", "m", "l", "xl", "xxl"];
    const womensSizes: Sizes[] = ["xs", "s", "m", "l", "xl"];

    for (let i in productStubs) {
        const product = productStubs[i];
        const productSizes = product.gender === "mens" ? mensSizes : womensSizes;

        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                gender: product.gender as Categories,
                price: prices[i],
                slug: slugify(product.name),
                src: product.src,
                alt: product.alt,
                dateAdded: new Date(dates[i]),
            },
        });

        const stockEntries: Prisma.StockCreateManyInput[] = productSizes.map((size, idx) => ({
            size: size as Sizes,
            quantity: stockCounts[i][idx],
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
