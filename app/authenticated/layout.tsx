"use client"
import { Button, Menu, MenuProps } from "antd"
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "../common/loadingSpinner";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status  } = useSession();
    const { push } = useRouter();

    console.log();
    
    
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

    if (status === 'unauthenticated') {
        push('/');
    }

    return (
        status === "loading"
            ? <LoadingSpinner /> : (
                <>
                    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
                        <Button className="sign-out-btn" type="dashed" danger onClick={() => signOut({callbackUrl: "http://localhost:3000" })}>Sign out</Button>
                    <main>{children}</main>
                </>
            )
    )
}