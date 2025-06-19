// // DriverManagement.jsx
// import { useState } from "react";
// import { Button, message } from "antd";
// import GetPageName from "../../../components/common/GetPageName";
// import { GrFormAdd } from "react-icons/gr";
// import DriverInformationModal from "./DriverInformationModal";
// import { useSidebar } from "../../../Context/SidebarContext";
// import DriverTable from "./driverTable";
// import {
//   useCreateDriverMutation,
//   useUpdateDriverMutation,
//   useDeleteDriverMutation,
//   useGetDriverQuery,
// } from "../../../redux/apiSlices/driverManagementApi";
// import { RxLapTimer } from "react-icons/rx";

// function DriverManagement() {
//   const handleSearch = () => {};
//   const handleDelete = () => {};
//   const { isCollapsed } = useSidebar();

//   // State for edit modal
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedDriver, setSelectedDriver] = useState(null);

//   const [createDriver, { isLoading: createDriverLoading }] =
//     useCreateDriverMutation();
//   const [updateDriver, { isLoading: updateDriverLoading }] =
//     useUpdateDriverMutation();
//   const [deleteDriver, { isLoading: deleteDriverLoading }] =
//     useDeleteDriverMutation();
//   const { data, isLoading, refetch } = useGetDriverQuery();

//   // Handle edit driver
//   const handleEditDriver = (driver) => {
//     setSelectedDriver(driver);
//     setEditModalOpen(true);
//   };

//   // Handle update driver
//   const handleUpdateDriver = async (formData) => {
//     console.log("Updating driver with data:", formData);

//     try {
//       const result = await updateDriver({
//         id: selectedDriver._id,
//         updatedData: formData,
//       }).unwrap();
//       message.success("Driver updated successfully!");
//       setEditModalOpen(false);
//       setSelectedDriver(null);
//       refetch(); // Refresh the driver list
//       return result;
//     } catch (error) {
//       console.error("Error updating driver:", error);
//       message.error(error?.data?.message || "Failed to update driver");
//       throw error;
//     }
//   };

//   // Handle cancel edit
//   const handleCancelEdit = () => {
//     setEditModalOpen(false);
//     setSelectedDriver(null);
//   };

//   console.log(data?.data);

//   return (
//     <div
//       className={`h-40 driver-management-container transition-all duration-300 ${
//         isCollapsed
//           ? "w-full sm:w-[94vw] md:w-[94vw] lg:w-[94vw]"
//           : "w-full sm:w-[100vw] md:w-[90vw] lg:w-[85vw]"
//       }`}
//     >
//       <Header
//         onSearch={handleSearch}
//         pagename="Driver Management"
//         handleDelete={handleDelete}
//         createDriver={createDriver}
//         createDriverLoading={createDriverLoading}
//         refetch={refetch}
//       />
//       <DriverTable onEditDriver={handleEditDriver} refetch={refetch} />

//       {/* Edit Driver Modal */}
//       <DriverInformationModal
//         isModalOpen={editModalOpen}
//         onSubmit={handleUpdateDriver}
//         onCancel={handleCancelEdit}
//         loading={updateDriverLoading}
//         initialData={selectedDriver}
//         isEditMode={true}
//       />
//     </div>
//   );
// }

// export default DriverManagement;

// // Header Component
// const Header = ({ pagename, createDriver, createDriverLoading, refetch }) => {
//   const [modalOpen, setModalOpen] = useState(false);

//   const handleCreateDriver = async (formData) => {
//     try {
//       const result = await createDriver(formData).unwrap();
//       message.success("Driver created successfully!");
//       setModalOpen(false);
//       refetch(); // Refresh the driver list
//       return result;
//     } catch (error) {
//       console.error("Error creating driver:", error);
//       message.error(error?.data?.message || "Failed to create driver");
//       throw error;
//     }
//   };

//   const handleCancel = () => {
//     setModalOpen(false);
//   };

//   return (
//     <div className="flex flex-col justify-between items-start py-5">
//       <div className="flex gap-2">
//         <h1 className="text-[20px] font-medium border p-1 rounded-md">
//           {GetPageName() || pagename}
//         </h1>
//         <h1 className="text-[20px] font-medium flex items-center gap-2 border p-1 rounded-md">
//           <span>
//             <RxLapTimer />{" "}
//           </span>
//           Driver Schedule
//         </h1>
//       </div>

//       <div className="w-full flex items-center justify-between mt-5">
//         <Button
//           icon={<GrFormAdd size={25} />}
//           className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
//           onClick={() => setModalOpen(true)}
//           loading={createDriverLoading}
//         >
//           Add Driver
//         </Button>

//         {/* Create Driver Modal */}
//         <DriverInformationModal
//           isModalOpen={modalOpen}
//           onSubmit={handleCreateDriver}
//           onCancel={handleCancel}
//           loading={createDriverLoading}
//           isEditMode={false}
//         />
//       </div>
//     </div>
//   );
// };

// DriverManagement.jsx
import { useState } from "react";
import { Button, message, Segmented } from "antd";
import GetPageName from "../../../components/common/GetPageName";
import { GrFormAdd } from "react-icons/gr";
import DriverInformationModal from "./DriverInformationModal";
import { useSidebar } from "../../../Context/SidebarContext";
import DriverTable from "./driverTable";
import {
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useGetDriverQuery,
} from "../../../redux/apiSlices/driverManagementApi";
import { RxLapTimer } from "react-icons/rx";
import { UserOutlined } from "@ant-design/icons";

function DriverManagement() {
  const handleSearch = () => {};
  const handleDelete = () => {};
  const { isCollapsed } = useSidebar();

  // State for segment selection
  const [selectedSegment, setSelectedSegment] = useState("drivers");

  // State for edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [createDriver, { isLoading: createDriverLoading }] =
    useCreateDriverMutation();
  const [updateDriver, { isLoading: updateDriverLoading }] =
    useUpdateDriverMutation();
  const [deleteDriver, { isLoading: deleteDriverLoading }] =
    useDeleteDriverMutation();
  const { data, isLoading, refetch } = useGetDriverQuery();

  // Handle edit driver
  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setEditModalOpen(true);
  };

  // Handle update driver
  const handleUpdateDriver = async (formData) => {
    console.log("Updating driver with data:", formData);

    try {
      const result = await updateDriver({
        id: selectedDriver._id,
        updatedData: formData,
      }).unwrap();
      message.success("Driver updated successfully!");
      setEditModalOpen(false);
      setSelectedDriver(null);
      refetch(); // Refresh the driver list
      return result;
    } catch (error) {
      console.error("Error updating driver:", error);
      message.error(error?.data?.message || "Failed to update driver");
      throw error;
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setSelectedDriver(null);
  };

  console.log(data?.data);

  return (
    <div
      className={`h-40 driver-management-container transition-all duration-300 ${
        isCollapsed
          ? "w-full sm:w-[94vw] md:w-[94vw] lg:w-[94vw]"
          : "w-full sm:w-[100vw] md:w-[90vw] lg:w-[85vw]"
      }`}
    >
      <Header
        onSearch={handleSearch}
        pagename="Driver Management"
        handleDelete={handleDelete}
        createDriver={createDriver}
        createDriverLoading={createDriverLoading}
        refetch={refetch}
        selectedSegment={selectedSegment}
        setSelectedSegment={setSelectedSegment}
      />
      <DriverTable
        onEditDriver={handleEditDriver}
        refetch={refetch}
        selectedSegment={selectedSegment}
      />

      {/* Edit Driver Modal */}
      <DriverInformationModal
        isModalOpen={editModalOpen}
        onSubmit={handleUpdateDriver}
        onCancel={handleCancelEdit}
        loading={updateDriverLoading}
        initialData={selectedDriver}
        isEditMode={true}
      />
    </div>
  );
}

export default DriverManagement;

// Header Component
const Header = ({
  pagename,
  createDriver,
  createDriverLoading,
  refetch,
  selectedSegment,
  setSelectedSegment,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateDriver = async (formData) => {
    try {
      const result = await createDriver(formData).unwrap();
      message.success("Driver created successfully!");
      setModalOpen(false);
      refetch(); // Refresh the driver list
      return result;
    } catch (error) {
      console.error("Error creating driver:", error);
      message.error(error?.data?.message || "Failed to create driver");
      throw error;
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  // Segmented options
  const segmentOptions = [
    {
      label: (
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span>{GetPageName() || pagename}</span>
        </div>
      ),
      value: "drivers",
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <RxLapTimer />
          <span>Driver Schedule</span>
        </div>
      ),
      value: "schedule",
    },
  ];

  return (
    <div className="flex flex-col justify-between items-start py-5">
      {/* Segmented Control */}
      <div className="mb-4">
        <Segmented
          options={segmentOptions}
          value={selectedSegment}
          onChange={setSelectedSegment}
          size="large"
          className="border-[#04bf61] "
        />
      </div>

      <div className="w-full flex items-center justify-between mt-1">
        <Button
          icon={<GrFormAdd size={25} />}
          className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
          onClick={() => setModalOpen(true)}
          loading={createDriverLoading}
        >
          Add Driver
        </Button>

        {/* Create Driver Modal */}
        <DriverInformationModal
          isModalOpen={modalOpen}
          onSubmit={handleCreateDriver}
          onCancel={handleCancel}
          loading={createDriverLoading}
          isEditMode={false}
        />
      </div>
    </div>
  );
};
