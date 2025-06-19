import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const config = {
    matcher: ["/admin/:path*"],
};

export default auth((req) => {
    const { pathname } = req.nextUrl;

    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    if (!req.auth) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
});
