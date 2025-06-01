import React, { useState } from "react";
import { Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { FaCheck, FaPlus } from "react-icons/fa";
import { GrFormAdd } from "react-icons/gr";

import driver from "../../../assets/driver.png";
import AddNewMember from "./AddNewMember";
import EditMember from "./EditMember";

const initialData = [
  {
    key: 1,
    description: "Driver",
    price: "$50",
    status: "Active",
    image: driver,
    name: "Large: Premium",
    role: "authority",
    designation: "Senior Driver",
  },
  {
    key: 2,
    description: "Driver",
    price: "$60",
    status: "Inactive",
    image: driver,
    name: "Large: Premium",
    role: "member",
    designation: "Junior Driver",
  },
  // Add more as needed
];

function Team() {
  const [data, setData] = useState(initialData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Show Add Modal
  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  // Show Edit Modal with selected record
  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  // Close Add Modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
  };

  // Handle form submit for both add and edit
  const handleSubmit = (record) => {
    if (record.key) {
      // Edit existing
      setData((prev) =>
        prev.map((item) => (item.key === record.key ? record : item))
      );
    } else {
      // Add new
      setData((prev) => [...prev, { ...record, key: Date.now() }]);
    }
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingRecord(null);
  };

  // Delete selected rows
  const handleDelete = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  // Row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Filter data by status
  const filteredData =
    filter === "All" ? data : data.filter((item) => item.status === filter);

  // Helper for status badge color
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

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={typeof image === "string" ? image : driver}
          alt="Team"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div className="flex justify-start">
          <span
            className={`text-xs font-light text-white px-2 py-0.5 rounded ${getStatusColor(
              text
            )}`}
          >
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            onClick={() => handleEdit(record)}
            className="p-1 border-smart"
          >
            <FiEdit3 size={20} className="text-black" />
          </Button>
          <Button
            className="p-1 border-smart"
            onClick={() => {
              setData(data.filter((item) => item.key !== record.key));
              setSelectedRowKeys((keys) =>
                keys.filter((k) => k !== record.key)
              );
            }}
          >
            <RiDeleteBin6Line size={20} className="text-black" />
          </Button>
        </div>
      ),
    },
  ];

  // Filter button styles helpers
  const isActive = (key) =>
    filter === key
      ? "bg-smart text-white"
      : "bg-transparent text-gray-400 border hover:bg-smart hover:text-white";

  const iconClass = (key) =>
    filter === key ? "text-white" : "text-gray-400 group-hover:text-white";

  return (
    <>
      <div>
        <h1 className="text-[20px] font-medium">Team Management</h1>
        <div className="flex justify-between items-center py-5">
          <Button
            icon={<GrFormAdd size={25} />}
            onClick={handleAdd}
            className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
          >
            Add Team
          </Button>

          <div className="flex gap-3 items-center">
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
                onClick={() => setFilter("All")}
                className={`group text-xs px-2 h-8 flex items-center border rounded ${isActive(
                  "All"
                )}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("Active")}
                className={`group text-xs px-2 h-8 flex items-center gap-1 border rounded ${isActive(
                  "Active"
                )}`}
              >
                <FaCheck className={iconClass("Active")} />
                Active
              </button>
              <button
                onClick={() => setFilter("Inactive")}
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
        rowKey="key"
      />

      <AddNewMember
        isModalOpen={isAddModalOpen}
        handleOk={handleSubmit}
        handleCancel={closeAddModal}
      />

      <EditMember
        isModalOpen={isEditModalOpen}
        handleOk={handleSubmit}
        handleCancel={closeEditModal}
        editingRecord={editingRecord}
      />
    </>
  );
}

export default Team;
