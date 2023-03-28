"use client"
import { Button, Col, Divider, Form, Input, InputNumber, List, Modal, Row, Select, Space, Table } from "antd"
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons"
import { Customer, CustomerTier } from "./customers";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([{
        name: "John Doe",
        email: "john@wso2.com",
        password: "",
        tier: CustomerTier.NONE,
        points: 0
    }]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
    const [searchHits, setSearchHits] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAddCustomerModalVisible, setAddCustomerModalVisible] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    useEffect(() => {
        // get customers
    }, []);

    useEffect(() => {
        onSearch();
    }, [searchQuery]);

    const onSearch = () => {
        const hits = customers.filter((customer) => customer.email.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchHits(hits);
    };

    const deleteUser = (customer: Customer) => {
        confirm({
            title: 'Do you want to delete this customer?',
            icon: <ExclamationCircleFilled />,
            content: "Customer Email: " + customer.email,
            onOk() {
                console.log('OK');
            }
        });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Tier',
            dataIndex: 'tier',
            key: 'tier',
            render: (text: string) => <span>{text.toUpperCase()}</span>
        },
        {
            title: 'Points',
            dataIndex: 'points',
            key: 'points',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Customer) => (
                <Space size="middle">
                    <a 
                        onClick={() => {
                            setIsEditMode(true);
                            setSelectedCustomer(record);
                            setAddCustomerModalVisible(true);
                        }}
                    >
                        Edit
                    </a>
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
                    <h1>Manage Customers</h1>
                </Col>
            </Row>
            <Row className="search-row" gutter={[16, 16]}>
                <Col span={6} offset={2}>
                    <Search
                        placeholder="Search Customers"
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
                            setAddCustomerModalVisible(true)
                        }} 
                        size='large' 
                        icon={<PlusOutlined />} 
                        block
                    > Add Customer</Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]} >
                <Col span={20} offset={2}>
                    <Table loading={isLoading} columns={columns} dataSource={searchHits} bordered />
                </Col>
            </Row>
            <AddCustomerModal isOpen={isAddCustomerModalVisible} setIsOpen={setAddCustomerModalVisible} isEditMode={isEditMode} selectedCustomer={selectedCustomer} />
        </>
    )
}

export interface AddCustomerModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isEditMode?: boolean;
    selectedCustomer?: Customer;
}

const AddCustomerModal = ({ isOpen, setIsOpen, isEditMode }: AddCustomerModalProps) => {
    const [form] = Form.useForm();

    const resolveAction = (values: any) => {
        if (isEditMode) {
            console.log(values);
        } else {
            console.log(values);
        }
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
            title={isEditMode ? "Edit Customer" : "Add Customer to System"}
            open={isOpen}
            okText={isEditMode ? "Edit Customer" : "Add Customer"}
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
                {
                    !isEditMode && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Required!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
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
                    )
                }
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Loyalty Points"
                            name="points"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Customer Tier"
                            name="tier"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <Select>
                                <Option value={CustomerTier.NONE}>None</Option>
                                <Option value={CustomerTier.SILVER}>Silver</Option>
                                <Option value={CustomerTier.GOLD}>Gold</Option>
                                <Option value={CustomerTier.PLATINUM}>Platinum</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
