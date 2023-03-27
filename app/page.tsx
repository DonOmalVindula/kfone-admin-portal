/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Component() {
    const { data: session, status } = useSession();
    const { push } = useRouter();


    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn();
        } else if (status === 'authenticated') {
            push('/authenticated/devices');
        }
    }, [session, status])
    
    return null;
}