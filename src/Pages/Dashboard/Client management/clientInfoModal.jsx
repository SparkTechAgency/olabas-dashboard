import React from "react";
import { Modal, Descriptions } from "antd";
import dayjs from "dayjs";

function ClientInfoModal({ open, onCancel, record }) {
  return (
    <Modal
      title="Client Information"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={700}
    >
      {record ? (
        <Descriptions bordered column={2}>
          {/* Basic Information */}
          <Descriptions.Item label="Full Name" span={2}>
            {record.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{record.phone}</Descriptions.Item>

          {/* Account Information */}
          <Descriptions.Item label="Role">{record.role}</Descriptions.Item>
          <Descriptions.Item label="Joined on">
            {dayjs(record.createdAt).format("MMMM D, YYYY h:mm A")}
          </Descriptions.Item>

          {/* Address Information */}
          <Descriptions.Item label="Present Address" span={2}>
            {record.presentAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Permanent Address" span={2}>
            {record.parmanentAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {record.country}
          </Descriptions.Item>
          <Descriptions.Item label="Post Code">
            {record.postCode}
          </Descriptions.Item>

          {/* Booking Statistics */}
          <Descriptions.Item label="Total Bookings">
            {record.totalBookings}
          </Descriptions.Item>
          <Descriptions.Item label="Total Spend">
            ₦ {record.totalSpend}
          </Descriptions.Item>

          {/* Last Rental Information */}
          <Descriptions.Item label="Last Rental Date">
            {record.lastBooking?.createdAt
              ? dayjs(record.lastBooking.createdAt).format(
                  "MMMM D, YYYY h:mm A"
                )
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Last Rental Amount">
            {record.lastBooking?.amount
              ? `₦ ${record.lastBooking.amount}`
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No client selected.</p>
      )}
    </Modal>
  );
}

export default ClientInfoModal;
