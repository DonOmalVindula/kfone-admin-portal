"use client"
import { Button, Col, Divider, Form, Input, InputNumber, List, Modal, Row, Select, Space, Table } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { PromoInterface } from "./promos";

const { Option } = Select;
const { Search } = Input;

export default function PromosPage() {
    const [promos, setPromos] = useState<PromoInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAddPromoModalVisible, setAddPromoModalVisible] = useState<boolean>(false);

    const onSearch = () => {
        console.log(searchQuery);
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
        },
    ];

    return (
        <>
            <Row className="title-row">
                <Col span={20} offset={2}>
                    <h1>Manage Promo Codes</h1>
                </Col>
            </Row>
            <Row className="search-row" gutter={[16, 16]}>
                <Col span={4} offset={2}>
                    <Button type="primary" onClick={() => setAddPromoModalVisible(true)} size='large' icon={<PlusOutlined />} block> Add Code</Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]} >
                <Col span={20} offset={2}>
                    <Table loading={isLoading} columns={columns} dataSource={promos} bordered />
                </Col>
            </Row>
            <AddPromoModal isOpen={isAddPromoModalVisible} setIsOpen={setAddPromoModalVisible} />
        </>
    )
}

export interface AddPromoModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AddPromoModal = ({ isOpen, setIsOpen }: AddPromoModalProps) => {
    const [form] = Form.useForm();
    const [isSubmitting, setSubmitting] = useState(false);
    const [promoCodeCount, setPromoCodeCount] = useState<number>(0);

    const addPromoCode = (values: any) => {
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
            title="Add Promo Code"
            open={isOpen}
            okText="Add Code"
            onOk={() => form.submit()}
            onCancel={() => setIsOpen(false)}
            closable={false}
            confirmLoading={isSubmitting}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={addPromoCode}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Promo Code"
                            name="promoCode"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
