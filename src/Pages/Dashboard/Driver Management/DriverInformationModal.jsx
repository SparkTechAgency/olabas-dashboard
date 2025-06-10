// DriverInformationModal.jsx
import { Button, DatePicker, Form, Input, Modal, Upload, message } from "antd";
import React, { useState } from "react";
import ButtonEDU from "../../../components/common/ButtonEDU";
import { UploadOutlined } from "@ant-design/icons";

function DriverInformationModal({ isModalOpen, onSubmit, onCancel, loading }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Create the data object as JSON string
      const driverData = {
        name: values.name,
        dateOfBirth: values.dateOfBirth?.toISOString(),
        phone: values.phone,
        email: values.email,
        address: values.address,
        licenseNumber: values.licenseNumber,
        password: values.password || "securePassword123", // You might want to generate this or ask user
      };

      // Append the JSON data
      formData.append("data", JSON.stringify(driverData));

      // Append the image file if exists
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      await onSubmit(formData);

      // Reset form and file list on success
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Form validation failed:", error);
      // If you want to show error messages to the user:
      if (error.errorFields) {
        error.errorFields.forEach((field) => {
          message.error(field.errors[0]);
        });
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadProps = {
    beforeUpload: (file) => {
      // Validate file type
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }

      // Validate file size (max 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }

      return false; // Prevent automatic upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1)); // Keep only the last file
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Modal
      title="Driver Information"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      closable
      destroyOnClose // This ensures the form is destroyed when closed
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-6"
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="name"
          label={<span className="text-xs font-semibold">Full Name *</span>}
          rules={[{ required: true, message: "Please enter driver name" }]}
        >
          <Input placeholder="Enter Driver Name" />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label={<span className="text-xs font-semibold">Date of Birth *</span>}
          rules={[{ required: true, message: "Please select date of birth" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select Date of Birth"
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          name="image"
          label={<span className="text-xs font-semibold">Profile Picture</span>}
        >
          <div className="w-full border rounded-lg p-2">
            <Upload {...uploadProps} listType="text">
              <Button icon={<UploadOutlined />} className="text-xs">
                Click to Upload Image
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          name="phone"
          label={<span className="text-xs font-semibold">Phone Number *</span>}
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^\+?[\d\s\-\(\)]+$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input placeholder="Enter Phone Number" />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="text-xs font-semibold">Email *</span>}
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter Email" />
        </Form.Item>

        <Form.Item
          name="address"
          label={
            <span className="text-xs font-semibold">Address Details *</span>
          }
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Enter Address" />
        </Form.Item>

        <Form.Item
          name="licenseNumber"
          label={
            <span className="text-xs font-semibold">
              Driver License Number *
            </span>
          }
          rules={[{ required: true, message: "Please enter license number" }]}
        >
          <Input placeholder="Enter Driver License Number" />
        </Form.Item>

        <Form.Item>
          <div className="w-full flex justify-end items-center gap-4 py-1">
            <ButtonEDU actionType="cancel" onClick={handleCancel}>
              Cancel
            </ButtonEDU>
            <ButtonEDU
              actionType="save"
              onClick={handleSubmit}
              loading={loading}
            >
              {loading ? "Creating..." : "Save"}
            </ButtonEDU>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default DriverInformationModal;
