"use client"
import { Button, Col, Divider, Form, Input, InputNumber, List, Modal, Row, Select, Space } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import DeviceCard from "./deviceCard"
import { Device, DeviceCategory } from "./devices";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import axios, { AxiosRequestConfig } from "axios";
import { useSession } from "next-auth/react";

const { Option } = Select;
const { Search } = Input;

export default function DevicePage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [searchHits, setSearchHits] = useState<Device[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchFilter, setSearchFilter] = useState(DeviceCategory.PHONE);
    const [isAddDeviceModalVisible, setAddDeviceModalVisible] = useState<boolean>(false);
    const { data }: any = useSession();


    useEffect(() => {
        getDevices();
    }, []);


    useEffect(() => {
        onSearch();
    }, [searchQuery]);

    const onSearch = () => {
        // implement search on the devices array by name
        const hits = devices.filter((device) => device.name.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchHits(hits);
    };

    const handleFilterChange = (value: string) => {
        setSearchFilter(value as DeviceCategory);
    };

    const getDevices = async () => {
        const token = data?.access_token;

        const requestConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/devices`, requestConfig);
            setDevices(response.data);
            setSearchHits(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Row className="title-row">
                <Col span={20} offset={2}>
                    <h1>Manage Devices</h1>
                </Col>
            </Row>
            <Row className="search-row" gutter={[16, 16]}>
                <Col lg={6} md={8} offset={2}>
                    <Search
                        placeholder="Search Devices"
                        allowClear
                        size="large"
                        onSearch={onSearch}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Col>
                <Col lg={4} md={6}>
                    <Select size="large" defaultValue={DeviceCategory.PHONE} style={{ width: "100%" }} onChange={handleFilterChange}>
                        <Option value={DeviceCategory.PHONE} >Phones</Option>
                        <Option value={DeviceCategory.TABLET}>Tablets</Option>
                        <Option value={DeviceCategory.WEARABLE}>Wearables</Option>
                    </Select>
                </Col>
                <Col lg={4} md={6}>
                    <Button type="primary" onClick={() => setAddDeviceModalVisible(true)} size='large' icon={<PlusOutlined />} block> Add Device</Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]} >
                <Col span={20} offset={2}>
                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 1,
                            md: 2,
                            lg: 3,
                            xl: 3,
                            xxl: 6,
                        }}
                        dataSource={searchHits}
                        renderItem={(item, index) => (
                            <DeviceCard device={item} key={index} />
                        )}
                    />
                </Col>
            </Row>
            <AddDeviceModal devices={devices} setDevices={setDevices} isOpen={isAddDeviceModalVisible} setIsOpen={setAddDeviceModalVisible} />
        </>
    )
}

export interface AddDeviceModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setDevices: (devices: Device[]) => void;
    devices: Device[];
}

const AddDeviceModal = ({ isOpen, setIsOpen, devices, setDevices }: AddDeviceModalProps) => {
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

    const addDevice = (values: any) => {
        setSubmitting(true);
        const tempDevices = [...devices];

        const newDevice: Device = {
            id: (tempDevices.length + 1).toString(),
            name: values.deviceName,
            description: values.description,
            category: values.category,
            price: values.price,
            imageUrl: values.imageUrl,
        }

        tempDevices.push(newDevice);
        setDevices(tempDevices);
        setSubmitting(false);
        setIsOpen(false);
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
                            label="Device Category"
                            name="category"
                            rules={[{ required: true, message: 'Required!' }]}
                        >
                            <Select placeholder="Select the device type">
                                <Option value={DeviceCategory.PHONE} >Phone</Option>
                                <Option value={DeviceCategory.TABLET}>Tablet</Option>
                                <Option value={DeviceCategory.WEARABLE}>Wearable</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Image URL"
                            name="imageUrl"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
