import { Modal, Descriptions, Tag, Divider, Button } from "antd";

function ReservationViewModal({ isVisible, onClose, reservationData }) {
  if (!reservationData) return null;

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase().trim();
    switch (normalizedStatus) {
      case "confirmed":
        return "green";
      case "not confirmed":
        return "orange";
      case "canceled":
      case "cancelled":
        return "red";
      case "completed":
        return "blue";
      case "on ride":
      case "on_ride":
      case "onride":
        return "purple";
      default:
        return "orange";
    }
  };

  return (
    <Modal
      title="Reservation Details"
      open={isVisible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <div className="max-h-[70vh] overflow-auto">
        <Descriptions
          title="Basic Information"
          bordered
          size="small"
          column={2}
        >
          <Descriptions.Item label="Reservation ID" span={2}>
            {reservationData.id}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {reservationData.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(reservationData.status)}>
              {reservationData.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag color={reservationData.rawData?.isPaid ? "green" : "red"}>
              {reservationData.rawData?.isPaid ? "PAID" : "UNPAID"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            {reservationData.rawData?.paymentMethod || "N/A"}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions
          title="Client Information"
          bordered
          size="small"
          column={2}
        >
          <Descriptions.Item label="Name">
            {reservationData.client}
          </Descriptions.Item>

          <Descriptions.Item label="Email" span={2}>
            {reservationData.clientEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Total Bookings">
            {reservationData.rawData?.clientId?.totalBookings || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Total Spend">
            ₦{reservationData.rawData?.clientId?.totalSpend || 0}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions title="Booking Details" bordered size="small" column={2}>
          <Descriptions.Item label="Pickup Date">
            {reservationData.pickupDate}
          </Descriptions.Item>
          <Descriptions.Item label="Pickup Time">
            {reservationData.pickupTimeOnly}
          </Descriptions.Item>
          <Descriptions.Item label="Pickup Location" span={2}>
            {reservationData.pickupLocation}
          </Descriptions.Item>
          <Descriptions.Item label="Return Date">
            {reservationData.returnDate}
          </Descriptions.Item>
          <Descriptions.Item label="Return Time">
            {reservationData.returnTimeOnly}
          </Descriptions.Item>
          <Descriptions.Item label="Return Location" span={2}>
            {reservationData.returnLocation}
          </Descriptions.Item>
          <Descriptions.Item label="Rental Duration">
            <Tag color="blue">{reservationData.rentedDays} Days</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            <span className="font-bold text-green-600 text-lg">
              {reservationData.price}
            </span>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions
          title="Vehicle Information"
          bordered
          size="small"
          column={2}
        >
          <Descriptions.Item label="Vehicle Name">
            {reservationData.carName}
          </Descriptions.Item>
          <Descriptions.Item label="Vehicle Type">
            {reservationData.carSize}
          </Descriptions.Item>
          <Descriptions.Item label="Model">
            {reservationData.carModel}
          </Descriptions.Item>
          <Descriptions.Item label="Brand">
            {reservationData.vehicleBrand}
          </Descriptions.Item>
          <Descriptions.Item label="License Plate" span={2}>
            <Tag color="geekblue">{reservationData.carNumberPlate}</Tag>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions
          title="Driver Information"
          bordered
          size="small"
          column={1}
        >
          <Descriptions.Item label="Assigned Driver">
            {reservationData.driverName === "Not Assigned" ? (
              <Tag color="red">Not Assigned</Tag>
            ) : (
              <Tag color="green">{reservationData.driverName}</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>

        {reservationData.rawData?.extraServices &&
          reservationData.rawData.extraServices.length > 0 && (
            <>
              <Divider />
              <Descriptions
                title="Extra Services"
                bordered
                size="small"
                column={1}
              >
                <Descriptions.Item label="Services">
                  <div className="flex flex-wrap gap-1">
                    {reservationData.rawData.extraServices.map(
                      (service, index) => (
                        <Tag key={index} color="cyan">
                          Service ID: {service.serviceId} (Qty:{" "}
                          {service.quantity})
                        </Tag>
                      )
                    )}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
      </div>
    </Modal>
  );
}

export default ReservationViewModal;
