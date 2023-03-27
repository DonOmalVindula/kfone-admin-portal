"use client"
import { Spin } from "antd"

const LoadingSpinner = () => {
    return (
        <div className="loading-container">
            <Spin size="large" />
            <p>Loading... Please wait.</p>
        </div>
    )
}

export default LoadingSpinner;
