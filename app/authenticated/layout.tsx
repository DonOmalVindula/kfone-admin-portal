"use client"
import { Button, Menu, MenuProps } from "antd"
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "../common/loadingSpinner";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { data, status  }: any = useSession();
    const { push } = useRouter();

    console.log(data);
    console.log(process.env.NEXT_PUBLIC_ASGARDEO_ORGANIZATION_NAME);
    
    
    
    const items: MenuProps['items'] = [
        {
            label: 'Devices',
            key: 'authenticated/devices',
            icon: <MailOutlined />,
        },
        {
            label: 'Customers',
            key: 'authenticated/customers',
            icon: <AppstoreOutlined />,
        },
        {
            label: 'Staff',
            key: 'authenticated/staff',
            icon: <SettingOutlined />,
        },
    ];

    const [current, setCurrent] = useState('authenticated/devices');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        push(e.key);
    };

    const testSignOut = async () => {
        if (data) {
            try {
                signOut();
                // Add the id_token_hint to the query string
                const params = new URLSearchParams();
                params.append('token', data?.access_token);
                // params.append('post_logout_redirect_uri', process.env.NEXT_PUBLIC_ASGARDEO_POST_LOGOUT_REDIRECT_URI ?? "");
                params.append('token_type_hint', "access_token");

                const requestConfig: AxiosRequestConfig = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID}:${process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET}`).toString('base64')}`
                    }
                }
    
                const { status, statusText } = await axios.post(
                    `https://api.asgardeo.io/t/${process.env.NEXT_PUBLIC_ASGARDEO_ORGANIZATION_NAME}/oauth2/revoke?${params.toString()}`,
                    {},
                    requestConfig
                    );
    
                // The response body should contain a confirmation that the user has been logged out
                console.log("Completed post-logout handshake", status, statusText);
            }
            catch (e: any) {
                console.error("Unable to perform post-logout handshake", (e as AxiosError)?.code || e)
            }
        }
    }

    if (status === 'unauthenticated') {
        push('/');
    }

    return (
        status === "loading"
            ? <LoadingSpinner /> : (
                <>
                    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
                        <Button className="sign-out-btn" type="dashed" danger onClick={() => testSignOut()}>Sign out</Button>
                    <main>{children}</main>
                </>
            )
    )
}