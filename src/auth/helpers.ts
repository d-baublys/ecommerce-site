"use server";

import { signIn as serverSignIn, signOut as serverSignOut } from ".";

type SignInServerParams = Parameters<typeof serverSignIn>;
type SignOutServerParams = Parameters<typeof serverSignOut>;

export async function signInServer(...params: SignInServerParams) {
    return await serverSignIn(...params);
}

export async function signOutServer(...params: SignOutServerParams) {
    return await serverSignOut(...params);
}
