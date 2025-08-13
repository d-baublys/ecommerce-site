import LoginSignUpForm from "@/ui/components/forms/LoginSignUpForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Create Account",
};

export default function CreateAccountPage() {
    return (
        <Suspense>
            <LoginSignUpForm variant="signup" />
        </Suspense>
    );
}
