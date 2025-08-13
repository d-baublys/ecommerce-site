import LoginSignUpForm from "@/ui/components/forms/LoginSignUpForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Log In",
};

export default function LoginPage() {
    return (
        <Suspense>
            <LoginSignUpForm variant="login" />
        </Suspense>
    );
}
