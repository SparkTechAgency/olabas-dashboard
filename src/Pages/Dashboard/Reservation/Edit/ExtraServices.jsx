// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Switch,
//   InputNumber,
//   Tag,
//   Typography,
//   Row,
//   Col,
//   Space,
//   Spin,
// } from "antd";
// import { useGetExtraQuery } from "../../../../redux/apiSlices/extra";

// const { Title, Text } = Typography;

// function ExtraServices() {
//   const {
//     data: extraData,
//     isLoading,
//     error,
//   } = useGetExtraQuery({
//     page: null,
//     limit: null,
//   });

//   const [services, setServices] = useState([]);

//   useEffect(() => {
//     if (extraData?.data?.result) {
//       const mappedServices = extraData.data.result.map((item, index) => ({
//         id: item._id,
//         name: item.name,
//         description: item.description,
//         idCode: `ID: ${item._id}`,
//         price: item.cost || 0,
//         quantity: 1,
//         included: index === 1, // default second item included
//         billing: item.isPerDay ? "Per Day" : "One Time",
//         isFree: item.cost === 0,
//       }));
//       setServices(mappedServices);
//     }
//   }, [extraData]);

//   const handleSwitchChange = (serviceId, checked) => {
//     setServices((prev) =>
//       prev.map((service) =>
//         service.id === serviceId ? { ...service, included: checked } : service
//       )
//     );
//   };

//   const handleQuantityChange = (serviceId, value) => {
//     setServices((prev) =>
//       prev.map((service) =>
//         service.id === serviceId
//           ? { ...service, quantity: value || 1 }
//           : service
//       )
//     );
//   };

//   const formatPrice = (price) => `₦ ${price.toLocaleString()}.00`;

//   const calculateTotal = (service) =>
//     service.included ? service.price * service.quantity : 0;

//   if (isLoading) return <Spin />;

//   return (
//     <div className="w-full p-6">
//       <div>
//         <div>
//           <h3 className="text-lg font-semibold mb-4"> Select Extra Services</h3>
//         </div>

//         <Text
//           type="secondary"
//           style={{ marginBottom: "24px", display: "block" }}
//         >
//           Choose additional services for your rental. Free services are marked
//           in green. Per-day charges will be calculated based on your rental
//           duration.
//         </Text>
//       </div>

//       <Card>
//         <Row
//           gutter={[16, 16]}
//           style={{
//             marginBottom: "16px",
//             fontWeight: "bold",
//             borderBottom: "1px solid #f0f0f0",
//             paddingBottom: "8px",
//           }}
//         >
//           <Col span={2}>
//             <Text strong>Include</Text>
//           </Col>
//           <Col span={8}>
//             <Text strong>Name</Text>
//           </Col>
//           <Col span={3}>
//             <Text strong>Qty</Text>
//           </Col>
//           <Col span={4}>
//             <Text strong>Price</Text>
//           </Col>
//           <Col span={3}>
//             <Text strong>Billing</Text>
//           </Col>
//           <Col span={4}>
//             <Text strong>Total</Text>
//           </Col>
//         </Row>

//         {services.map((service) => (
//           <Row
//             key={service.id}
//             gutter={[16, 16]}
//             style={{ marginBottom: "24px", alignItems: "flex-start" }}
//           >
//             <Col span={2}>
//               <Switch
//                 checked={service.included}
//                 onChange={(checked) => handleSwitchChange(service.id, checked)}
//                 style={{
//                   backgroundColor: service.included ? "#52c41a" : "#d9d9d9",
//                   marginTop: "4px",
//                 }}
//               />
//               <div
//                 style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}
//               >
//                 {service.included ? "YES" : "NO"}
//               </div>
//             </Col>

//             <Col span={8}>
//               <div>
//                 <Text strong style={{ fontSize: "14px" }}>
//                   {service.name}
//                 </Text>
//                 <div
//                   style={{
//                     marginTop: "4px",
//                     fontSize: "12px",
//                     color: "#666",
//                     lineHeight: "1.4",
//                   }}
//                 >
//                   {service.description}
//                 </div>
//                 <div
//                   style={{ marginTop: "4px", fontSize: "11px", color: "#999" }}
//                 >
//                   {service.idCode}
//                 </div>
//               </div>
//             </Col>

//             <Col span={3}>
//               <InputNumber
//                 min={1}
//                 value={service.quantity}
//                 onChange={(value) => handleQuantityChange(service.id, value)}
//                 style={{ width: "60px" }}
//                 size="small"
//               />
//             </Col>

//             <Col span={4}>
//               <Text style={{ fontSize: "14px" }}>
//                 {formatPrice(service.price)}
//               </Text>
//             </Col>

//             <Col span={3}>
//               <Tag color="orange" style={{ fontSize: "11px" }}>
//                 {service.billing}
//               </Tag>
//             </Col>

//             <Col span={4}>
//               <Text
//                 strong
//                 style={{
//                   fontSize: "14px",
//                   color: service.isFree
//                     ? "#52c41a"
//                     : service.included
//                     ? "#000"
//                     : "#999",
//                 }}
//               >
//                 {service.isFree && !service.included
//                   ? formatPrice(0)
//                   : service.included
//                   ? `₦ ${calculateTotal(service).toLocaleString()}.00`
//                   : formatPrice(0)}
//               </Text>
//             </Col>
//           </Row>
//         ))}
//       </Card>
//     </div>
//   );
// }

// export default ExtraServices;

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
import { useSelector, useDispatch } from "react-redux";
import { useGetExtraQuery } from "../../../../redux/apiSlices/extra";
import { updateExtraServices } from "../../../../redux/features/EditReservationSlice";

const { Title, Text } = Typography;

function ExtraServices() {
  const dispatch = useDispatch();

  // Get data from Redux store
  const { extraServices, carRentedForInDays } = useSelector(
    (state) => state.editReservation
  );

  const {
    data: extraData,
    isLoading,
    error,
  } = useGetExtraQuery({
    page: null,
    limit: null,
  });

  const [services, setServices] = useState([]);

  // Initialize services from API data and merge with Redux state
  useEffect(() => {
    if (extraData?.data?.result) {
      const mappedServices = extraData.data.result.map((item) => {
        // Check if this service is already in Redux state
        const existingService = extraServices.find(
          (service) => service.id === item._id
        );

        return {
          id: item._id,
          name: item.name,
          description: item.description,
          idCode: `ID: ${item._id}`,
          price: item.cost || 0,
          quantity: existingService?.quantity || 1,
          included: existingService?.included || false,
          billing: item.isPerDay ? "Per Day" : "One Time",
          isFree: item.cost === 0,
          isPerDay: item.isPerDay || false,
        };
      });
      setServices(mappedServices);
    }
  }, [extraData, extraServices]);

  // Update Redux store when services change
  const updateReduxServices = (updatedServices) => {
    const selectedServices = updatedServices
      .filter((service) => service.included)
      .map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        quantity: service.quantity,
        included: service.included,
        billing: service.billing,
        isPerDay: service.isPerDay,
        totalCost: calculateServiceTotal(service),
      }));

    dispatch(updateExtraServices(selectedServices));
  };

  const handleSwitchChange = (serviceId, checked) => {
    const updatedServices = services.map((service) =>
      service.id === serviceId ? { ...service, included: checked } : service
    );
    setServices(updatedServices);
    updateReduxServices(updatedServices);
  };

  const handleQuantityChange = (serviceId, value) => {
    const updatedServices = services.map((service) =>
      service.id === serviceId ? { ...service, quantity: value || 1 } : service
    );
    setServices(updatedServices);
    updateReduxServices(updatedServices);
  };

  const formatPrice = (price) => {
    const validPrice = price || 0;
    return `₦ ${validPrice.toLocaleString()}.00`;
  };

  const calculateServiceTotal = (service) => {
    if (!service.included || !service.price) return 0;

    const baseTotal = (service.price || 0) * (service.quantity || 1);

    // If it's a per-day service, multiply by rental duration
    if (service.isPerDay && carRentedForInDays) {
      return baseTotal * carRentedForInDays;
    }

    return baseTotal;
  };

  const calculateTotal = (service) => calculateServiceTotal(service);

  // Calculate grand total of all selected services
  const grandTotal =
    services.reduce((total, service) => {
      return total + calculateTotal(service);
    }, 0) || 0;

  if (isLoading) return <Spin />;

  if (error) {
    return (
      <div className="w-full p-6">
        <Text type="danger">Error loading extra services: {error.message}</Text>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select Extra Services</h3>
          {grandTotal > 0 && (
            <div className="text-right">
              <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                Total: {formatPrice(grandTotal)}
              </Text>
              {carRentedForInDays && (
                <div style={{ fontSize: "12px", color: "#666" }}>
                  (Rental Duration: {carRentedForInDays} days)
                </div>
              )}
            </div>
          )}
        </div>

        <Text
          type="secondary"
          style={{ marginBottom: "24px", display: "block" }}
        >
          Choose additional services for your rental. Free services are marked
          in green. Per-day charges will be calculated based on your rental
          duration ({carRentedForInDays || 0} days).
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
            style={{
              marginBottom: "24px",
              alignItems: "flex-start",
              backgroundColor: service.included ? "#f6ffed" : "transparent",
              padding: "8px",
              borderRadius: "4px",
              border: service.included
                ? "1px solid #b7eb8f"
                : "1px solid transparent",
            }}
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
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  color: service.included ? "#52c41a" : "#666",
                  fontWeight: service.included ? "bold" : "normal",
                }}
              >
                {service.included ? "YES" : "NO"}
              </div>
            </Col>

            <Col span={8}>
              <div>
                <Text strong style={{ fontSize: "14px" }}>
                  {service.name}
                  {service.isFree && (
                    <Tag
                      color="green"
                      style={{ marginLeft: "8px", fontSize: "10px" }}
                    >
                      FREE
                    </Tag>
                  )}
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
                disabled={!service.included}
              />
            </Col>

            <Col span={4}>
              <Text style={{ fontSize: "14px" }}>
                {formatPrice(service.price)}
                {service.isPerDay && (
                  <div style={{ fontSize: "11px", color: "#666" }}>per day</div>
                )}
              </Text>
            </Col>

            <Col span={3}>
              <Tag
                color={service.isPerDay ? "orange" : "blue"}
                style={{ fontSize: "11px" }}
              >
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
                {service.isFree && service.included
                  ? "FREE"
                  : service.included
                  ? `₦ ${calculateTotal(service).toLocaleString()}.00`
                  : formatPrice(0)}
              </Text>
              {service.included && service.isPerDay && carRentedForInDays && (
                <div style={{ fontSize: "11px", color: "#666" }}>
                  ({service.quantity || 1} × {service.price || 0} ×{" "}
                  {carRentedForInDays} days)
                </div>
              )}
            </Col>
          </Row>
        ))}

        {services.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">No extra services available</Text>
          </div>
        )}
      </Card>

      {/* Summary Section */}
      {extraServices.length > 0 && (
        <Card style={{ marginTop: "24px" }} title="Selected Services Summary">
          <Row gutter={[16, 16]}>
            {extraServices.map((service) => (
              <Col span={24} key={service.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Text strong>{service.name}</Text>
                    <Text type="secondary" style={{ marginLeft: "8px" }}>
                      (Qty: {service.quantity})
                    </Text>
                    {service.isPerDay && (
                      <Tag
                        color="orange"
                        style={{ marginLeft: "8px", fontSize: "11px" }}
                      >
                        Per Day
                      </Tag>
                    )}
                  </div>
                  <Text strong>{formatPrice(service.totalCost || 0)}</Text>
                </div>
              </Col>
            ))}
            <Col
              span={24}
              style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong style={{ fontSize: "16px" }}>
                  Total Extra Services:
                </Text>
                <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                  {formatPrice(grandTotal)}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}

export default ExtraServices;
