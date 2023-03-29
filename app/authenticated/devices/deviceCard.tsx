"use client"
import { Avatar, Card, Col, Collapse, Form, Image, Input, InputNumber, Modal, Row, Select, Typography, message, theme } from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined, PhoneOutlined, TabletOutlined, ClockCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import { Device, DeviceCategory } from "./devices";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { AccessControl } from "@/app/common/accessControl";
import { PromoInterface } from "../promos/promos";
import axios from "axios";

const { confirm } = Modal;
const { Panel } = Collapse;
const { Text } = Typography;


interface DeviceCardProps {
    device: Device,
    deleteDevice?: (id: string) => void,
    editDevice?: (id: string) => void
    getDevices?: () => void,
    promos?: PromoInterface[]
}

export default function DeviceCard({ device, promos, getDevices }: DeviceCardProps) {
    const [isEditDeviceModalVisible, setEditDeviceModalVisible] = useState<boolean>(false);
    const [isPromoModalVisible, setPromoModalVisible] = useState<boolean>(false);

    const resolveAvatarIcon = () => {
        switch (device.category) {
            case DeviceCategory.PHONE:
                return <PhoneOutlined />;
            case DeviceCategory.TABLET:
                return <TabletOutlined />;
            default:
                return <ClockCircleOutlined />;
        }
    }

    const deleteDevice = () => {
        confirm({
            title: 'Do you want to delete this item?',
            icon: <ExclamationCircleFilled />,
            content: "Device Name: " + device.name,
            async onOk() {
                try {
                    await axios.delete(`/api/device`, {
                        data: {
                            deviceId: device.id
                        }
                    });
                    getDevices && getDevices();
                } catch (error) {
                    console.log(error);
                    message.error("Error deleting device");
                }
            }
        });
    }

    return (
        <>
            <Card
                className="device-card"
                cover={
                    // eslint-disable-next-line @next/next/no-img-element
                    <Image
                        alt="example"
                        src={device.imageUrl}
                        height={250}
                        className="device-image"
                        fallback="data:image/png;base64,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"
                    />
                }
                actions={[
                    // <AccessControl key="1" allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:edit-devices"]}>
                    //     <EditOutlined key="edit" onClick={() => setEditDeviceModalVisible(true)} />
                    // </AccessControl>,
                    <AccessControl key="2" allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:delete-device"]}>
                        <DeleteOutlined key="delete" onClick={() => deleteDevice()} />
                    </AccessControl>,
                    <AccessControl key="3" allowedScopes={["urn:kfonenextjsdemo:kfoneadminapis:update-device-promo"]}>
                        <PlusOutlined key="addPromo" onClick={() => setPromoModalVisible(true)} />
                    </AccessControl>,
                
                ]}
            >
                <Meta
                    avatar={<Avatar icon={resolveAvatarIcon()} />}
                    title={device.name}
                    description={device.promos
                        ? <>
                            <Text type="secondary" delete> $ {device.price}</Text> <Text strong>$ {device.price! - device.promos.discount}</Text>
                        </> :
                        <>
                            $ {device.price}
                        </>
                    }
                />
                <Collapse
                    style={{ backgroundColor: "#f1f1f1", marginTop: "1rem" }}
                    ghost
                >
                    <Panel header="Description" key="1">
                        <p>{device.description}</p>
                    </Panel>
                </Collapse>
            </Card>
            <EditDeviceModal device={device} isOpen={isEditDeviceModalVisible} setIsOpen={setEditDeviceModalVisible} />
            <AddPromoModal getDevices={getDevices} promos={promos} device={device} isOpen={isPromoModalVisible} setIsOpen={setPromoModalVisible} />
        </>
    )
}

export interface AddDeviceModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    device: Device;
    promos?: any[];
    getDevices?: () => void;
}

const AddPromoModal = ({ isOpen, setIsOpen, device, promos, getDevices }: AddDeviceModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // change the attribute value of the promos array
        // to be the value of the select option        
        promos && promos.map((promo) => {
            promo.value = promo.id;
            promo.label = `${promo.promoCode} - ($${promo.discount})`;
        })
    }, [promos])

    const addPromoCode = async (values: any) => {
        setLoading(true);
        try {
            await axios.patch(process.env.NEXT_PUBLIC_DEPLOY_URL  + "/api/device", {
                deviceId: device.id,
                promoCodeId: values.promoCode,
                existingPromoCodeId: device.promos?.id
            })
            setIsOpen(false);
            getDevices && getDevices();
        } catch (error) {
            console.log(error);
            message.error("Error adding promo code to device");     
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <Modal
            title="Add Promo"
            open={isOpen}
            okText="Add"
            onOk={() => form.submit()}
            onCancel={() => setIsOpen(false)}
            closable={false}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={addPromoCode}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Add Promo Code for Device"
                            name="promoCode"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <Select options={promos}  />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export interface AddDeviceModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    device: Device;
}

const EditDeviceModal = ({ isOpen, setIsOpen, device }: AddDeviceModalProps) => {
    const [form] = Form.useForm();

    const editDevice = (values: any) => {
        console.log(values);

    }

    return (
        <Modal
            title="Edit Device"
            open={isOpen}
            okText="Edit"
            onOk={() => form.submit()}
            onCancel={() => setIsOpen(false)}
            closable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={editDevice}
                initialValues={
                    {
                        description: device.description,
                        price: device.price,
                    }
                }
            >
                <Row gutter={16}>
                    <Col span={24}>
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
            </Form>
        </Modal>
    )
}
