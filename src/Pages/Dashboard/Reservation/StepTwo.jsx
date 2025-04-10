import React, { useState } from "react";
import { Form, Input, Button, Select, Table, Radio } from "antd";

const { Option } = Select;

const StepTwo = () => {
  const [selectedCar, setSelectedCar] = useState("largePremium");

  const handleCarSizeChange = (e) => {
    setSelectedCar(e.target.value);
    console.log("Selected car size:", e.target.value);
  };

  // Define the columns for the table
  const columns = [
    {
      title: "Car Size",
      dataIndex: "carSize",
      key: "carSize",
      render: (text, record) => (
        <div className="flex items-center space-x-4">
          <Radio
            className="custom-radio"
            value={record.key}
            checked={selectedCar === record.key}
            onChange={handleCarSizeChange}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <Input
          defaultValue={text}
          className="w-full"
          disabled={selectedCar === record.key ? false : true}
        />
      ),
    },
  ];

  // Define the data for the table rows
  const data = [
    {
      key: "largePremium",
      carSize: "Large: Premium",
      price: "$840.00",
    },
    {
      key: "largeStationWagon",
      carSize: "Large: Station wagon",
      price: "$840.00",
    },
    {
      key: "mediumLowEmission",
      carSize: "Medium: Low emission",
      price: "$840.00",
    },
    {
      key: "smallEconomy",
      carSize: "Small: Economy",
      price: "$840.00",
    },
    {
      key: "smallMini",
      carSize: "Small: Mini",
      price: "$840.00",
    },
  ];

  return (
    <Form layout="vertical" initialValues={{ remember: true }}>
      {/* Table for Car Size Options */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName="editable-row"
        bordered
        rowKey="key"
      />

      {/* Choose Vehicle */}
      <div className="mb-4 mt-4">
        <Form.Item
          label="Choose vehicle"
          name="vehicle"
          rules={[{ required: true, message: "Please choose a vehicle!" }]}
        >
          <Select placeholder="-- Choose --" className="w-full">
            <Option value="vehicle1">Vehicle 1</Option>
            <Option value="vehicle2">Vehicle 2</Option>
            <Option value="vehicle3">Vehicle 3</Option>
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
};

export default StepTwo;
