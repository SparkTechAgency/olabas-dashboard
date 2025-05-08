import React, { useState } from "react";
import { Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetPageName from "../../../components/common/GetPageName";
import { FiEdit3 } from "react-icons/fi";
import { FaCheck, FaPlus } from "react-icons/fa";
import { GrFormAdd } from "react-icons/gr";

import driver from "../../../assets/driver.png";
import AddNewExtraModal from "./AddNewExtraModal";
// ✅ Correct Data matching columns
const initialData = [
  {
    key: 1,
    description: "Driver",
    price: "$50",
    status: "Active",
    icon: driver,
    name: "Large: Premium",
  },
  {
    key: 2,
    description: "Driver",
    price: "$60",
    status: "Inactive",
    icon: driver,
    name: "Large: Premium",
  },
  {
    key: 3,
    description: "Driver",
    price: "$80",
    status: "Inactive",
    icon: driver,
    name: "Large: Premium",
  },
  {
    key: 4,
    description: "Driver",
    price: "$90",
    status: "Inactive",
    icon: driver,
    name: "Large: Premium",
  },
  {
    key: 5,
    description: "Driver",
    price: "$100",
    status: "Active",
    icon: driver,
    name: "Large: Premium",
  },
];

function Extra() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  const handleSearch = (value) => setSearchQuery(value);

  const [editingRecord, setEditingRecord] = useState(null);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSubmit = (values) => {
    const file = values.image?.[0];
    const imageUrl = file?.preview || file?.url || null;

    const newRecord = {
      ...editingRecord,
      ...values,
      image: imageUrl,
      key: editingRecord?.key || Date.now(),
    };

    const updatedData = editingRecord
      ? data.map((item) => (item.key === newRecord.key ? newRecord : item))
      : [...data, newRecord];

    setData(updatedData);
    setEditingRecord(null);
    setIsModalOpen(false);
  };
  const handleDelete = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const filteredData =
    filter === "All" ? data : data.filter((item) => item.status === filter);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="extra"
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <img
            src={driver}
            alt="extra"
            className="w-12 h-12 object-cover rounded"
          />
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const getStatusColor = (status) => {
          switch (status) {
            case "Active":
              return "bg-[#90BE6D]";
            case "Inactive":
              return "bg-[#F37272]";
            default:
              return "bg-gray-400";
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
          <Button
            className="p-1 border-smart"
            onClick={() => handleEdit(record)}
          >
            <FiEdit3 size={20} className="text-black" />
          </Button>
          <Button className="p-1 border-smart">
            <RiDeleteBin6Line size={20} className="text-black" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head
        selectedRowKeys={selectedRowKeys}
        handleDelete={handleDelete}
        showModal={showModal}
        filter={filter}
        setFilter={setFilter}
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

      <AddNewExtraModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
      />
    </>
  );
}

export default Extra;

// ✅ Head Component with filtering support
function Head({ selectedRowKeys, handleDelete, showModal, filter, setFilter }) {
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const isActive = (key) =>
    filter === key
      ? "bg-smart text-white"
      : "bg-transparent text-gray-400 border hover:bg-smart hover:text-white";

  const iconClass = (key) =>
    filter === key ? "text-white" : "text-gray-400 group-hover:text-white";

  return (
    <div>
      <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
      <div className="flex justify-between items-center py-5">
        <Button
          icon={<GrFormAdd size={25} />}
          onClick={showModal}
          className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
        >
          Add Extra
        </Button>
        <div className="flex gap-3">
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
            >
              Delete ({selectedRowKeys.length})
            </Button>
          )}
          <div className="flex gap-1">
            <button
              onClick={() => handleFilterChange("All")}
              className={`group text-xs px-2 h-8 flex items-center border rounded ${isActive(
                "All"
              )}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("Active")}
              className={`group text-xs px-2 h-8 flex items-center gap-1 border rounded ${isActive(
                "Active"
              )}`}
            >
              <FaCheck className={iconClass("Active")} />
              Active
            </button>
            <button
              onClick={() => handleFilterChange("Inactive")}
              className={`group text-xs px-2 h-8 flex items-center gap-1 border rounded ${isActive(
                "Inactive"
              )}`}
            >
              <FaPlus className={`rotate-45 ${iconClass("Inactive")}`} />
              Inactive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
