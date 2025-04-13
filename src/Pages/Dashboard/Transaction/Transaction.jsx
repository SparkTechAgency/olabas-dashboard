import React, { useState } from "react";
import { Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import GetPageName from "../../../components/common/GetPageName";
import { LuDownload } from "react-icons/lu";

import CustomSearch from "../../../components/common/CustomSearch";

// Sample Data
const initialData = [
  {
    key: 1,
    date: "2/12/2025",
    time: "12:00 PM",
    bookingID: "#10234",
    name: "John Lennon",
    transactionID: "#1214454",
    ammount: 10000,
    status: "Paid",
  },
  {
    key: 2,
    date: "2/12/2025",
    time: "12:00 PM",
    bookingID: "#10234",
    name: "Paul McCartney",
    transactionID: "#121idj54",
    ammount: 10000,

    status: "Pending",
  },
  {
    key: 3,
    date: "2/12/2025",
    time: "12:00 PM",
    bookingID: "#10234",
    name: "George Harrison",
    transactionID: "#1256789",
    ammount: 10000,

    status: "Paid",
  },
  {
    key: 4,
    date: "2/12/2025",
    time: "12:00 PM",
    bookingID: "#10234",
    name: "Ringo Starr",
    transactionID: "#1239874",
    ammount: 10000,
    status: "Paid",
  },
  {
    key: 5,
    date: "2/12/2025",
    time: "12:00 PM",
    bookingID: "#10234",
    name: "Ringo Starr",
    transactionID: "#1239874",
    ammount: 10000,
    status: "Pending",
  },
];

function Transaction() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState(initialData);

  const handleSearch = (value) => setSearchQuery(value);

  const filteredData = data.filter(
    ({ name, ...rest }) =>
      Object.entries(rest).some(([key, value]) => {
        if (key === "date") {
          return new Date(value).toLocaleDateString().includes(searchQuery);
        }
        if (key === "ammount") {
          return value.toString().includes(searchQuery);
        }
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }) || name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const handleDelete = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (text, record) => (
        <div className="flex flex-col">
          <span>{record.date}</span>
          <span>{record.time}</span>
        </div>
      ),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionID",
      key: "transactionID",
    },

    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Ammount",
      dataIndex: "ammount",
      key: "ammount",
      sorter: (a, b) => a.ammount - b.ammount,
      render: (ammount) => (
        <p className="text-black font-medium">₦ {ammount}</p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const getStatusColor = (status) => {
          switch (status) {
            case "Paid":
              return "bg-[#90BE6D]";
            case "Pending":
              return "bg-[#F9C74F]";
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

    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button className="p-1 border-smart">
            <AiOutlineEye size={20} className="text-black " />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head
        onSearch={handleSearch}
        pagename="Transactions"
        selectedRowKeys={selectedRowKeys}
        handleDelete={handleDelete}
        filteredData={filteredData}
      />

      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={filteredData}
        size="small"
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          total: filteredData.length,
          showSizeChanger: false,
          showQuickJumper: false,
        }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
}

export default Transaction;

// ✅ Head Component
function Head({ onSearch, selectedRowKeys, handleDelete, filteredData }) {
  return (
    <div className="flex justify-between items-center py-5">
      <h1 className="text-[20px] font-medium">{GetPageName()}</h1>

      <div className="flex gap-3 items-center">
        <CustomSearch onSearch={onSearch} placeholder="search..." />

        {selectedRowKeys.length > 1 && (
          <Button
            onClick={handleDelete}
            icon={<DeleteOutlined />}
            className="bg-smart text-white border-none h-8"
          >
            {selectedRowKeys.length === filteredData.length
              ? "Delete All"
              : "Delete Selected"}
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
  );
}
