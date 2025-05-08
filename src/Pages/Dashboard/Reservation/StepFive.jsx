import React, { useState } from "react";
import { Form, Input, Button, Radio } from "antd";

import { IoAt } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import CustomSearch from "../../../components/common/CustomSearch";
const StepFive = () => {
  const [clientType, setClientType] = useState(null);

  const handleClientChange = (e) => {
    setClientType(e.target.value);
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  return (
    <div className="w-full rounded-lg">
      <Radio.Group
        className="w-full flex gap-40"
        name="radiogroup"
        defaultValue={1}
        onChange={handleClientChange}
        options={[
          { value: 1, label: "Create a new client" },
          { value: 2, label: "Use an existing client" },
        ]}
      />
      <Form layout="vertical" className="w-full mt-4">
        {clientType === 2 && (
          <Form.Item
            name="firstName"
            label={<h3 className="text-xs font-semibold">Find Client</h3>}
            rules={[{ required: true, message: "Please input Client!" }]}
            className="flex-1 mb-0"
          >
            <CustomSearch placeholder="Search by name, email, or Phone" />
          </Form.Item>
        )}

        <div className="flex items-center my-4">
          <label className="w-40 font-semibold text-left pr-4">
            First Name
          </label>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "Please input First Name!" }]}
            className="flex-1 mb-0"
          >
            <Input placeholder="Hogarth Road, London" className="h-8" />
          </Form.Item>
        </div>

        <div className="flex items-center mb-4">
          <label className="w-40 font-semibold text-left pr-4">Last Name</label>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Please input the Last Name!" }]}
            className="flex-1 mb-0"
          >
            <Input placeholder="Market St., Oxford" className="h-8" />
          </Form.Item>
        </div>
        <div className="flex items-center mb-4">
          <label className="w-40 font-semibold text-left pr-4">Email</label>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input Email!" }]}
            className="flex-1 mb-0"
          >
            <Input
              placeholder="Market St., Oxford"
              className="h-8 "
              addonBefore={<IoAt size={20} className="text-smart" />}
            />
          </Form.Item>
        </div>
        <div className="flex items-center mb-4">
          <label className="w-40 font-semibold text-left pr-4">
            Return Location
          </label>
          <Form.Item
            name="returnLocation"
            rules={[
              { required: true, message: "Please input the return location!" },
            ]}
            className="flex-1 mb-0"
          >
            <Input
              placeholder="Market St., Oxford"
              className="h-8"
              addonBefore={<MdLocalPhone size={20} className="text-smart" />}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default StepFive;
