import { Button, Form, message, Typography } from "antd";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate, useParams } from "react-router-dom";
import { useOtpVerifyMutation } from "../../redux/apiSlices/authApi";
const { Text } = Typography;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState();
  const [otpVerification] = useOtpVerifyMutation();
  const email = new URLSearchParams(location.search).get("email");

  const onFinish = async () => {
    if (!otp || otp.length < 4) {
      return message.warning("Please enter the complete 4-digit OTP");
    }

    try {
      const res = await otpVerification({
        email,
        oneTimeCode: Number(otp),
      }).unwrap();
      if (res.success) {
        message.success("OTP verification successful");
        localStorage.setItem("resetToken", res?.data);
        navigate(`/auth/reset-password?email=${email}`);
      } else {
        message.error("OTP verification failed");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      message.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleResendEmail = async () => {};

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-[25px] font-semibold mb-6">Verify OTP</h1>
        <p className="w-[80%] mx-auto">
          We'll send a verification code to your email. Check your inbox and
          enter the code here.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="flex items-center justify-center mb-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            inputStyle={{
              height: 50,
              width: 50,
              borderRadius: "8px",
              margin: "16px",
              fontSize: "20px",
              border: "2px solid #04bf61  ",
              color: "#04bf61  ",
              outline: "none",
              marginBottom: 10,
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <Text>Don't received code?</Text>

          <p
            onClick={handleResendEmail}
            className="login-form-forgot text-smart font-medium cursor-pointer "
          >
            Resend
          </p>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            style={{
              height: 45,
            }}
            className="w-full bg-smart text-[18px] border-none text-white outline-none "
          >
            Verify
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOtp;
