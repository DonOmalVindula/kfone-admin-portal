"use client"
import { Button, Col, Divider, Form, Input, InputNumber, List, Modal, Row, Select, Space, Table } from "antd"
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons"
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { Staff } from "./staff";
import { Role } from "../roles";

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;

export default function CustomersPage() {
    const [staff, setStaff] = useState<Staff[]>([{
        email: "john@wso2.com",
        password: "",
        role: Role.ADMIN
    }]);
    const [selectedStaff, setSelectedStaff] = useState<Staff>();
    const [searchHits, setSearchHits] = useState<Staff[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAddStaffModalVisible, setAddStaffModalVisible] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    useEffect(() => {
        // get Staffs
    }, []);

    useEffect(() => {
        onSearch();
    }, [searchQuery]);

    const onSearch = () => {
        const hits = staff.filter((item) => item.email.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchHits(hits);
    };

    const deleteUser = (staff: Staff) => {
        confirm({
            title: 'Do you want to delete this staff?',
            icon: <ExclamationCircleFilled />,
            content: "Staff Email: " + staff.email,
            onOk() {
                console.log('OK');
            }
        });
    }

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (text: string) => <span>{text.toUpperCase()}</span>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Staff) => (
                <Space size="middle">
                    <a
                        onClick={() => deleteUser(record)}
                    >
                        Delete
                    </a>
                </Space>
            )
        }
    ];


    return (
        <>
            <Row className="title-row">
                <Col span={20} offset={2}>
                    <h1>Manage Staff</h1>
                </Col>
            </Row>
            <Row className="search-row" gutter={[16, 16]}>
                <Col span={6} offset={2}>
                    <Search
                        placeholder="Search Staffs"
                        allowClear
                        size="large"
                        onSearch={onSearch}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Col>
                <Col span={4}>
                    <Button
                        type="primary"
                        onClick={() => {
                            setIsEditMode(false);
                            setAddStaffModalVisible(true)
                        }}
                        size='large'
                        icon={<PlusOutlined />}
                        block
                    > Add Staff</Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]} >
                <Col span={20} offset={2}>
                    <Table loading={isLoading} columns={columns} dataSource={searchHits} bordered />
                </Col>
            </Row>
            <AddStaffModal isOpen={isAddStaffModalVisible} setIsOpen={setAddStaffModalVisible} />
        </>
    )
}

export interface AddStaffModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AddStaffModal = ({ isOpen, setIsOpen }: AddStaffModalProps) => {
    const [form] = Form.useForm();

    const resolveAction = (values: any) => {
        console.log(values);
        
        // setSubmitting(true);
        // const tempDevices = [...devices];

        // const newDevice: Device = {
        //     id: (tempDevices.length + 1).toString(),
        //     name: values.deviceName,
        //     description: values.description,
        //     category: values.category,
        //     price: values.price,
        //     imageUrl: values.imageUrl,
        //     promoCodes: resolvePromoCodeArray(values)
        // }

        // tempDevices.push(newDevice);
        // setDevices(tempDevices);
        // setSubmitting(false);
        // setIsOpen(false);
    }

    return (
        <Modal
            title={"Add Staff to System"}
            open={isOpen}
            okText={"Add Staff"}
            onOk={() => form.submit()}
            onCancel={() => setIsOpen(false)}
            closable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={resolveAction}
                initialValues={
                    {
                        points: 0
                    }
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Required!' },
                                { type: 'email', message: 'Please enter a valid email address' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Staff Role"
                            name="role"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <Select>
                                <Option value={Role.ADMIN}>Administrator</Option>
                                <Option value={Role.SALES}>Sales Person</Option>
                                <Option value={Role.MARKETING}>Marketing</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="password"
                            name="password"
                            rules={[
                                { required: true, message: 'Required!' },
                                { min: 8, message: 'Password must be at least 8 characters long' }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>


            </Form>
        </Modal >
    )
}
