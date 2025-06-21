import { useState, useEffect } from "react";
import { Table, Button, message, Pagination, Alert } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { FaCheck, FaPlus } from "react-icons/fa";
import { GrFormAdd } from "react-icons/gr";

import driver from "../../../assets/driver.png";
import AddEditTeamMember from "./AddEditTeamModal";
import {
  useDeleteTeamMutation,
  useGetTeamQuery,
} from "../../../redux/apiSlices/team";
import { getImageUrl } from "../../../utils/baseUrl";

function Team() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const {
    data: teamData,
    isError,
    isLoading,
    error,
  } = useGetTeamQuery({ page, limit, status: filter.toLowerCase() });

  const [deleteTeam] = useDeleteTeamMutation();

  // Handle API errors with proper message display
  useEffect(() => {
    if (isError && error) {
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
    }
  }, [isError, error]);

  // Function to extract proper error message from API response
  const getErrorMessage = (error) => {
    // Check if it's an RTK Query error with data
    if (error?.data) {
      const errorData = error.data;

      // If there's a specific message
      if (errorData.message) {
        return errorData.message;
      }

      // If there are errorMessages array
      if (errorData.errorMessages && errorData.errorMessages.length > 0) {
        return errorData.errorMessages.map((err) => err.message).join(", ");
      }
    }

    // Check if it's a network error
    if (error?.status === "FETCH_ERROR") {
      return "Network error: Unable to connect to the server";
    }

    // Generic error message
    return error?.message || "An unexpected error occurred";
  };

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  // Show Add Modal
  const handleAdd = () => {
    setEditingRecord(null);
    setIsAddModalOpen(true);
  };

  // Show Edit Modal with selected record
  const handleEdit = (record) => {
    console.log("Edit clicked for record:", record);
    setEditingRecord(record);
    setTimeout(() => {
      setIsEditModalOpen(true);
    }, 0);
  };

  // Close Add Modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingRecord(null);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
  };

  // Handle form submit for Add
  const handleAddSubmit = () => {
    setIsAddModalOpen(false);
    setEditingRecord(null);
  };

  // Handle form submit for Edit
  const handleEditSubmit = () => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
  };

  // Delete single item with enhanced error handling
  const handleDeleteSingle = async (id) => {
    try {
      const res = await deleteTeam(id).unwrap();
      message.success("Team member deleted successfully");
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      const errorMessage = getErrorMessage(err);
      message.error(errorMessage);
    }
  };

  // Delete multiple selected items with enhanced error handling
  const handleDeleteMultiple = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select items to delete");
      return;
    }

    try {
      await Promise.all(selectedRowKeys.map((id) => deleteTeam(id).unwrap()));
      message.success("Selected team members deleted successfully");
      setSelectedRowKeys([]);
    } catch (err) {
      console.error("Delete failed:", err);
      const errorMessage = getErrorMessage(err);
      message.error(errorMessage);
    }
  };

  // Row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Transform and filter data
  const transformedData = teamData?.data?.result?.map((item) => ({
    key: item._id,
    _id: item._id,
    id: item._id,
    image: item.image,
    name: item.name,
    designation: item.designation,
    teamRole: item.teamRole,
    teamDescription: item.teamDescription,
    status: item.status === "active" ? "Active" : "Inactive",
  }));

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
      render: (image) =>
        image ? (
          <img
            src={`${getImageUrl}${image}`}
            alt="Team"
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <img
            src={driver}
            alt="Team"
            className="w-12 h-12 object-cover rounded"
          />
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Role",
      dataIndex: "teamRole",
      key: "teamRole",
      sorter: (a, b) => a.teamRole.localeCompare(b.teamRole),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      sorter: (a, b) => a.designation.localeCompare(b.designation),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Description",
      dataIndex: "teamDescription",
      key: "teamDescription",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
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
            className="p-1 border-2 border-smart rounded-full"
          >
            <FiEdit3 size={20} className="text-black" />
          </Button>
          <Button
            className="p-1 border-2 border-smart rounded-full"
            onClick={() => handleDeleteSingle(record._id)}
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

  if (isLoading) return <div>Loading...</div>;

  // Enhanced error display
  if (isError) {
    const errorMessage = getErrorMessage(error);
    return (
      <div className="p-4">
        <Alert
          message="Error Loading Team Data"
          description={errorMessage}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

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
                onClick={handleDeleteMultiple}
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

      <div className="max-h-[72vh] overflow-auto border rounded-md">
        <Table
          columns={columns}
          dataSource={transformedData || []}
          rowSelection={rowSelection}
          size="small"
          pagination={false}
          rowKey="key"
        />
      </div>

      <Pagination
        current={page}
        pageSize={limit}
        total={teamData?.data?.meta?.total || 0}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        size="small"
        align="end"
        showSizeChanger={true}
        showQuickJumper={true}
        pageSizeOptions={["10", "20", "50"]}
        onChange={(newPage, newPageSize) => {
          setPage(newPage);
          setLimit(newPageSize);
        }}
        onShowSizeChange={(current, size) => {
          setPage(1);
          setLimit(size);
        }}
        className="mt-2 text-right"
      />

      {/* Add Modal */}
      <AddEditTeamMember
        isModalOpen={isAddModalOpen}
        handleOk={handleAddSubmit}
        handleCancel={closeAddModal}
        isEdit={false}
        editData={null}
      />

      {/* Edit Modal */}
      {editingRecord && (
        <AddEditTeamMember
          isModalOpen={isEditModalOpen}
          handleOk={handleEditSubmit}
          handleCancel={closeEditModal}
          isEdit={true}
          editData={editingRecord}
        />
      )}
    </>
  );
}

export default Team;
