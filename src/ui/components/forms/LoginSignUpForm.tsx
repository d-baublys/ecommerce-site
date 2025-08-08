"use client";

import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import GoButton from "../buttons/GoButton";
import LogInInput from "./LogInInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import ConstrainedLayout from "@/ui/layouts/ConstrainedLayout";
import { createUser } from "@/lib/actions";

export default function LoginSignUpForm({ variant }: { variant: "login" | "signup" }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (!response?.error) {
            router.push("/");
        } else {
            if (response?.error === "CredentialsSignin") {
                setError("Incorrect email address or password. Please try again.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await createUser(email, password);

        if (response.success) {
            router.push("/login");
        } else if (response.message) {
            setError(response.message);
        } else {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <ConstrainedLayout subheaderText={`${variant === "login" ? "Log In" : "Create Account"}`} noCrumbs>
            <div className="flex grow w-full">
                <form
                    onSubmit={variant === "login" ? handleLogIn : handleSignUp}
                    className={`flex flex-col w-full px-8 py-4 transition h-min`}
                >
                    <div className="flex flex-col w-full gap-8 mt-8">
                        <LogInInput
                            name="email-address"
                            type="email"
                            labelText="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <LogInInput
                            name="password"
                            type="password"
                            labelText="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="shrink-0 mt-12">
                        <GoButton
                            type="submit"
                            disabled={!(email && password)}
                            predicate={!!(email && password)}
                            overrideClasses="!px-12 !py-4 !bg-component-color !text-white"
                        >
                            {variant === "login" ? "Log In" : "Create Account"}
                        </GoButton>
                        {variant === "login" ? (
                            <div className="mt-6 text-center">
                                <span>{"Don't have an account? "}</span>
                                <Link href={"/create-account"} className="underline font-semibold">
                                    {"Click here to create one."}
                                </Link>
                            </div>
                        ) : null}
                    </div>
                    <div
                        className={`flex flex-col items-center text-white transition ${
                            error ? "opacity-100" : "opacity-0"
                        } ${variant === "login" ? "mt-6" : "mt-12"}`}
                    >
                        {error && (
                            <div className="flex items-center w-full p-2 bg-red-400 rounded-sm text-sz-label-button lg:text-sz-label-button-lg">
                                <IoWarningOutline size={24} className="mr-2" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </ConstrainedLayout>
    );
}
