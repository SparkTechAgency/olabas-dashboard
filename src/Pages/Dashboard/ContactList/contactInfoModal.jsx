import React from "react";
import { Modal, Descriptions } from "antd";
import dayjs from "dayjs";

function ContactInfoModal({ open, onCancel, record }) {
  return (
    <Modal
      title="Contact Information"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={800}
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      {record ? (
        <Descriptions
          bordered
          column={1}
          size="middle"
          labelStyle={{ width: "160px", fontWeight: 500 }}
        >
          <Descriptions.Item label="Date Received">
            {record.date
              ? dayjs(record.date).format("MMMM D, YYYY h:mm A")
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Name">
            {record.name || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {record.email || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Subject">
            {record.subject || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Message">
            <div
              style={{
                maxHeight: "600px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                padding: "4px",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px",
                lineHeight: "1.5",
              }}
            >
              {record.message || "N/A"}
            </div>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div className="text-center py-10 text-gray-500 text-sm">
          No contact selected.
        </div>
      )}
    </Modal>
  );
}

export default ContactInfoModal;
