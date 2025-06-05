// import React, { useState } from "react";
// import { Form, Input, Button, Select, Table, Radio } from "antd";

// const { Option } = Select;

// const StepTwo = () => {
//   const [selectedCar, setSelectedCar] = useState("largePremium");

//   const handleCarSizeChange = (e) => {
//     setSelectedCar(e.target.value);
//     console.log("Selected car size:", e.target.value);
//   };

//   // Define the columns for the table
//   const columns = [
//     {
//       title: "Car Size",
//       dataIndex: "carSize",
//       key: "carSize",
//       render: (text, record) => (
//         <div className="flex items-center space-x-4">
//           <Radio
//             className="custom-radio"
//             value={record.key}
//             checked={selectedCar === record.key}
//             onChange={handleCarSizeChange}
//           />
//           <span>{text}</span>
//         </div>
//       ),
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       render: (text, record) => (
//         <Input
//           defaultValue={text}
//           className="w-full"
//           disabled={selectedCar === record.key ? false : true}
//         />
//       ),
//     },
//   ];

//   // Define the data for the table rows
//   const data = [
//     {
//       key: "largePremium",
//       carSize: "Large: Premium",
//       price: "$840.00",
//     },
//     {
//       key: "largeStationWagon",
//       carSize: "Large: Station wagon",
//       price: "$840.00",
//     },
//     {
//       key: "mediumLowEmission",
//       carSize: "Medium: Low emission",
//       price: "$840.00",
//     },
//     {
//       key: "smallEconomy",
//       carSize: "Small: Economy",
//       price: "$840.00",
//     },
//     {
//       key: "smallMini",
//       carSize: "Small: Mini",
//       price: "$840.00",
//     },
//   ];

//   return (
//     <Form layout="vertical" initialValues={{ remember: true }}>
//       {/* Table for Car Size Options */}
//       <Table
//         columns={columns}
//         dataSource={data}
//         pagination={false}
//         rowClassName="editable-row"
//         bordered
//         rowKey="key"
//       />

//       {/* Choose Vehicle */}
//       <div className="mb-4 mt-4">
//         <Form.Item
//           label="Choose vehicle"
//           name="vehicle"
//           rules={[{ required: true, message: "Please choose a vehicle!" }]}
//         >
//           <Select placeholder="-- Choose --" className="w-full">
//             <Option value="vehicle1">Vehicle 1</Option>
//             <Option value="vehicle2">Vehicle 2</Option>
//             <Option value="vehicle3">Vehicle 3</Option>
//           </Select>
//         </Form.Item>
//       </div>
//     </Form>
//   );
// };

// export default StepTwo;

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button, Select, Table, Radio } from "antd";
import {
  setSelectedCarSize,
  setSelectedVehicle,
  setVehiclePrice,
  calculateTotals,
} from "../../../redux/features/ReservationSlice";
const { Option } = Select;

const StepTwo = () => {
  const dispatch = useDispatch();
  const { selectedCarSize, selectedVehicle, vehiclePrice } = useSelector(
    (state) => state.carRental
  );

  const handleCarSizeChange = (e) => {
    const selectedSize = e.target.value;
    const selectedData = data.find((item) => item.key === selectedSize);

    dispatch(setSelectedCarSize(selectedData.carSize));
    dispatch(setVehiclePrice(parseFloat(selectedData.price.replace("$", ""))));

    console.log("Selected car size:", selectedData.carSize);
  };

  const handleVehicleChange = (value) => {
    dispatch(setSelectedVehicle(value));
  };

  const handlePriceChange = (value, record) => {
    if (getSelectedKey() === record.key) {
      const numericPrice = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
      dispatch(setVehiclePrice(numericPrice));
    }
  };

  // Helper function to get the selected key based on current Redux state
  const getSelectedKey = () => {
    return (
      data.find((item) => item.carSize === selectedCarSize)?.key ||
      "largePremium"
    );
  };

  // Calculate totals whenever vehicle price changes
  useEffect(() => {
    dispatch(calculateTotals());
  }, [vehiclePrice, dispatch]);

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
            checked={getSelectedKey() === record.key}
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
          value={
            getSelectedKey() === record.key
              ? `$${vehiclePrice.toFixed(2)}`
              : text
          }
          className="w-full"
          disabled={getSelectedKey() !== record.key}
          onChange={(e) => handlePriceChange(e.target.value, record)}
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
          <Select
            placeholder="-- Choose --"
            className="w-full"
            value={selectedVehicle}
            onChange={handleVehicleChange}
          >
            <Option value="Vehicle 1">Vehicle 1</Option>
            <Option value="Vehicle 2">Vehicle 2</Option>
            <Option value="Vehicle 3">Vehicle 3</Option>
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
};

export default StepTwo;
