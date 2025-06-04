// import { useState } from "react";
// import { Table, Button, message } from "antd";
// import { DeleteOutlined } from "@ant-design/icons";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { FiEdit3 } from "react-icons/fi";
// import { FaCheck, FaPlus } from "react-icons/fa";
// import { GrFormAdd } from "react-icons/gr";

// import driver from "../../../assets/driver.png";
// import AddNewMember from "./AddNewMember";
// import EditMember from "./EditMember";
// import {
//   useDeleteTeamMutation,
//   useGetTeamQuery,
// } from "../../../redux/apiSlices/team";
// import { getImageUrl } from "../../../utils/baseUrl";
// import AddEditTeamMember from "./AddNewMember";

// function Team() {
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [filter, setFilter] = useState("All");
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);

//   const { data: teamData, isError, isLoading } = useGetTeamQuery();

//   const [deleteTeam] = useDeleteTeamMutation();

//   // Show Add Modal
//   const handleAdd = () => {
//     setIsAddModalOpen(true);
//   };

//   // Show Edit Modal with selected record
//   const handleEdit = (record) => {
//     setEditingRecord(record);
//     setIsEditModalOpen(true);
//   };

//   // Close Add Modal
//   const closeAddModal = () => {
//     setIsAddModalOpen(false);
//   };

//   // Close Edit Modal
//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingRecord(null);
//   };

//   // Handle form submit for both add and edit
//   const handleSubmit = () => {
//     setIsAddModalOpen(false);
//     setIsEditModalOpen(false);
//     setEditingRecord(null);
//   };

//   // Delete single item
//   const handleDeleteSingle = async (id) => {
//     try {
//       const res = await deleteTeam(id).unwrap();
//       message.success("Team member deleted successfully");
//       // Remove from selected keys if it was selected
//       setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
//     } catch (err) {
//       console.error("Delete failed:", err);
//       message.error("Failed to delete team member");
//     }
//   };

//   // Delete multiple selected items
//   const handleDeleteMultiple = async () => {
//     if (selectedRowKeys.length === 0) {
//       message.warning("Please select items to delete");
//       return;
//     }

//     try {
//       await Promise.all(selectedRowKeys.map((id) => deleteTeam(id).unwrap()));
//       message.success("Selected team members deleted successfully");
//       setSelectedRowKeys([]);
//     } catch (err) {
//       console.error("Delete failed:", err);
//       message.error("Failed to delete selected team members");
//     }
//   };

//   // Row selection config
//   const rowSelection = {
//     selectedRowKeys,
//     onChange: setSelectedRowKeys,
//   };

//   // Transform and filter data
//   const transformedData = teamData?.data?.result?.map((item) => ({
//     key: item._id, // Use _id as key for API operations
//     _id: item._id,
//     image: item.image,
//     name: item.name,
//     designation: item.designation,
//     teamDescription: item.teamDescription,
//     status: item.status === "ACTIVE" ? "Active" : "Inactive",
//   }));

//   // Filter data by status
//   const filteredData =
//     filter === "All"
//       ? transformedData || []
//       : (transformedData || []).filter((item) => item.status === filter);

//   // Helper for status badge color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "bg-[#90BE6D]";
//       case "Inactive":
//         return "bg-[#F37272]";
//       default:
//         return "bg-gray-400";
//     }
//   };

//   const columns = [
//     {
//       title: "Image",
//       dataIndex: "image",
//       key: "image",
//       render: (image) =>
//         image ? (
//           <img
//             src={`${getImageUrl()}${image}`}
//             alt="Team"
//             className="w-12 h-12 object-cover rounded"
//           />
//         ) : (
//           <img
//             src={driver}
//             alt="Team"
//             className="w-12 h-12 object-cover rounded"
//           />
//         ),
//     },
//     { title: "Name", dataIndex: "name", key: "name" },
//     { title: "Designation", dataIndex: "designation", key: "designation" },
//     {
//       title: "Description",
//       dataIndex: "teamDescription",
//       key: "teamDescription",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (text) => (
//         <div className="flex justify-start">
//           <span
//             className={`text-xs font-light text-white px-2 py-0.5 rounded ${getStatusColor(
//               text
//             )}`}
//           >
//             {text}
//           </span>
//         </div>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <div className="flex items-center gap-4">
//           <Button
//             onClick={() => handleEdit(record)}
//             className="p-1 border-smart"
//           >
//             <FiEdit3 size={20} className="text-black" />
//           </Button>
//           <Button
//             className="p-1 border-smart"
//             onClick={() => handleDeleteSingle(record._id)}
//           >
//             <RiDeleteBin6Line size={20} className="text-black" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   // Filter button styles helpers
//   const isActive = (key) =>
//     filter === key
//       ? "bg-smart text-white"
//       : "bg-transparent text-gray-400 border hover:bg-smart hover:text-white";

//   const iconClass = (key) =>
//     filter === key ? "text-white" : "text-gray-400 group-hover:text-white";

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Failed to fetch team data.</div>;

//   return (
//     <>
//       <div>
//         <h1 className="text-[20px] font-medium">Team Management</h1>
//         <div className="flex justify-between items-center py-5">
//           <Button
//             icon={<GrFormAdd size={25} />}
//             onClick={handleAdd}
//             className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
//           >
//             Add Team
//           </Button>

//           <div className="flex gap-3 items-center">
//             {selectedRowKeys.length > 0 && (
//               <Button
//                 icon={<DeleteOutlined />}
//                 onClick={handleDeleteMultiple}
//                 className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
//               >
//                 Delete ({selectedRowKeys.length})
//               </Button>
//             )}
//             <div className="flex gap-1">
//               <button
//                 onClick={() => setFilter("All")}
//                 className={`group text-xs px-2 h-8 flex items-center border rounded ${isActive(
//                   "All"
//                 )}`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => setFilter("Active")}
//                 className={`group text-xs px-2 h-8 flex items-center gap-1 border rounded ${isActive(
//                   "Active"
//                 )}`}
//               >
//                 <FaCheck className={iconClass("Active")} />
//                 Active
//               </button>
//               <button
//                 onClick={() => setFilter("Inactive")}
//                 className={`group text-xs px-2 h-8 flex items-center gap-1 border rounded ${isActive(
//                   "Inactive"
//                 )}`}
//               >
//                 <FaPlus className={`rotate-45 ${iconClass("Inactive")}`} />
//                 Inactive
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={filteredData}
//         rowSelection={rowSelection}
//         size="small"
//         pagination={{
//           defaultPageSize: 5,
//           showSizeChanger: false,
//           showQuickJumper: true,
//           position: ["bottomRight"],
//         }}
//         rowKey="key"
//       />

//       {/* <AddNewMember
//         isModalOpen={isAddModalOpen}
//         handleOk={handleSubmit}
//         handleCancel={closeAddModal}
//       />

//       <EditMember
//         isModalOpen={isEditModalOpen}
//         handleOk={handleSubmit}
//         handleCancel={closeEditModal}
//         editingRecord={editingRecord}
//       /> */}

//       <AddEditTeamMember
//         isModalOpen={isAddModalOpen}
//         handleOk={handleAddOk}
//         handleCancel={handleAddCancel}
//         isEdit={false}
//       />

//       <AddEditTeamMember
//         isModalOpen={isEditModalOpen}
//         handleOk={handleEditOk}
//         handleCancel={handleEditCancel}
//         isEdit={true}
//         editData={selectedTeamMember}
//       />
//     </>
//   );
// }

// export default Team;
import { useState } from "react";
import { Table, Button, message } from "antd";
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

  const { data: teamData, isError, isLoading } = useGetTeamQuery();

  const [deleteTeam] = useDeleteTeamMutation();

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

  // Handle form submit for Add
  const handleAddSubmit = () => {
    setIsAddModalOpen(false);
    // Data will be refreshed via RTK Query invalidation
  };

  // Handle form submit for Edit
  const handleEditSubmit = () => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
    // Data will be refreshed via RTK Query invalidation
  };

  // Delete single item
  const handleDeleteSingle = async (id) => {
    try {
      const res = await deleteTeam(id).unwrap();
      message.success("Team member deleted successfully");
      // Remove from selected keys if it was selected
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Failed to delete team member");
    }
  };

  // Delete multiple selected items
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
      message.error("Failed to delete selected team members");
    }
  };

  // Row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Transform and filter data
  const transformedData = teamData?.data?.result?.map((item) => ({
    key: item._id, // Use _id as key for API operations
    _id: item._id,
    id: item._id, // Add id field for the AddEditTeamMember component
    image: item.image,
    name: item.name,
    designation: item.designation,
    teamRole: item.teamRole, // Add role field
    teamDescription: item.teamDescription,
    status: item.status === "active" ? "Active" : "Inactive",
  }));

  // Filter data by status
  const filteredData =
    filter === "All"
      ? transformedData || []
      : (transformedData || []).filter((item) => item.status === filter);

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
            src={`${getImageUrl()}${image}`}
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
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "teamRole", key: "teamRole" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    {
      title: "Description",
      dataIndex: "teamDescription",
      key: "teamDescription",
    },
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
  if (isError) return <div>Failed to fetch team data.</div>;

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

      <Table
        columns={columns}
        dataSource={filteredData}
        rowSelection={rowSelection}
        size="small"
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: false,
          showQuickJumper: true,
          position: ["bottomRight"],
        }}
        rowKey="key"
      />

      {/* Add Modal */}
      <AddEditTeamMember
        isModalOpen={isAddModalOpen}
        handleOk={handleAddSubmit}
        handleCancel={closeAddModal}
        isEdit={false}
      />

      {/* Edit Modal */}
      <AddEditTeamMember
        isModalOpen={isEditModalOpen}
        handleOk={handleEditSubmit}
        handleCancel={closeEditModal}
        isEdit={true}
        editData={editingRecord}
      />
    </>
  );
}

export default Team;
