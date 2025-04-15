import React, { useState } from "react";
import { Table } from "antd";
import GetPageName from "../../../components/common/GetPageName";
import App from "./Table";

// List of drivers
const driverList = [
  "uche",
  "soji",
  "musili",
  "solomon",
  "isreal",
  "paul",
  "adebayo",
  "chinedu",
  "kemi",
  "tunde",
  "ada1",
  "bola1",
  "ada2",
  "bola2",
  "ada3",
  "bola4",
  "ada5",
  "bola6",
  "kemi",
  "tunde",
  "ada1",
  "bola1",
  "ada2",
  "bola2",
  "ada3",
  "bola4",
  "ada5",
  "valzsg",
];

// Generate initial table data (50 days)
const generateInitialData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    key: i,
    date: `March ${i + 1}, 2025`,
    uche: "PRADO 2",
    soji: "BAMIDELE BMW",
    musili: "MARINO / Sienna",
    solomon: "GX460",
    isreal: "Highlander-2",
    paul: "ACURA",
    adebayo: "Toyota Camry",
    chinedu: "Honda Accord",
    kemi: "Lexus RX350",
    tunde: "Ford Explorer",
    ada1: "Nissan Altima",
    bola1: "Hyundai Sonata",
    ada2: "Nissan Maxima",
    bola2: "Hyundai Elantra",
    ada3: "Mazda 3",
    bola4: "Toyota Yaris",
    ada5: "Chevrolet Cruze",
    bola6: "Subaru Impreza",
  }));
};

// Generate booking/completion status randomly
const generateBookingData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    const date = `March ${i + 1}, 2025`;
    driverList.forEach((driver, index) => {
      const isEven = (i + index) % 2 === 0;
      data.push({
        driver: driver,
        car: driver.toUpperCase() + " CAR",
        date,
        isBooked: isEven,
        isCompleted: !isEven,
      });
    });
  }
  return data;
};

const bookingData = generateBookingData();

// Table columns
const columns = [
  {
    title: "Driver / Date",
    dataIndex: "date",
    key: "date",
    fixed: "left",
    width: 120,
  },
  ...driverList.map((driver) => ({
    title: driver.charAt(0).toUpperCase() + driver.slice(1),
    dataIndex: driver,
    key: driver,
    width: 120,
    render: (text, record) => {
      const booking = bookingData.find(
        (item) =>
          item.driver.toLowerCase() === driver && item.date === record.date
      );

      let bgColor = "";
      if (booking?.isBooked) bgColor = "#ED5565"; // red for booked
      if (booking?.isCompleted) bgColor = "#F2AF1E"; // yellow for completed

      return (
        <div
          style={{
            backgroundColor: bgColor,
            padding: "4px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      );
    },
  })),
];

// Main Page Component
function DriverManagement() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState(generateInitialData());

  const handleSearch = () => {};
  const handleDelete = () => {};
  const filteredData = data;

  return (
    <div className="driver-management-container">
      <Header
        onSearch={handleSearch}
        pagename="Transactions"
        selectedRowKeys={selectedRowKeys}
        handleDelete={handleDelete}
        filteredData={filteredData}
      />

      {/* <div className="w-[50%] h-full  border rounded-md "> */}
      {/* <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 800, y: 400 }}
          pagination={false}
          bordered
          sticky
          size="small"
          scrollToFirstRowOnChange={true}
        /> */}
      <App />
      {/* </div> */}
    </div>
  );
}

export default DriverManagement;

// Header Component
const Header = ({ pagename }) => {
  return (
    <div className="flex flex-col justify-between items-start py-5">
      <h1 className="text-[20px] font-medium">{GetPageName() || pagename}</h1>
      <div className="mt-5 flex gap-3">
        <button className="bg-[#ED5565] text-white hover:bg-[#ED5565]/80 text-xs px-2 h-7 rounded">
          Booked
        </button>
        <button className="bg-[#F2AF1E] text-white hover:bg-[#F2AF1E]/80 text-xs px-2 h-7 rounded">
          Completed
        </button>
      </div>
    </div>
  );
};
