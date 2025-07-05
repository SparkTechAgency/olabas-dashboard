import React, { useState } from "react";
import {
  Card,
  Switch,
  InputNumber,
  Tag,
  Typography,
  Row,
  Col,
  Space,
} from "antd";

const { Title, Text } = Typography;

function ExtraServices() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "GWAGON TRAVEL FUELING",
      description: "GWAGON IS FUELED BY US",
      idCode: "ID: 685d9ba540249f1f70fcae77",
      price: 10000,
      quantity: 1,
      included: false,
      billing: "One Time",
      isFree: true,
    },
    {
      id: 2,
      name: "TRAVEL FEE - December rate",
      description:
        "Our Operation is mostly based in Lagos Nigeria. If you will be traveling out of Lagos state let us know. We do not travel to every location, but to those places we go there is a travel fee that you must select and pay for.",
      idCode: "ID: 685d9b1540249f1f70fcae75",
      price: 150000,
      quantity: 1,
      included: true,
      billing: "One Time",
      isFree: false,
    },
  ]);

  const handleSwitchChange = (serviceId, checked) => {
    setServices(
      services.map((service) =>
        service.id === serviceId ? { ...service, included: checked } : service
      )
    );
  };

  const handleQuantityChange = (serviceId, value) => {
    setServices(
      services.map((service) =>
        service.id === serviceId
          ? { ...service, quantity: value || 1 }
          : service
      )
    );
  };

  const formatPrice = (price) => {
    return `₦ ${price.toLocaleString()}.00`;
  };

  const calculateTotal = (service) => {
    return service.included ? service.price * service.quantity : 0;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: "8px" }}>
        Select Extra Services
      </Title>
      <Text type="secondary" style={{ marginBottom: "24px", display: "block" }}>
        Choose additional services for your rental. Free services are marked in
        green. Per-day charges will be calculated based on your rental duration.
      </Text>

      <Card>
        <Row
          gutter={[16, 16]}
          style={{
            marginBottom: "16px",
            fontWeight: "bold",
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: "8px",
          }}
        >
          <Col span={2}>
            <Text strong>Include</Text>
          </Col>
          <Col span={8}>
            <Text strong>Name</Text>
          </Col>
          <Col span={3}>
            <Text strong>Qty</Text>
          </Col>
          <Col span={4}>
            <Text strong>Price</Text>
          </Col>
          <Col span={3}>
            <Text strong>Billing</Text>
          </Col>
          <Col span={4}>
            <Text strong>Total</Text>
          </Col>
        </Row>

        {services.map((service) => (
          <Row
            key={service.id}
            gutter={[16, 16]}
            style={{ marginBottom: "24px", alignItems: "flex-start" }}
          >
            <Col span={2}>
              <Switch
                checked={service.included}
                onChange={(checked) => handleSwitchChange(service.id, checked)}
                style={{
                  backgroundColor: service.included ? "#52c41a" : "#d9d9d9",
                  marginTop: "4px",
                }}
              />
              <div
                style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}
              >
                {service.included ? "YES" : "NO"}
              </div>
            </Col>

            <Col span={8}>
              <div>
                <Text strong style={{ fontSize: "14px" }}>
                  {service.name}
                </Text>
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "#666",
                    lineHeight: "1.4",
                  }}
                >
                  {service.description}
                </div>
                <div
                  style={{ marginTop: "4px", fontSize: "11px", color: "#999" }}
                >
                  {service.idCode}
                </div>
              </div>
            </Col>

            <Col span={3}>
              <InputNumber
                min={1}
                value={service.quantity}
                onChange={(value) => handleQuantityChange(service.id, value)}
                style={{ width: "60px" }}
                size="small"
              />
            </Col>

            <Col span={4}>
              <Text style={{ fontSize: "14px" }}>
                {formatPrice(service.price)}
              </Text>
            </Col>

            <Col span={3}>
              <Tag color="orange" style={{ fontSize: "11px" }}>
                {service.billing}
              </Tag>
            </Col>

            <Col span={4}>
              <Text
                strong
                style={{
                  fontSize: "14px",
                  color: service.isFree
                    ? "#52c41a"
                    : service.included
                    ? "#000"
                    : "#999",
                }}
              >
                {service.isFree && !service.included
                  ? formatPrice(0)
                  : service.included
                  ? `₦ ${calculateTotal(service).toLocaleString()}.00`
                  : formatPrice(0)}
              </Text>
            </Col>
          </Row>
        ))}
      </Card>
    </div>
  );
}

export default ExtraServices;
