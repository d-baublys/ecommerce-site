import LoginSignUpForm from "@/ui/components/forms/LoginSignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Account",
};

export default function CreateAccountPage() {
    return <LoginSignUpForm variant="signup" />;
}
