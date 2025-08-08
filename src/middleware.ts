import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const config = {
    matcher: ["/admin/:path*"],
};

export default auth((req) => {
    const { pathname } = req.nextUrl;

    if (pathname === "/login") {
        return NextResponse.next();
    }

    if (!req.auth) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
});
