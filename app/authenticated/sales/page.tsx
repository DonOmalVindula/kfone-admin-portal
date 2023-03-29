"use client";
import { Button, Card, Col, List, Progress, Row, Space, Table, Typography } from "antd"
import { ArrowRightOutlined } from "@ant-design/icons"
import { SessionProvider } from "next-auth/react"
import { title } from "process";


export default function SaleDashboardPage() {
    return (
        <>
            <Row>
                <Col span={8}>
                    <Card className="step-card progress-card">
                        <Space direction="vertical">
                            <h2>Sold Units</h2>
                            <Progress
                                type="circle"
                                strokeColor={{
                                    '0%': '#f12711',
                                    '100%': '#f5af19',
                                }}
                                format={() => '69'}
                                percent={100}
                            />
                        </Space>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="step-card progress-card">
                        <Space direction="vertical">
                            <h2>Customers</h2>
                            <Progress
                                type="circle"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                format={() => '420'}
                                percent={100}
                            />
                        </Space>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="step-card progress-card">
                        <Space direction="vertical">
                            <h2>Transactions</h2>
                            <List 
                                dataSource={[
                                    {
                                        title: 'iPhone 13 Pro Max',
                                        price: 3500
                                    },
                                    {
                                        title: 'iPhone 13 Pro',
                                        price: 3000
                                    },
                                    {
                                        title: 'iPhone 13',
                                        price: 2500
                                    },
                                ]}
                                renderItem={(item) => (
                                    <List.Item>
                                      <Typography.Text mark>[{item.title}]</Typography.Text> {item.price}
                                    </List.Item>
                                  )}
                            
                            />
                        </Space>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

