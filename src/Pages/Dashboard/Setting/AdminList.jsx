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
import AdminModal from "./AdminModal";
import {
  useGetAdminQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from "../../../redux/apiSlices/adminManagementApi";

const AdminList = () => {
  const { data: adminData, isLoading, isError, refetch } = useGetAdminQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  console.log("Admin Data:", adminData?.data);

  const [searchText, setSearchText] = useState("");
  const [admins, setAdmins] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Update local state when API data changes
  useEffect(() => {
    if (adminData?.data) {
      // Transform API data to match table structure
      const transformedData = adminData.data.map((admin, index) => ({
        key: admin.id || admin._id || index + 1,
        id: admin.id || admin._id,
        name: admin.name || "",
        email: admin.email || "",
        role: admin.role || "Admin",
        creationdate: admin.createdAt
          ? new Date(admin.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
      }));

      setAdmins(transformedData);
      setFilteredData(transformedData);
    }
  }, [adminData]);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Check if maximum admins reached (5)
  const isMaxAdminsReached = admins.length >= 5;

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = admins.filter(
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
          <p>Error loading admin data</p>
          <p className="text-sm text-gray-500">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  // Add Admin functionality
  const showAddModal = () => {
    if (isMaxAdminsReached) {
      message.warning("Maximum 5 admins allowed!");
      return;
    }
    setModalMode("add");
    setSelectedAdmin(null);
    setIsAdminModalOpen(true);
  };

  // Edit Admin functionality
  const showEditModal = (record) => {
    setModalMode("edit");
    setSelectedAdmin(record);
    setIsAdminModalOpen(true);
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleSubmitAdmin = async (adminData) => {
    try {
      if (modalMode === "add") {
        // Check again before creating
        if (isMaxAdminsReached) {
          message.warning("Maximum 5 admins allowed!");
          return;
        }

        const result = await createAdmin(adminData).unwrap();
        message.success("Admin created successfully!");

        // Refetch data to get updated list
        refetch();
      } else {
        // Edit mode
        const result = await updateAdmin({
          id: selectedAdmin.id,
          updatedData: adminData,
        }).unwrap();
        message.success("Admin updated successfully!");

        // Refetch data to get updated list
        refetch();
      }

      setIsAdminModalOpen(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error("Error saving admin:", error);
      const errorMessage =
        error?.data?.message || error?.message || "An error occurred";
      message.error(
        `Failed to ${
          modalMode === "add" ? "create" : "update"
        } admin: ${errorMessage}`
      );
    }
  };

  // Delete Admin functionality
  const showDeleteModal = (record) => {
    setSelectedAdmin(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      await deleteAdmin(selectedAdmin.id).unwrap();
      message.success("Admin deleted successfully!");

      // Refetch data to get updated list
      refetch();

      setIsDeleteModalOpen(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error("Error deleting admin:", error);
      const errorMessage =
        error?.data?.message || error?.message || "An error occurred";
      message.error(`Failed to delete admin: ${errorMessage}`);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-5">
      <TableHead
        searchText={searchText}
        handleSearch={handleSearch}
        onAdd={showAddModal}
        isMaxAdminsReached={isMaxAdminsReached}
        currentAdminCount={admins.length}
      />
      <TableBody
        filteredData={filteredData}
        onEdit={showEditModal}
        onDelete={showDeleteModal}
        isDeleting={isDeleting}
      />

      {/* Admin Modal (Add/Edit) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdminModal}
        onSubmit={handleSubmitAdmin}
        selectedAdmin={selectedAdmin}
        mode={modalMode}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Admin Modal */}
      <Modal
        title="Delete Admin"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        centered
        className="z-50"
        confirmLoading={isDeleting}
      >
        <DeleteAdmin
          name={selectedAdmin?.name}
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
  isMaxAdminsReached,
  currentAdminCount,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Input
        placeholder="Search admins..."
        value={searchText}
        onChange={handleSearch}
        className="w-1/3 h-8"
        allowClear
      />
      <div className="flex items-center gap-3">
        {isMaxAdminsReached && (
          <span className="text-sm text-gray-500">
            Maximum admins reached ({currentAdminCount}/5)
          </span>
        )}
        {!isMaxAdminsReached && (
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

const DeleteAdmin = ({ name, onConfirm, onCancel, isLoading }) => (
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
              title="Edit Admin"
            >
              <EditFilled />
            </Button>
            <Button
              onClick={() => onDelete(record)}
              className="text-red-500 hover:text-white"
              disabled={isDeleting}
              title="Delete Admin"
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

export default AdminList;
