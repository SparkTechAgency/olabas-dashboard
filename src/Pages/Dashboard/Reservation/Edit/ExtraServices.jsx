import React, { useEffect, useState } from "react";
import {
  Card,
  Switch,
  InputNumber,
  Tag,
  Typography,
  Row,
  Col,
  Space,
  Spin,
} from "antd";
import { useGetExtraQuery } from "../../../../redux/apiSlices/extra";

const { Title, Text } = Typography;

function ExtraServices() {
  const {
    data: extraData,
    isLoading,
    error,
  } = useGetExtraQuery({
    page: null,
    limit: null,
  });

  const [services, setServices] = useState([]);

  useEffect(() => {
    if (extraData?.data?.result) {
      const mappedServices = extraData.data.result.map((item, index) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        idCode: `ID: ${item._id}`,
        price: item.cost || 0,
        quantity: 1,
        included: index === 1, // default second item included
        billing: item.isPerDay ? "Per Day" : "One Time",
        isFree: item.cost === 0,
      }));
      setServices(mappedServices);
    }
  }, [extraData]);

  const handleSwitchChange = (serviceId, checked) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, included: checked } : service
      )
    );
  };

  const handleQuantityChange = (serviceId, value) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? { ...service, quantity: value || 1 }
          : service
      )
    );
  };

  const formatPrice = (price) => `₦ ${price.toLocaleString()}.00`;

  const calculateTotal = (service) =>
    service.included ? service.price * service.quantity : 0;

  if (isLoading) return <Spin />;

  return (
    <div className="w-full p-6">
      <div>
        <div>
          <h3 className="text-lg font-semibold mb-4"> Select Extra Services</h3>
        </div>

        <Text
          type="secondary"
          style={{ marginBottom: "24px", display: "block" }}
        >
          Choose additional services for your rental. Free services are marked
          in green. Per-day charges will be calculated based on your rental
          duration.
        </Text>
      </div>

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
