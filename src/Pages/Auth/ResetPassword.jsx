import { Button, Form, Input, ConfigProvider, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/apiSlices/authApi";

const ResetPassword = () => {
  const email = new URLSearchParams(location.search).get("email");
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();

  const onFinish = async (values) => {
    const { newPassword, confirmPassword } = values;
    const token = localStorage.getItem("resetToken");
    console.log("resetToken", token);

    if (!token) {
      message.error(
        "Reset token not found. Please try the reset process again."
      );
      return;
    }

    try {
      console.log("Sending request with token:", token);
      console.log("Password data:", { newPassword, confirmPassword });

      const res = await resetPassword({
        newPassword,
        confirmPassword,
        token: token,
      }).unwrap();

      if (res.success) {
        message.success("Password reset successful");
        localStorage.removeItem("resetToken");
        navigate(`/auth/login`);
      } else {
        message.error("Password reset failed");
      }
    } catch (err) {
      message.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[25px] font-semibold mb-6">Reset Password</h1>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelColor: "black",
            },
          },
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="newPassword"
            label={
              <p
                style={{
                  display: "block",
                }}
                htmlFor="newPassword"
                className="text-base font-normal text-black"
              >
                New Password
              </p>
            }
            rules={[
              {
                required: true,
                message: "Please input your new Password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
            style={{ marginBottom: "16px" }}
          >
            <Input.Password
              placeholder="Enter New password"
              style={{
                border: "1px solid #E0E4EC",
                height: 45,
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "16px" }}
            label={
              <p
                style={{
                  display: "block",
                }}
                htmlFor="confirmPassword"
                className="text-base text-black font-normal"
              >
                Confirm Password
              </p>
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Enter Confirm password"
              style={{
                border: "1px solid #E0E4EC",
                height: 45,
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "16px" }}>
            <Button
              htmlType="submit"
              style={{
                height: 45,
              }}
              className="w-full bg-smart text-[18px] font-normal border-none text-white outline-none mt-4"
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default ResetPassword;
