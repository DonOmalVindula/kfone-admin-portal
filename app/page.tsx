/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Component() {
    const { data, status }: any = useSession();
    const { push } = useRouter();

    useEffect(() => {
        console.log("Logging in...", status);

        if (status === 'unauthenticated') {
            signIn("asgardeo");
        } else if (status === 'authenticated') {
            const userGroup = data?.user?.groups;

            console.log("User group: ", userGroup);
            if (userGroup) {

                if (userGroup.includes("Admin")) {
                    push("authenticated/devices")
                }
                if (userGroup.includes("Sales")) {
                    push("authenticated/devices")
                }
                if (userGroup.includes("Marketing")) {
                    push("authenticated/sales")
                }
            }
        }
    }, [status])

    return null;
}