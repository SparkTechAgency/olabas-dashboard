import React, { useState } from "react";
import { Table, Avatar, ConfigProvider, Input, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import GetPageName from "../../../components/common/GetPageName";
import { LuDownload } from "react-icons/lu";
import man from "../../../assets/man.png";
import CustomSearch from "../../../components/common/CustomSearch";

// ✅ Correct Data matching columns
const initialData = [
  {
    key: 1,
    name: "John Lennon",
    contact: "john@example.com",
    phone: "+1 234 567 890",
    totalRentals: 5,
    totalSpent: 10000,
    date: "2/12/2025",
    time: "12:00 PM",
  },
  {
    key: 2,
    name: "Paul McCartney",
    contact: "paul@example.com",
    phone: "+1 987 654 321",
    totalRentals: 8,
    totalSpent: 15000,
    date: "2/12/2025",
    time: "12:00 PM",
  },
  {
    key: 3,
    name: "George Harrison",
    contact: "george@example.com",
    phone: "+1 555 123 456",
    totalRentals: 3,
    totalSpent: 7000,
    date: "2/12/2025",
    time: "12:00 PM",
  },
  {
    key: 4,
    name: "Ringo Starr",
    contact: "ringo@example.com",
    phone: "+1 444 666 777",
    totalRentals: 6,
    totalSpent: 12000,
    date: "2/12/2025",
    time: "12:00 PM",
  },
  {
    key: 5,
    name: "Yoko Ono",
    contact: "yoko@example.com",
    phone: "+1 333 222 111",
    totalRentals: 2,
    totalSpent: 4000,
    date: "2/12/2025",
    time: "12:00 PM",
  },
];

function ClientMangement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState(initialData);

  const handleSearch = (value) => setSearchQuery(value);

  const filteredData = data.filter(
    ({ name, contact, phone, totalRentals, totalSpent, date }) => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        name.toLowerCase().includes(lowerQuery) ||
        contact.toLowerCase().includes(lowerQuery) ||
        phone.toLowerCase().includes(lowerQuery) ||
        totalRentals.toString().includes(lowerQuery) ||
        totalSpent.toString().includes(lowerQuery) ||
        date.includes(lowerQuery)
      );
    }
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
      title: "Client",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Total Rentals",
      dataIndex: "totalRentals",
      key: "totalRentals",
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",
      sorter: (a, b) => a.totalSpent - b.totalSpent,
      render: (totalSpent) => (
        <p className="text-black font-medium">₦ {totalSpent}</p>
      ),
    },
    {
      title: "Last Rental Date",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (_, record) => (
        <div className="flex flex-col">
          <span>{record.date}</span>
          <span>{record.time}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button className="p-1 border-smart">
            <AiOutlineEye size={20} className="text-black" />
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
          showSizeChanger: false,
          showQuickJumper: true,
          position: ["bottomRight"],
        }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
}

export default ClientMangement;

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
