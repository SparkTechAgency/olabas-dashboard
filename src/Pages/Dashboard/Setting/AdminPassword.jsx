import { Form, Input, Flex, ConfigProvider, message, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useChangePasswordMutation } from "../../../redux/apiSlices/authApi";
import { useNavigate } from "react-router-dom";
function AdminPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleCancel = () => {
    form.resetFields();
    message.info("Password change cancelled.");
  };

  const onFinish = async (values) => {
    console.log("Submitted values:", values);

    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap();
      console.log(res);
      if (res.success) {
        form.resetFields();
        message.success(res?.message || "Password updated successfully!");
        navigate("/auth/login");
      }
    } catch (err) {
      console.log("Change password error:", err);
      message.error(
        err?.data?.message || "Something went wrong while changing password."
      );
    }
  };

  return (
    <div className="w-full min-h-80 bg-white p-3 rounded-xl shadow-[0px_10px_100px_3px_rgba(0,_0,_0,_0.1)] overflow-hidden">
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
          onFinish={onFinish}
          className="flex flex-col h-[calc(100%-1.75rem)] "
        >
          <div className="flex flex-col gap-2 items-center">
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

          <Flex justify="flex-end" className="w-[80%] mx-auto gap-2 pt-2 mt-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              htmlType="submit"
              loading={isLoading}
              className="bg-smart text-white"
            >
              Save
            </Button>
          </Flex>
        </Form>
      </ConfigProvider>
    </div>
  );
}

export default AdminPassword;
