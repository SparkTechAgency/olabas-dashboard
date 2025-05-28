import React, { useState } from "react";
import { Table, Button, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { LuDownload } from "react-icons/lu";
import { GrFormAdd } from "react-icons/gr";
import CustomSearch from "../../../components/common/CustomSearch";
import GetPageName from "../../../components/common/GetPageName";
import ReservationAddModal from "./ReservationAddModal";

function Reservation() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const onSearch = (value) => {
    console.log("Search value:", value);
    // Search handling here if needed
  };

  return (
    <>
      <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
      <div className="flex justify-between items-center py-5">
        <Button
          icon={<GrFormAdd size={25} />}
          onClick={showModal}
          className="bg-smart hover:bg-smart text-white border-none h-8"
        >
          Add reservation
        </Button>
        <div className="flex gap-3">
          <CustomSearch onSearch={onSearch} placeholder="search..." />
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<DeleteOutlined />}
              className="bg-smart hover:bg-smart text-white border-none h-8"
            >
              Delete Selected
            </Button>
          )}
          <Button
            icon={<LuDownload size={20} />}
            className="bg-smart hover:bg-smart text-white border-none h-8"
          >
            Export
          </Button>
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={userData}
        rowClassName={() => "text-black"}
        size="small"
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          size: "default",
          showSizeChanger: false,
          showQuickJumper: false,
        }}
      />

      <ReservationAddModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        handleCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default Reservation;

const columns = [
  {
    title: "Pickup",
    dataIndex: "pickUp",
    key: "pickUp",
    render: (text, record) => (
      <div className="flex flex-col">
        <span>{record.pickupTime}</span>
        <span>{record.pickupLocation}</span>
      </div>
    ),
  },
  {
    title: "Return",
    dataIndex: "return",
    key: "return",
    render: (text, record) => (
      <div className="flex flex-col">
        <span>{record.returnTime}</span>
        <span>{record.returnLocation}</span>
      </div>
    ),
  },
  {
    title: "Car",
    dataIndex: "car",
    key: "car",
    render: (text, record) => (
      <div className="flex flex-col">
        <span>{record.carSize}</span>
        <div className="flex">
          <span>{record.carNumberPlate}, </span>
          <span>{record.carModel}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Client",
    dataIndex: "client",
    key: "client",
    render: (text, record) => (
      <div className="flex flex-col">
        <span>{text}</span>
        <span>{record.clientPhone}</span>
      </div>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text, record) => (
      <Select className="w-fit" placeholder="Assign Driver">
        <Option>Driver 1</Option>
        <Option>Driver 2</Option>
        <Option>Driver 3</Option>
      </Select>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => {
      const getStatusColor = (status) => {
        switch (status) {
          case "Confirmed":
            return "bg-[#5AC5B6]";
          case "Not Confirmed":
            return "bg-[#F9C74F]";
          case "Canceled":
            return "bg-[#F37272]";
          default:
            return "bg-[#90BE6D]";
        }
      };
      return (
        <div className="flex justify-start">
          <span
            className={`text-xs font-light text-white px-2 py-0.5 rounded ${getStatusColor(
              text
            )}`}
          >
            {text}
          </span>
        </div>
      );
    },
  },
];

const data = [
  {
    key: 1,
    pickupTime: "2/12/2025, 9:00 am",
    pickupLocation: "Hogarth Road, London",
    returnTime: "2/12/2025, 9:00 am",
    returnLocation: "Hogarth Road, London",
    carSize: "Small: Economy",
    carNumberPlate: "OA124431",
    carModel: "Opel Astra",
    client: "Kennedy Okoth",
    clientPhone: "+12345058104",
    price: "₦10,000",
    status: "Confirmed",
  },
  {
    key: 2,
    pickupTime: "2/12/2025, 9:00 am",
    pickupLocation: "Hogarth Road, London",
    returnTime: "2/12/2025, 9:00 am",
    returnLocation: "Hogarth Road, London",
    carSize: "Small: Economy",
    carNumberPlate: "OA124431",
    carModel: "Opel Astra",
    client: "Kennedy Okoth",
    clientPhone: "+12345058104",
    price: "₦10,000",
    status: "Not Confirmed",
  },
  {
    key: 3,
    pickupTime: "2/12/2025, 9:00 am",
    pickupLocation: "Hogarth Road, London",
    returnTime: "2/12/2025, 9:00 am",
    returnLocation: "Hogarth Road, London",
    carSize: "Small: Economy",
    carNumberPlate: "OA124431",
    carModel: "Opel Astra",
    client: "Kennedy Okoth",
    clientPhone: "+12345058104",
    price: "₦10,000",
    status: "Canceled",
  },
  {
    key: 4,
    pickupTime: "2/12/2025, 9:00 am",
    pickupLocation: "Hogarth Road, London",
    returnTime: "2/12/2025, 9:00 am",
    returnLocation: "Hogarth Road, London",
    carSize: "Small: Economy",
    carNumberPlate: "OA124431",
    carModel: "Opel Astra",
    client: "Kennedy Okoth",
    clientPhone: "+12345058104",
    price: "₦10,000",
    status: "Completed",
  },
  {
    key: 5,
    pickupTime: "2/12/2025, 9:00 am",
    pickupLocation: "Hogarth Road, London",
    returnTime: "2/12/2025, 9:00 am",
    returnLocation: "Hogarth Road, London",
    carSize: "Small: Economy",
    carNumberPlate: "OA124431",
    carModel: "Opel Astra",
    client: "Kennedy Okoth",
    clientPhone: "+12345058104",
    price: "₦10,000",
    status: "Completed",
  },
];
