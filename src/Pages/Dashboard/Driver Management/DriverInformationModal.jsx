import { Button, DatePicker, Form, Input, Modal, Upload, message } from "antd";
import React, { useState, useEffect } from "react";
import ButtonEDU from "../../../components/common/ButtonEDU";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function DriverInformationModal({
  isModalOpen,
  onSubmit,
  onCancel,
  loading,
  initialData = null,
  isEditMode = false,
}) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Populate form when modal opens with initial data (for edit mode)
  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && initialData) {
        // Edit mode - populate with existing data
        form.setFieldsValue({
          name: initialData.name,
          dateOfBirth: initialData.dateOfBirth
            ? dayjs(initialData.dateOfBirth)
            : null,
          phone: initialData.phone,
          email: initialData.email,
          address: initialData.address,
          licenseNumber: initialData.licenseNumber,
        });

        // If there's an existing image, show it in the file list
        if (initialData.image) {
          setFileList([
            {
              uid: "-1",
              name: "current-image",
              status: "done",
              url: `http://10.0.60.110:5000${initialData.image}`,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        // Create mode - reset form
        form.resetFields();
        setFileList([]);
      }
    }
  }, [isModalOpen, initialData, isEditMode, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values); // Debug log

      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Create the data object
      const driverData = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        licenseNumber: values.licenseNumber,
      };

      // Add dateOfBirth only if it exists
      if (values.dateOfBirth) {
        driverData.dateOfBirth = values.dateOfBirth.toISOString();
      }

      // // Only include password if it's provided AND it's create mode
      // // For edit mode, only include password if user actually entered one
      // if (values.password && values.password.trim() !== "") {
      //   driverData.password = values.password;
      // } else if (!isEditMode) {
      //   // For create mode, password might be required
      //   // Add a default or handle this based on your API requirements
      // }

      console.log("Driver data to send:", driverData); // Debug log

      // Append the JSON data
      formData.append("data", JSON.stringify(driverData));

      // Append the image file if a new one was uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
        console.log("Appending image file:", fileList[0].originFileObj.name); // Debug log
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
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
      title={isEditMode ? "Edit Driver Information" : "Add Driver Information"}
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
                {fileList.length > 0 ? "Change Image" : "Click to Upload Image"}
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
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update"
                : "Save"}
            </ButtonEDU>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default DriverInformationModal;
