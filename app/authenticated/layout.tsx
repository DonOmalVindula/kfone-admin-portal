"use client"
import { Button, Menu, MenuProps } from "antd"
import { AppstoreOutlined, MailOutlined, SettingOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "../common/loadingSpinner";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";
import { decode, getToken } from "next-auth/jwt";
import { Role } from "./roles";


export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { data, status }: any = useSession();
    const { push } = useRouter();
    const [userRole, setUserRole] = useState<Role>(Role.ADMIN);
    const [current, setCurrent] = useState('authenticated/devices');

    useEffect(() => {        
        const userGroup = data?.user?.groups;

        console.log("User group: ", userGroup);
        if (userGroup) {
            
            if (userGroup.includes("Admin")) {
                setUserRole(Role.ADMIN);
                push("authenticated/devices")
            }
            if (userGroup.includes("Sales")) {
                setUserRole(Role.SALES);
                push("authenticated/devices")
            }
            if (userGroup.includes("Marketing")) {
                setUserRole(Role.MARKETING);
                push("authenticated/sales")
            }
        }
        
    }, []);

    useEffect(() => {
        setCurrent(window.location.pathname);
        console.log("Current: ", window.location.pathname);
        
    }, []);

    let items: MenuProps['items'] = [];

    if (userRole === Role.ADMIN) {
        items = [
            {
                label: 'Devices',
                key: 'authenticated/devices',
                icon: <PhoneOutlined />,
            },
            {
                label: 'Customers',
                key: 'authenticated/customers',
                icon: <UserOutlined />,
            },
            // {
            //     label: 'Staff',
            //     key: 'authenticated/staff',
            //     icon: <SettingOutlined />,
            // },
            {
                label: 'Promos',
                key: 'authenticated/promos',
                icon: <AppstoreOutlined />,
            },
        ];
    }

    if (userRole === Role.SALES) {
        items = [
            {
                label: 'Devices',
                key: 'authenticated/devices',
                icon: <PhoneOutlined />,
            },
            {
                label: 'Customers',
                key: 'authenticated/customers',
                icon: <UserOutlined />,
            },
            {
                label: 'Promos',
                key: 'authenticated/promos',
                icon: <AppstoreOutlined />,
            },
            {
                label: 'Stats',
                key: 'authenticated/stats',
                icon: <SettingOutlined />,
            },
        ];
    }

    if (userRole === Role.MARKETING) {
        items = [
            {
                label: 'Dashboard',
                key: 'authenticated/sales',
                icon: <MailOutlined />,
            }
            // {
            //     label: 'Customers',
            //     key: 'authenticated/customers',
            //     icon: <AppstoreOutlined />,
            // },
            // {
            //     label: 'Promos',
            //     key: 'authenticated/promos',
            //     icon: <SettingOutlined />,
            // },
            // {
            //     label: 'Staff',
            //     key: 'authenticated/staff',
            //     icon: <SettingOutlined />,
            // },
        ];
    }


    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        push(e.key);
    };

    const testSignOut = async () => {
        push("api/auth/federated-sign-out");
        // signOut();
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