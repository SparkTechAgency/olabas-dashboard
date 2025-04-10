import React, { useState } from "react";
import { Table, ConfigProvider, Button, DatePicker, Input } from "antd";
import { FaSortAmountDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import DetailsModal from "./DetailsModal"; // Import the modal component

function Report() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData, setUserData] = useState(data);
  const [filteredData, setFilteredData] = useState(data); // Added for filtering search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSortedAsc, setIsSortedAsc] = useState(true); // Track sorting order
  const [searchText, setSearchText] = useState(""); // State for search input

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleDeleteSelected = () => {
    setUserData(userData.filter((user) => !selectedRowKeys.includes(user.key)));
    setSelectedRowKeys([]);
    setFilteredData(
      filteredData.filter((user) => !selectedRowKeys.includes(user.key))
    ); // Update filtered data
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleSortByDate = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return isSortedAsc ? dateA - dateB : dateB - dateA;
    });

    setFilteredData(sortedData);
    setIsSortedAsc(!isSortedAsc);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = userData.filter(
      (item) =>
        item.reportID.toLowerCase().includes(value.toLowerCase()) ||
        item.postTitle.toLowerCase().includes(value.toLowerCase()) ||
        item.author.toLowerCase().includes(value.toLowerCase()) ||
        item.reportedBy.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDeleteRow = (key) => {
    setUserData(userData.filter((user) => user.key !== key));
    setFilteredData(filteredData.filter((user) => user.key !== key));
  };

  return (
    <>
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">Report Issues</h1>
        <div className="flex gap-3">
          <Button
            icon={<FaSortAmountDown />}
            onClick={handleSortByDate} // Sort on click
            className="bg-smart text-white border-none h-9"
          >
            Sort by Date
          </Button>

          <DatePicker picker="month" className="h-9" />
          <Input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Reports"
            className="h-9 w-64"
          />
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<RiDeleteBin6Line />}
              onClick={handleDeleteSelected}
              className="bg-smart hover:bg-smart text-white border-none h-9"
            >
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns(handleViewDetails, handleDeleteRow)}
        dataSource={filteredData} // Use filtered data
        size="middle"
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          size: "default",
          total: filteredData.length, // Total is based on filtered data
          showSizeChanger: false,
          showQuickJumper: false,
        }}
      />

      {isModalOpen && selectedRecord && (
        <DetailsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          record={selectedRecord}
        />
      )}
    </>
  );
}

export default Report;

const columns = (handleViewDetails, handleDeleteRow) => [
  {
    title: "Report ID",
    dataIndex: "reportID",
    key: "reportID",
  },
  {
    title: "Post ID",
    dataIndex: "postID",
    key: "postID",
  },
  {
    title: "Post Title",
    dataIndex: "postTitle",
    key: "postTitle",
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Reported By",
    dataIndex: "reportedBy",
    key: "reportedBy",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, record) => (
      <span
        className={`font-medium text-${
          record.status === "Resolve" ? "green-500" : "red-500"
        }`}
      >
        {record.status}
      </span>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text) => new Date(text).toLocaleDateString(), // Format Date
  },
  {
    key: "action",
    render: (text, record) => (
      <div className="flex items-center gap-3">
        <IoEye
          size={25}
          className="hover:text-sky-500 cursor-pointer"
          onClick={() => handleViewDetails(record)}
        />
        <RiDeleteBin6Line
          size={20}
          className="hover:text-red-500 cursor-pointer"
          onClick={() => handleDeleteRow(record.key)} // Delete row
        />
      </div>
    ),
  },
];

// Updated data with correct date format
const data = [
  {
    key: 1,
    reportID: "R001",
    postID: "P001",
    postTitle: "Title 1",
    author: "Author 1",
    reportedBy: "User 1",
    status: "Under Review",
    date: "2024-12-11", // Corrected Date Format
  },
  {
    key: 2,
    reportID: "R002",
    postID: "P002",
    postTitle: "Title 2",
    author: "Author 2",
    reportedBy: "User 2",
    status: "Resolve",
    date: "2024-06-11",
  },
  {
    key: 3,
    reportID: "R003",
    postID: "P003",
    postTitle: "Title 3",
    author: "Author 3",
    reportedBy: "User 3",
    status: "Resolve",
    date: "2024-12-05",
  },
  {
    key: 4,
    reportID: "R004",
    postID: "P004",
    postTitle: "Title 4",
    author: "Author 4",
    reportedBy: "User 4",
    status: "Under Review",
    date: "2024-10-01",
  },
];
