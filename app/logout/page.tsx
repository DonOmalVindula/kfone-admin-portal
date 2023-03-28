"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
    const { push } = useRouter();
    const { status } = useSession();

    useEffect(() => {
        console.log("Logging out...", status);

        push("/");

    }, []);

    return <p>Logging out...</p>;
}
