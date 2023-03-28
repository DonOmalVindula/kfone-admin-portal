"use client";
import { Button, Card, Col, Progress, Row, Space } from "antd"
import { ArrowRightOutlined } from "@ant-design/icons"
import { SessionProvider } from "next-auth/react"


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
           
            
                        </Space>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

