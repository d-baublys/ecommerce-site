import { v4 as uuidv4 } from "uuid";
import { ProductType } from "./types";

export const productList: ProductType[] = [
    {
        id: uuidv4(),
        name: "T-shirt design 1",
        gender: "womens",
        price: 2200,
        slug: "t-shirt-design-1",
        src: "/tshirt1.jpg",
        alt: "T-shirt design 1",
        stock: {
            xs: 5,
            s: 2,
            m: 3,
            l: 5,
            xl: 5,
        },
    },
    {
        id: uuidv4(),
        name: "T-shirt design 2",
        gender: "womens",
        price: 3000,
        slug: "t-shirt-design-2",
        src: "/tshirt2.jpg",
        alt: "T-shirt design 2",
        stock: {
            xs: 5,
            s: 0,
            m: 3,
            l: 5,
            xl: 5,
        },
    },
    {
        id: uuidv4(),
        name: "T-shirt design 3",
        gender: "mens",
        price: 2500,
        slug: "t-shirt-design-3",
        src: "/tshirt3.jpg",
        alt: "T-shirt design 3",
        stock: {
            s: 2,
            m: 3,
            l: 5,
            xl: 5,
            xxl: 7,
        },
    },
    {
        id: uuidv4(),
        name: "T-shirt design 4",
        gender: "mens",
        price: 2700,
        slug: "t-shirt-design-4",
        src: "/tshirt4.jpg",
        alt: "T-shirt design 4",
        stock: {
            s: 2,
            m: 3,
            l: 5,
            xl: 5,
            xxl: 7,
        },
    },
    {
        id: uuidv4(),
        name: "T-shirt design 5",
        gender: "mens",
        price: 2300,
        slug: "t-shirt-design-5",
        src: "/tshirt5.jpg",
        alt: "T-shirt design 5",
        stock: {
            s: 2,
            m: 3,
            l: 5,
            xl: 5,
            xxl: 7,
        },
    },
];

export const featureList = [
    { product: productList[0], alt: "Featured t-shirt 1" },
    { product: productList[1], alt: "Featured t-shirt 2" },
    { product: productList[2], alt: "Featured t-shirt 3" },
    { product: productList[3], alt: "Featured t-shirt 4" },
    { product: productList[4], alt: "Featured t-shirt 5" },
];
