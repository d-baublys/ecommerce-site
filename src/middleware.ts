import NextAuth from "next-auth";
import baseAuthConfig from "./auth/auth.config";

export const config = {
    matcher: ["/admin/:path*"],
};

const { auth } = NextAuth(baseAuthConfig);

export default auth((req) => {
    if (req.auth?.user?.role !== "admin") {
        return Response.redirect(new URL("/login", req.url));
    }
});
