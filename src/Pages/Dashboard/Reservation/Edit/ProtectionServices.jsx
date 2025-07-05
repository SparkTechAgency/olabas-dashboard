import React, { useEffect, useState } from "react";
import {
  Card,
  Switch,
  InputNumber,
  Tag,
  Typography,
  Row,
  Col,
  Spin,
} from "antd";
import { useGetAllProtectionsQuery } from "../../../../redux/apiSlices/extra";

const { Title, Text } = Typography;

function ProtectionServices() {
  const {
    data: protectionData,
    isLoading,
    isError,
  } = useGetAllProtectionsQuery();

  const [services, setServices] = useState([]);

  useEffect(() => {
    if (protectionData?.data?.result) {
      const mapped = protectionData.data.result.map((item, index) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.cost || 0,
        quantity: 1,
        included: index < 2, // First 2 services preselected
        billing: item.isPerDay ? "Per Day" : "One Time",
      }));
      setServices(mapped);
    }
  }, [protectionData]);

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

  const calculateTotal = (service) => {
    return service.included ? service.price * service.quantity : 0;
  };

  const getSelectedCount = () => {
    return services.filter((service) => service.included).length;
  };

  if (isLoading) return <Spin />;

  return (
    <div className="w-full p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Protection Services</h3>
      </div>

      <Text type="secondary" style={{ marginBottom: "8px", display: "block" }}>
        Select the protection services you want to include in your rental.
      </Text>
      <Text
        style={{ color: "#1890ff", marginBottom: "24px", display: "block" }}
      >
        Selected: {getSelectedCount()} protection service(s)
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
          <Col span={3}>
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
          <Col span={3}>
            <Text strong>Total</Text>
          </Col>
        </Row>

        {services.map((service) => (
          <Row
            key={service.id}
            gutter={[16, 16]}
            style={{ marginBottom: "24px", alignItems: "flex-start" }}
          >
            <Col span={3}>
              <Switch
                checked={service.included}
                onChange={(checked) => handleSwitchChange(service.id, checked)}
                style={{
                  backgroundColor: service.included ? "#52c41a" : "#d9d9d9",
                  marginTop: "4px",
                }}
              />
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text style={{ fontSize: "14px", marginRight: "8px" }}>₦</Text>
                <span
                  style={{
                    fontSize: "14px",
                    backgroundColor: "#f5f5f5",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #d9d9d9",
                  }}
                >
                  {service.price}
                </span>
              </div>
            </Col>

            <Col span={3}>
              <Tag
                color={service.billing === "Per Day" ? "blue" : "orange"}
                style={{ fontSize: "11px" }}
              >
                {service.billing}
              </Tag>
            </Col>

            <Col span={3}>
              <Text
                strong
                style={{
                  fontSize: "14px",
                  color: service.included ? "#52c41a" : "#999",
                }}
              >
                ₦ {calculateTotal(service).toFixed(2)}
              </Text>
            </Col>
          </Row>
        ))}
      </Card>
    </div>
  );
}

export default ProtectionServices;
