import LoginSignUpPage from "@/ui/pages/LoginSignUpPage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Log In",
};

export default function LoginPage() {
    return (
        <Suspense>
            <LoginSignUpPage variant="login" />
        </Suspense>
    );
}
