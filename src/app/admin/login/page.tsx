import { Metadata } from "next";
import AdminLoginPageClient from "./AdminLoginPageClient";

export const metadata: Metadata = {
    title: "Log In",
};

export default function AdminLoginPage() {
    return <AdminLoginPageClient />;
}
