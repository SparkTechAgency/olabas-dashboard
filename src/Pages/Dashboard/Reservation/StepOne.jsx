import React from "react";
import { Form, Input, Button, DatePicker } from "antd";
import moment from "moment";
import { SlCalender } from "react-icons/sl";
const StepOne = () => {
  return (
    <Form
      layout="vertical"
      initialValues={{ remember: true }}
      className="w-full"
    >
      {/* Pick-up Date & Time */}
      <div className="w-full flex justify-between gap-6  ">
        <Form.Item
          label="Date & Time (Pick-up)"
          name="pickupTime"
          rules={[
            {
              required: true,
              message: "Please select pick-up date and time!",
            },
          ]}
          className="w-1/2"
        >
          <DatePicker
            showTime
            format="MM/DD/YYYY hh:mm a"
            defaultValue={moment("2025-03-30 00:00", "YYYY-MM-DD hh:mm")}
            className="w-full h-8"
          />
        </Form.Item>

        {/* Return Date & Time */}

        <Form.Item
          label="Date & Time (Return)"
          name="returnTime"
          rules={[
            {
              required: true,
              message: "Please select return date and time!",
            },
          ]}
          className="w-1/2"
        >
          <DatePicker
            showTime
            format="MM/DD/YYYY hh:mm a"
            defaultValue={moment("2025-03-30 02:00", "YYYY-MM-DD hh:mm")}
            className="w-full h-8"
          />
        </Form.Item>
      </div>

      <div className="w-full flex justify-between gap-6  ">
        {/* Pick-up Location */}

        <Form.Item
          label="Pick-up Location"
          name="pickupLocation"
          rules={[
            { required: true, message: "Please input the pick-up location!" },
          ]}
          className="w-1/2"
        >
          <Input
            placeholder="Hogarth Road, London"
            className="h-8"
            // addonBefore={<SlCalender />}
          />
        </Form.Item>

        {/* Return Location */}

        <Form.Item
          label="Return Location"
          name="returnLocation"
          rules={[
            { required: true, message: "Please input the return location!" },
          ]}
          className="w-1/2"
        >
          <Input placeholder="Market St., Oxford" className="w-full h-8" />
        </Form.Item>
      </div>
    </Form>
  );
};

export default StepOne;
