import React from "react";
import { Form, Input, Flex, ConfigProvider, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";

function AdminPassword() {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    message.info("Password change cancelled.");
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const trimmedValues = {
        currentPassword: values.currentPassword.trim(),
        newPassword: values.newPassword.trim(),
        confirmPassword: values.confirmPassword.trim(),
      };

      console.log("Password Updated:", trimmedValues);
      message.success("Password updated successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <div className="w-full h-auto bg-white p-4 rounded-xl  shadow-[0px_10px_100px_3px_rgba(0,_0,_0,_0.1)]">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Change Password
      </h2>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelFontSize: 16,
            },
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          className="h-auto flex flex-col items-center justify-evenly"
        >
          {/* Current Password */}
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please enter your current password!",
              },
            ]}
            className="w-[80%]"
          >
            <Input.Password
              placeholder="Enter current password"
              className="h-10"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* New Password */}
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
            className="w-[80%]"
          >
            <Input.Password
              placeholder="Enter new password"
              className="h-10"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Confirm New Password */}
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
            className="w-[80%]"
          >
            <Input.Password
              placeholder="Confirm new password"
              className="h-10"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Buttons */}
          <Flex justify="flex-end" className="w-[80%] gap-4">
            <ButtonEDU actionType="cancel" onClick={handleCancel}>
              Cancel
            </ButtonEDU>
            <ButtonEDU actionType="save" onClick={handleSave}>
              Save
            </ButtonEDU>
          </Flex>
        </Form>
      </ConfigProvider>
    </div>
  );
}

export default AdminPassword;
