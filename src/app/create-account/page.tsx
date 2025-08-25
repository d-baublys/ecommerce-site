import LoginSignUpPage from "@/ui/pages/LoginSignUpPage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Create Account",
};

export default function CreateAccountPage() {
    return (
        <Suspense>
            <LoginSignUpPage variant="signup" />
        </Suspense>
    );
}
