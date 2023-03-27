"use client"
import { Button, Col, Divider, Form, Input, InputNumber, List, Modal, Row, Select, Space } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { Customer } from "./customers";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;
const { Search } = Input;

export default function CustomerPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAddDeviceModalVisible, setAddDeviceModalVisible] = useState<boolean>(false);

    const onSearch = () => {
        console.log(searchQuery);
    };


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
                        placeholder="Search Devices"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Col>
                <Col span={3} offset={8}>
                    <Button type="primary" onClick={() => setAddDeviceModalVisible(true)} size='large' icon={<PlusOutlined />} block> Add Device</Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]} >
                <Col span={20} offset={2}>
                    {/* <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 1,
                            md: 2,
                            lg: 3,
                            xl: 3,
                            xxl: 6,
                        }}
                        dataSource={devices}
                        renderItem={(item, index) => (
                            <DeviceCard device={item} key={index} />
                        )}
                    /> */}
                </Col>
            </Row>
            <AddCustomerModal customers={customers} setCustomers={setCustomers} isOpen={isAddDeviceModalVisible} setIsOpen={setAddDeviceModalVisible} />
        </>
    )
}

export interface AddCustomerModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setCustomers: (devices: Customer[]) => void;
    customers: Customer[];
}

const AddCustomerModal = ({ isOpen, setIsOpen, customers, setCustomers }: AddCustomerModalProps) => {
    const [form] = Form.useForm();
    const [isSubmitting, setSubmitting] = useState(false);
    const [promoCodeCount, setPromoCodeCount] = useState<number>(0);

    const resolvePromoCodes = () => {
        const promoCodeArray = [];

        for (let i = 0; i < promoCodeCount; i++) {
            promoCodeArray.push(
                <Row key={i} gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={`Promo Code ${i + 1}`}
                            name={`promoCode${i + 1}`}
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={"Discount in %"}
                            name={`promoCodeAmount${i + 1}`}
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                </Row>
            )
        }

        return promoCodeArray;
    }

    const resolvePromoCodeArray = (formValues: any) => {
        const promoCodeArray = [];
        let index = 1;

        while (formValues[`promoCode${index}`] in formValues) {
            promoCodeArray.push({
                id: index.toString(),
                code: formValues[`promoCode${index}`],
                discount: formValues[`promoCodeAmount${index}`]
            });
            index++;
        }

        return promoCodeArray;
    }

    const addDevice = (values: any) => {
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
            title="Add Device to the Marketplace"
            open={isOpen}
            okText="Add Device"
            onOk={() => form.submit()}
            onCancel={() => setIsOpen(false)}
            closable={false}
            confirmLoading={isSubmitting}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={addDevice}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Device Name"
                            name="deviceName"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Image URL"
                            name="imageUrl"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider dashed>Promo Codes</Divider>
                {resolvePromoCodes()}
                <Row gutter={16}>
                    <Col span={24}>
                        <Space>
                            <Button type="dashed" onClick={() => setPromoCodeCount(promoCodeCount + 1)} icon={<PlusOutlined />} block> Add Promo Code</Button>
                            <Button
                                type="dashed"
                                onClick={() => setPromoCodeCount(promoCodeCount - 1)}
                                icon={<PlusOutlined />}
                                disabled={promoCodeCount <= 0}
                                block
                                danger
                            >
                                Remove Promo Code
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
