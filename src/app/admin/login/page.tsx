"use client";

import FormInput from "@/ui/components/FormInput";
import RoundedButton from "@/ui/components/RoundedButton";
import BareLayout from "@/ui/layouts/BareLayout";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        if (!response?.error) {
            router.push("/admin");
        } else {
            if (response?.error === "CredentialsSignin") {
                setError("Invalid credentials");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <BareLayout>
            <form
                onSubmit={handleLogIn}
                className={`flex flex-col justify-center items-center w-full px-8 py-4 bg-background-lightest rounded-2xl transition ${
                    error ? "h-80" : "h-[280px]"
                } `}
            >
                <div className="flex flex-col w-full gap-4">
                    <FormInput
                        required
                        legend="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FormInput
                        type="password"
                        required
                        legend="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="shrink-0 mt-8">
                    <RoundedButton type="submit">Log In</RoundedButton>
                </div>
                <div className="flex flex-col items-center mt-4 text-red-600">
                    {error && (
                        <>
                            <IoWarningOutline size={24} />
                            <p>Incorrect username or password</p>
                        </>
                    )}
                </div>
            </form>
        </BareLayout>
    );
}
