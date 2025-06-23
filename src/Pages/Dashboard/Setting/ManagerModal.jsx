import React, { useRef, useEffect } from "react";
import { Modal, Form, Input, ConfigProvider, message } from "antd";
import ButtonEDU from "../../../components/common/ButtonEDU";

const ManagerModal = ({ isOpen, onClose, onSubmit, selectedManager, mode }) => {
  const formRef = useRef(null);
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (isOpen && isEditMode && selectedManager) {
      setTimeout(() => {
        formRef.current?.setFieldsValue(selectedManager);
      }, 0);
    } else if (isOpen && !isEditMode) {
      // For add mode, set default role value
      setTimeout(() => {
        formRef.current?.setFieldsValue({ role: "Manager" });
      }, 0);
    }
  }, [isOpen, selectedManager, isEditMode]);

  const handleCancel = () => {
    onClose();
    formRef.current?.resetFields();
    message.info(`Manager ${isEditMode ? "edit" : "addition"} cancelled.`);
  };

  const handleSubmit = (values) => {
    // Ensure characters after ".com" are removed
    const cleanEmail = values.email.replace(/\.com.*/i, ".com");

    const managerData = {
      ...values,
      email: cleanEmail.trim(),
    };

    onSubmit(managerData);
    formRef.current?.resetFields();
    message.success(
      `Manager ${isEditMode ? "updated" : "added"} successfully!`
    );
  };

  return (
    <Modal
      title={`${isEditMode ? "Edit" : "Add"} Manager`}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      className="z-50"
    >
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelFontSize: 16,
            },
          },
        }}
      >
        <Form layout="vertical" ref={formRef} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter Name" }]}
          >
            <Input placeholder="Name" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter Email" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
              {
                validator: (_, value) => {
                  // Ensure no characters after .com
                  if (value && value.includes(".com")) {
                    const emailAfterDot = value.split(".com")[1];
                    if (emailAfterDot && emailAfterDot.length > 0) {
                      return Promise.reject(
                        "No characters should be after .com"
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Email" className="h-10" />
          </Form.Item>

          {!isEditMode && (
            <Form.Item
              label="Role"
              name="role"
              initialValue="Manager"
              rules={[{ required: false, message: "Please enter Role" }]}
            >
              <Input placeholder="Role" className="h-10" disabled />
            </Form.Item>
          )}

          {!isEditMode && (
            <Form.Item label="Password" name="password">
              <Input.Password placeholder="Set a Password" className="h-10" />
            </Form.Item>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <ButtonEDU actionType="cancel" onClick={handleCancel}>
              Cancel
            </ButtonEDU>
            <ButtonEDU
              actionType="save"
              onClick={() => formRef.current?.submit()}
            >
              {isEditMode ? "Update" : "Save"}
            </ButtonEDU>
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
};

export default ManagerModal;
