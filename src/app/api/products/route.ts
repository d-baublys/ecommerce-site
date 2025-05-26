import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const [where, select] = [body.where, body.select];

    try {
        const products = await prisma.product.findMany({
            where,
            select,
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
