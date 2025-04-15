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
    <div className="w-full h-72 bg-white p-3 rounded-xl shadow-[0px_10px_100px_3px_rgba(0,_0,_0,_0.1)] overflow-hidden">
      <h2 className="text-base font-semibold mb-2 text-center">
        Change Password
      </h2>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelFontSize: 14,
            },
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col justify-between h-[calc(100%-1.75rem)]" // Adjusting for heading height
        >
          <div className="flex flex-col gap-2 items-center">
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
              className="w-[80%] m-0"
            >
              <Input.Password
                placeholder="Enter current password"
                className="h-8"
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
              className="w-[80%] m-0"
            >
              <Input.Password
                placeholder="Enter new password"
                className="h-8"
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
              className="w-[80%] m-0"
            >
              <Input.Password
                placeholder="Confirm new password"
                className="h-8"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </div>

          {/* Buttons */}
          <Flex justify="flex-end" className="w-[80%] mx-auto gap-2 pt-2">
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
