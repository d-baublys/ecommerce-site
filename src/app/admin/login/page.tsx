"use client";

import GoButton from "@/ui/components/GoButton";
import LogInInput from "@/ui/components/LogInInput";
import RoundedButton from "@/ui/components/RoundedButton";
import AdminLayout from "@/ui/layouts/AdminLayout";
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
                setError("Incorrect username or password. Please try again.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <AdminLayout noCrumbs>
            <div className="flex grow w-full">
                <form
                    onSubmit={handleLogIn}
                    className={`flex flex-col w-full px-8 py-4 transition h-min`}
                >
                    <div className="flex flex-col w-full gap-8 mt-8">
                        <LogInInput
                            labelText="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <LogInInput
                            type="password"
                            labelText="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="shrink-0 mt-12">
                        <GoButton
                            type="submit"
                            disabled={!(username && password)}
                            predicate={!!(username && password)}
                            overrideClasses="!px-12 !py-4 !bg-component-color !text-white"
                        >
                            Log In
                        </GoButton>
                    </div>
                    <div
                        className={`flex flex-col items-center mt-12 text-white transition ${
                            error ? "opactiy-100" : "opacity-0"
                        }`}
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
        </AdminLayout>
    );
}
