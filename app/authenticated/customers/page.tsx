"use client"
import { Button, Col, Divider, Form, Input, InputNumber, List, Modal, Row, Select, Space, Table, message } from "antd"
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons"
import { Customer, CustomerTier } from "./customers";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { AccessControl } from "@/app/common/accessControl";

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>();
    const [searchHits, setSearchHits] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAddCustomerModalVisible, setAddCustomerModalVisible] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    useEffect(() => {
        getCustomers();
    }, []);

    useEffect(() => {
        onSearch();
    }, [searchQuery]);

    const getCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/customer");
            const customers = response.data.Resources;                        
            
            setCustomers(customers);
            setSearchHits(customers);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            message.error("Error fetching customers");
            setIsLoading(false);
        }
    }

    const onSearch = () => {
        const hits = customers.filter((customer) => customer.emails[0].toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchHits(hits);
    };

    const deleteUser = (customer: any) => {
        confirm({
            title: 'Do you want to delete this customer?',
            icon: <ExclamationCircleFilled />,
            content: "Customer Email: " + customer.emails[0],
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
            render : (text: string, record: any) => <span>{record.emails[0]}</span>
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render : (text: string, record: any) => <span>{`${record.name.givenName ?? ""} ${record.name.familyName ?? ""}`}</span>
        },
        {
            title: 'Tier',
            dataIndex: 'tier',
            key: 'tier',
            render: (text: string, record: any) => <span>{record["urn:scim:wso2:schema"]?.tier?.toUpperCase()}</span>
        },
        {
            title: 'Points',
            dataIndex: 'tierPoints',
            key: 'tierPoints',
            render: (text: string, record: any) => <span>{record["urn:scim:wso2:schema"]?.tierPoints}</span>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Customer) => (
                <Space size="middle">
                    <AccessControl
                        allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:update-user"]}
                    >
                        <a
                            onClick={() => {
                                setIsEditMode(true);
                                setSelectedCustomer(record);
                                setAddCustomerModalVisible(true);
                            }}
                        >
                            Edit
                        </a>
                    </AccessControl>
                    <AccessControl
                        allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:delete-user"]}
                    >    
                        <a
                            onClick={() => deleteUser(record)}
                        >
                            Delete
                        </a>
                    </AccessControl>
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
                <Col span={8} offset={2}>
                    <Search
                        placeholder="Search Customers"
                        allowClear
                        size="large"
                        onSearch={onSearch}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Col>
                <AccessControl
                    allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:create-user"]}
                >
                    <Col lg={4} md={6}>
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
                </AccessControl>
            </Row>
            <Row gutter={[16, 16]} >
                <Col span={20} offset={2}>
                    <Table loading={isLoading} columns={columns} dataSource={searchHits} bordered />
                </Col>
            </Row>
            <AddCustomerModal
                getCustomers={getCustomers}
                isOpen={isAddCustomerModalVisible}
                setIsOpen={setAddCustomerModalVisible}
                isEditMode={isEditMode}
                selectedCustomer={selectedCustomer}
            />
        </>
    )
}

export interface AddCustomerModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isEditMode?: boolean;
    selectedCustomer?: any;
    getCustomers: () => void;
}

const AddCustomerModal = ({ isOpen, setIsOpen, isEditMode, getCustomers, selectedCustomer }: AddCustomerModalProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedCustomer) {
            form.setFieldValue("tierPoints",  selectedCustomer["urn:scim:wso2:schema"]?.tierPoints);
            form.setFieldValue("tier", selectedCustomer["urn:scim:wso2:schema"]?.tier);
        }
    }, [selectedCustomer]);

    const resolveAction = async (values: any) => {
        try {
            if (isEditMode) {
                console.log('edit customer');
                const processedValues = {
                    ...values,
                    tierPoints: values.tierPoints.toString(),
                    userId: selectedCustomer.id
                }
                await axios.patch("/api/customer", processedValues);

                setIsOpen(false);
                getCustomers();
            } else {
                console.log('add customer');
                const processedValues = {
                    ...values,
                    tierPoints: values.tierPoints.toString(),
                    userId: selectedCustomer.id
                }
                await axios.post("/api/customer", processedValues);

                setIsOpen(false);
                getCustomers();
            }
        } catch (error) {
            console.log(error);
            setIsOpen(false);
        }
    }

    const changeCustomerPoints = (value: string) => {
        if (value === CustomerTier.NONE) {
            form.setFieldValue("tierPoints", 0);
        }

        if (value === CustomerTier.SILVER) {
            form.setFieldValue("tierPoints", 150);
        }

        if (value === CustomerTier.GOLD) {
            form.setFieldValue("tierPoints", 300);
        }

        if (value === CustomerTier.PLATINUM) {
            form.setFieldValue("tierPoints", 500);
        }

        form.validateFields(["tierPoints"]);
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
                        tierPoints: selectedCustomer && selectedCustomer["urn:scim:wso2:schema"]?.tierPoints,
                    }
                }
            >
                {
                    !isEditMode && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="First Name"
                                    name="givenName"
                                    rules={[{ required: true, message: 'Required!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Last Name"
                                    name="familyName"
                                    rules={[{ required: true, message: 'Required!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Email"
                                    name="username"
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
                            name="tierPoints"
                            rules={[
                                { required: true, message: 'Required!' },
                                {
                                    message: 'Points should not be negative',
                                    validator: (_, value) => {
                                        if (value < 0) {
                                            return Promise.reject('Points should not be negative');
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                },
                                {
                                    validator: (_, value) => {
                                        if ((form.getFieldValue("tier") === CustomerTier.NONE) && value >= 150) {
                                            return Promise.reject('Points should be less than 150');
                                        } else if ((form.getFieldValue("tier") === CustomerTier.SILVER) && (value >= 300 || value < 150)) {
                                            return Promise.reject('Points should be 150 - 300');
                                        } else if ((form.getFieldValue("tier") === CustomerTier.GOLD) && (value >= 500 || value < 300)) {
                                            return Promise.reject('Points should be 300 - 500');
                                        } else if ((form.getFieldValue("tier") === CustomerTier.PLATINUM) && value < 500) {
                                            return Promise.reject('Points should be greater than 500');
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                }
                            ]}
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
                            <Select
                                onChange={(value) => changeCustomerPoints(value)}
                            >
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
