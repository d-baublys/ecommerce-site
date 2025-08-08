import LoginSignUpForm from "@/ui/components/forms/LoginSignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log In",
};

export default function LoginPage() {
    return <LoginSignUpForm variant="login" />;
}
