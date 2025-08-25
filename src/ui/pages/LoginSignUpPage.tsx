"use client";

import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import GoButton from "@/ui/components/buttons/GoButton";
import LogInInput from "@/ui/components/forms/LogInInput";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import ConstrainedLayout from "@/ui/layouts/ConstrainedLayout";
import { createUser } from "@/lib/actions";
import SignUpModal from "@/ui/components/overlays/SignUpModal";

export default function LoginSignUpPage({ variant }: { variant: "login" | "signup" }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inSubmitState, setInSubmitState] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect_after");

    const handleLogIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setInSubmitState(true);

        if (!(email && password)) return;

        const response = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (!response?.error) {
            router.push(redirectPath ? `/${redirectPath}?from_login=true` : "/");
        } else {
            if (response?.error === "CredentialsSignin") {
                setError("Incorrect email address or password. Please try again.");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setInSubmitState(true);

        if (!(email && password && confirmedPassword)) return;

        if (password !== confirmedPassword) {
            setError("Your passwords do not match.");
            return;
        }

        try {
            await createUser(email, password);
            setIsModalOpen(true);
        } catch (error) {
            if (error instanceof Error && error.name === "CredentialsError") {
                setError(error.message as string);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <ConstrainedLayout
            subheaderText={`${variant === "login" ? "Log In" : "Create Account"}`}
            noCrumbs
        >
            <div className="flex grow w-full">
                <form
                    onSubmit={variant === "login" ? handleLogIn : handleSignUp}
                    className={`flex flex-col w-full px-8 py-4 transition h-min`}
                >
                    <div className="flex flex-col w-full gap-8 mt-8">
                        <LogInInput
                            name="email"
                            labelText="Email address"
                            isPasswordInput={false}
                            value={email}
                            showRedOverride={inSubmitState && !email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <LogInInput
                            name="password"
                            type="password"
                            labelText="Password"
                            isPasswordInput={true}
                            value={password}
                            showRedOverride={inSubmitState && !password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {variant === "signup" && (
                            <LogInInput
                                name="password-confirm"
                                type="password"
                                labelText="Confirm Password"
                                isPasswordInput={true}
                                value={confirmedPassword}
                                showRedOverride={inSubmitState && !confirmedPassword}
                                onChange={(e) => setConfirmedPassword(e.target.value)}
                            />
                        )}
                    </div>
                    <div className="shrink-0 mt-12">
                        <GoButton
                            type="submit"
                            disabled={false}
                            predicate={true}
                            overrideClasses="!px-12 !py-4 !bg-component-color !text-white"
                        >
                            {variant === "login" ? "Log In" : "Create Account"}
                        </GoButton>
                        {variant === "login" ? (
                            <div className="mt-6 text-center text-sz-label-button lg:text-sz-label-button-lg">
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
            {isModalOpen && (
                <SignUpModal isOpenState={isModalOpen} handleClose={() => setIsModalOpen(false)} />
            )}
        </ConstrainedLayout>
    );
}
