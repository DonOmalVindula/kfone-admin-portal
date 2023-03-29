"use client"
import { Button, Col, Divider, Form, Input, InputNumber, List, Modal, Row, Select, Space, Table, message } from "antd"
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import { PromoInterface } from "./promos";
import axios from "axios";
import { AccessControl } from "@/app/common/accessControl";

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;

export default function PromosPage() {
    const [promos, setPromos] = useState<PromoInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAddPromoModalVisible, setAddPromoModalVisible] = useState<boolean>(false);

    useEffect(() => {
        getPromos();
    }, []);

    const getPromos = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_DEPLOY_URL  + "/api/promos");
            setPromos(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const deletePromo = (id?: string) => {
        console.log(id);
        confirm({
            title: 'Are you sure you want to delete this promo code?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                await axios.delete(process.env.NEXT_PUBLIC_DEPLOY_URL  + "/api/promos", { data: { id } });
                getPromos();
            }
        });
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'promoCode',
            key: 'promoCode',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: PromoInterface) => (
                <Space size="middle">
                    <AccessControl
                        allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:delete-promo"]}
                    >
                        <a onClick={() => deletePromo(record.id)}>Delete</a>
                    </AccessControl>
                </Space>
            ),
        },
    ];

    return (
        <AccessControl
            allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:view-promos"]}
        >
            <Row className="title-row">
                <Col span={20} offset={2}>
                    <h1>Manage Promo Codes</h1>
                </Col>
            </Row>
            <AccessControl
                allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:create-promo"]}
            >
                <Row className="search-row" gutter={[16, 16]}>
                    <Col lg={4} md={6} offset={2}>
                        <Button type="primary" onClick={() => setAddPromoModalVisible(true)} size='large' icon={<PlusOutlined />} block> Add Code</Button>
                    </Col>
                </Row>
            </AccessControl>
            <Row gutter={[16, 16]} >
                <Col span={20} offset={2}>
                    <Table loading={isLoading} columns={columns} dataSource={promos} bordered />
                </Col>
            </Row>
            <AddPromoModal isOpen={isAddPromoModalVisible} setIsOpen={setAddPromoModalVisible} getPromos={getPromos}/>
        </AccessControl>
    )
}

export interface AddPromoModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    getPromos: () => void;
}

const AddPromoModal = ({ isOpen, setIsOpen, getPromos }: AddPromoModalProps) => {
    const [form] = Form.useForm();

    const addPromoCode = async (values: any) => {
        try {
            await axios.post(process.env.NEXT_PUBLIC_DEPLOY_URL  + "/api/promos", values);
            getPromos();
            setIsOpen(false);
        } catch (error) {
            console.log(error);
            message.error("Error adding promo code");
        }
    }

    return (
        <Modal
            title="Add Promo Code"
            open={isOpen}
            okText="Add Code"
            onOk={() => form.submit()}
            onCancel={() => setIsOpen(false)}
            closable={false}
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
