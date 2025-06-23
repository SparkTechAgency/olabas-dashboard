import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import {
  Flex,
  Input,
  Table,
  Popover,
  Button,
  Modal,
  message,
  Spin,
} from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

import ButtonEDU from "../../../components/common/ButtonEDU";
import { MdMoreVert } from "react-icons/md";
import {
  useCreateManagerMutation,
  useDeleteManagerMutation,
  useGetManagerQuery,
  useUpdateManagerMutation,
} from "../../../redux/apiSlices/managerManagementApi";
import ManagerModal from "./ManagerModal";

const ManagerList = () => {
  const {
    data: managerData,
    isLoading,
    isError,
    refetch,
  } = useGetManagerQuery();
  const [createManager, { isLoading: isCreating }] = useCreateManagerMutation();
  const [updateManager, { isLoading: isUpdating }] = useUpdateManagerMutation();
  const [deleteManager, { isLoading: isDeleting }] = useDeleteManagerMutation();

  console.log("Manager Data:", managerData?.data);

  const [searchText, setSearchText] = useState("");
  const [managers, setManagers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Update local state when API data changes
  useEffect(() => {
    if (managerData?.data) {
      // Transform API data to match table structure
      const transformedData = managerData.data.map((manager, index) => ({
        key: manager.id || manager._id || index + 1,
        id: manager.id || manager._id,
        name: manager.name || "",
        email: manager.email || "",
        role: manager.role || "Manager",
        creationdate: manager.createdAt
          ? new Date(manager.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
      }));

      setManagers(transformedData);
      setFilteredData(transformedData);
    }
  }, [managerData]);

  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedManager, setSelectedManager] = useState(null);

  // Check if maximum managers reached (10)
  const isMaxManagersReached = managers.length >= 10;

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = managers.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-5 flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-5 flex justify-center items-center min-h-96">
        <div className="text-red-500 text-center">
          <p>Error loading manager data</p>
          <p className="text-sm text-gray-500">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  // Add Manager functionality
  const showAddModal = () => {
    if (isMaxManagersReached) {
      message.warning("Maximum 10 managers allowed!");
      return;
    }
    setModalMode("add");
    setSelectedManager(null);
    setIsManagerModalOpen(true);
  };

  // Edit Manager functionality
  const showEditModal = (record) => {
    setModalMode("edit");
    setSelectedManager(record);
    setIsManagerModalOpen(true);
  };

  const handleCloseManagerModal = () => {
    setIsManagerModalOpen(false);
    setSelectedManager(null);
  };

  const handleSubmitManager = async (managerData) => {
    try {
      if (modalMode === "add") {
        // Check again before creating
        if (isMaxManagersReached) {
          message.warning("Maximum 10 managers allowed!");
          return;
        }

        const result = await createManager(managerData).unwrap();
        message.success("Manager created successfully!");

        // Refetch data to get updated list
        refetch();
      } else {
        // Edit mode
        const result = await updateManager({
          id: selectedManager.id,
          updatedData: managerData,
        }).unwrap();
        message.success("Manager updated successfully!");

        // Refetch data to get updated list
        refetch();
      }

      setIsManagerModalOpen(false);
      setSelectedManager(null);
    } catch (error) {
      console.error("Error saving manager:", error);
      const errorMessage =
        error?.data?.message || error?.message || "An error occurred";
      message.error(
        `Failed to ${
          modalMode === "add" ? "create" : "update"
        } manager: ${errorMessage}`
      );
    }
  };

  // Delete Manager functionality
  const showDeleteModal = (record) => {
    setSelectedManager(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedManager) return;

    try {
      await deleteManager(selectedManager.id).unwrap();
      message.success("Manager deleted successfully!");

      // Refetch data to get updated list
      refetch();

      setIsDeleteModalOpen(false);
      setSelectedManager(null);
    } catch (error) {
      console.error("Error deleting manager:", error);
      const errorMessage =
        error?.data?.message || error?.message || "An error occurred";
      message.error(`Failed to delete manager: ${errorMessage}`);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-5">
      <TableHead
        searchText={searchText}
        handleSearch={handleSearch}
        onAdd={showAddModal}
        isMaxManagersReached={isMaxManagersReached}
        currentManagerCount={managers.length}
      />
      <TableBody
        filteredData={filteredData}
        onEdit={showEditModal}
        onDelete={showDeleteModal}
        isDeleting={isDeleting}
      />

      {/* Manager Modal (Add/Edit) */}
      <ManagerModal
        isOpen={isManagerModalOpen}
        onClose={handleCloseManagerModal}
        onSubmit={handleSubmitManager}
        selectedManager={selectedManager}
        mode={modalMode}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Manager Modal */}
      <Modal
        title="Delete Manager"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        centered
        className="z-50"
        confirmLoading={isDeleting}
      >
        <DeleteManager
          name={selectedManager?.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isDeleting}
        />
      </Modal>
    </div>
  );
};

const TableHead = ({
  searchText,
  handleSearch,
  onAdd,
  isMaxManagersReached,
  currentManagerCount,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Input
        placeholder="Search managers..."
        value={searchText}
        onChange={handleSearch}
        className="w-1/3 h-8"
        allowClear
      />
      <div className="flex items-center gap-3">
        {isMaxManagersReached && (
          <span className="text-sm text-gray-500">
            Maximum managers reached ({currentManagerCount}/10)
          </span>
        )}
        {!isMaxManagersReached && (
          <ButtonEDU actionType="add" onClick={onAdd}>
            <div className="flex items-center justify-center gap-2">
              <FaPlus size={15} /> Add new
            </div>
          </ButtonEDU>
        )}
      </div>
    </div>
  );
};

const TableBody = ({ filteredData, onEdit, onDelete, isDeleting }) => (
  <Table
    rowKey={(record) => record.key}
    columns={columns(onEdit, onDelete, isDeleting)}
    dataSource={filteredData}
    pagination={false}
    className="mt-5"
    loading={isDeleting}
  />
);

const DeleteManager = ({ name, onConfirm, onCancel, isLoading }) => (
  <Flex
    vertical
    justify="space-between"
    className="w-full h-full mb-3 mt-3"
    gap={20}
  >
    <Flex align="center" justify="center">
      Are you sure you want to delete{" "}
      <span className="font-bold ml-1">{name}</span>?
    </Flex>
    <div className="flex items-center justify-center gap-4">
      <ButtonEDU actionType="cancel" onClick={onCancel} disabled={isLoading}>
        Cancel
      </ButtonEDU>
      <ButtonEDU actionType="delete" onClick={onConfirm} loading={isLoading}>
        Delete
      </ButtonEDU>
    </div>
  </Flex>
);

const columns = (onEdit, onDelete, isDeleting) => [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Creation Date", dataIndex: "creationdate", key: "creationdate" },
  {
    title: "Actions",
    key: "action",
    render: (_, record) => (
      <Popover
        content={
          <div className="flex gap-3">
            <Button
              onClick={() => onEdit(record)}
              disabled={isDeleting}
              title="Edit Manager"
            >
              <EditFilled />
            </Button>
            <Button
              onClick={() => onDelete(record)}
              className="text-red-500 hover:text-white"
              disabled={isDeleting}
              title="Delete Manager"
            >
              <DeleteFilled />
            </Button>
          </div>
        }
        trigger="hover"
      >
        <MdMoreVert size={25} className="cursor-pointer" />
      </Popover>
    ),
  },
];

export default ManagerList;
