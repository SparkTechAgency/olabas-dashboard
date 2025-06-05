// import { useState } from "react";
// import { Table, Button, Select } from "antd";
// import { DeleteOutlined } from "@ant-design/icons";
// import { LuDownload } from "react-icons/lu";
// import { GrFormAdd } from "react-icons/gr";
// import dayjs from "dayjs";
// import CustomSearch from "../../../components/common/CustomSearch";
// import GetPageName from "../../../components/common/GetPageName";
// import ReservationAddModal from "./ReservationAddModal";
// import {
//   useAssignDreiverMutation,
//   useGetReservationQuery,
// } from "../../../redux/apiSlices/reservation";
// import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";

// const { Option } = Select;

// function Reservation() {
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { data: reservationData, isLoading } = useGetReservationQuery();
//   console.log("reservationData", reservationData?.data?.result);

//   const [assignDriver] = useAssignDreiverMutation();

//   const { data: driverData } = useGetDriverQuery();
//   console.log("driverData", driverData?.data);

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const rowSelection = {
//     selectedRowKeys,
//     onChange: setSelectedRowKeys,
//   };

//   const onSearch = (value) => {
//     console.log("Search value:", value);
//     // Search handling here if needed
//   };

//   // Format API data to match table structure
//   const formatReservationData = (data) => {
//     if (!Array.isArray(data)) return [];

//     return data.map((item, index) => ({
//       key: item._id || index,
//       pickupTime: dayjs(item.pickupTime).format("DD/MM/YYYY, h:mm A"),
//       pickupLocation: item.pickupLocation?.location || "N/A",
//       returnTime: dayjs(item.returnTime).format("DD/MM/YYYY, h:mm A"),
//       returnLocation: item.returnLocation?.location || "N/A",
//       carSize: item.vehicle?.name || "N/A",
//       carNumberPlate: "N/A", // Not available in API response
//       carModel: "N/A", // Not available in API response
//       client:
//         `${item.clientId?.firstName || ""} ${
//           item.clientId?.lastName || ""
//         }`.trim() || "N/A",
//       clientPhone: item.clientId?.email || "N/A", // Using email as phone not available
//       price: `₦${item.amount || 0}`,
//       status: item.status || "NOT CONFIRMED",
//     }));
//   };

//   // Use only API data
//   const displayData = formatReservationData(
//     reservationData?.data?.result || []
//   );

//   return (
//     <>
//       <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
//       <div className="flex justify-between items-center py-5">
//         <Button
//           icon={<GrFormAdd size={25} />}
//           onClick={showModal}
//           className="bg-smart hover:bg-smart text-white border-none h-8"
//         >
//           Add reservation
//         </Button>
//         <div className="flex gap-3">
//           <CustomSearch onSearch={onSearch} placeholder="search..." />
//           {selectedRowKeys.length > 0 && (
//             <Button
//               icon={<DeleteOutlined />}
//               className="bg-smart hover:bg-smart text-white border-none h-8"
//             >
//               Delete Selected
//             </Button>
//           )}
//           <Button
//             icon={<LuDownload size={20} />}
//             className="bg-smart hover:bg-smart text-white border-none h-8"
//           >
//             Export
//           </Button>
//         </div>
//       </div>

//       <Table
//         rowSelection={rowSelection}
//         columns={columns}
//         dataSource={displayData}
//         loading={isLoading}
//         rowClassName={() => "text-black"}
//         size="small"
//         pagination={{
//           defaultPageSize: 5,
//           position: ["bottomRight"],
//           size: "default",
//           showSizeChanger: false,
//           showQuickJumper: false,
//         }}
//       />

//       <ReservationAddModal
//         isModalOpen={isModalOpen}
//         handleOk={handleOk}
//         setIsModalOpen={setIsModalOpen}
//         handleCancel={() => setIsModalOpen(false)}
//       />
//     </>
//   );
// }

// export default Reservation;

// const columns = [
//   {
//     title: "Pickup",
//     dataIndex: "pickUp",
//     key: "pickUp",
//     render: (text, record) => (
//       <div className="flex flex-col">
//         <span className="font-medium">{record.pickupTime}</span>
//         <span className="text-gray-600 text-sm">{record.pickupLocation}</span>
//       </div>
//     ),
//   },
//   {
//     title: "Return",
//     dataIndex: "return",
//     key: "return",
//     render: (text, record) => (
//       <div className="flex flex-col">
//         <span className="font-medium">{record.returnTime}</span>
//         <span className="text-gray-600 text-sm">{record.returnLocation}</span>
//       </div>
//     ),
//   },
//   {
//     title: "Car",
//     dataIndex: "car",
//     key: "car",
//     render: (text, record) => (
//       <div className="flex flex-col">
//         <span className="font-medium">{record.carSize}</span>
//         <div className="flex text-gray-600 text-sm">
//           <span>{record.carNumberPlate}</span>
//           {record.carNumberPlate !== "N/A" && record.carModel !== "N/A" && (
//             <span>, </span>
//           )}
//           <span>{record.carModel}</span>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: "Client",
//     dataIndex: "client",
//     key: "client",
//     render: (text, record) => (
//       <div className="flex flex-col">
//         <span className="font-medium">{text}</span>
//         <span className="text-gray-600 text-sm">{record.clientPhone}</span>
//       </div>
//     ),
//   },
//   {
//     title: "Price",
//     dataIndex: "price",
//     key: "price",
//     render: (text) => (
//       <span className="font-medium text-green-600">{text}</span>
//     ),
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//     key: "action",
//     render: (text, record) => (
//       <Select className="w-fit" placeholder="Assign Driver">
//         <Option value="driver1">Driver 1</Option>
//         <Option value="driver2">Driver 2</Option>
//         <Option value="driver3">Driver 3</Option>
//       </Select>
//     ),
//   },
//   {
//     title: "Status",
//     dataIndex: "status",
//     key: "status",
//     render: (text) => {
//       const getStatusColor = (status) => {
//         const statusLower = status?.toLowerCase();
//         switch (statusLower) {
//           case "confirmed":
//             return "bg-[#5AC5B6]";
//           case "not confirmed":
//             return "bg-[#F9C74F]";
//           case "canceled":
//           case "cancelled":
//             return "bg-[#F37272]";
//           case "completed":
//             return "bg-[#90BE6D]";
//           default:
//             return "bg-[#F9C74F]";
//         }
//       };
//       return (
//         <div className="flex justify-start">
//           <span
//             className={`text-xs font-light text-white px-2 py-0.5 rounded ${getStatusColor(
//               text
//             )}`}
//           >
//             {text}
//           </span>
//         </div>
//       );
//     },
//   },
// ];

import { useState } from "react";
import { Table, Button, Select, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { LuDownload } from "react-icons/lu";
import { GrFormAdd } from "react-icons/gr";
import dayjs from "dayjs";
import CustomSearch from "../../../components/common/CustomSearch";
import GetPageName from "../../../components/common/GetPageName";
import ReservationAddModal from "./ReservationAddModal";
import {
  useAssignDreiverMutation,
  useGetReservationQuery,
} from "../../../redux/apiSlices/reservation";
import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";

const { Option } = Select;

function Reservation() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: reservationData, isLoading } = useGetReservationQuery();
  const [assignDriver] = useAssignDreiverMutation();
  const { data: driverData } = useGetDriverQuery();

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const onSearch = (value) => {
    console.log("Search value:", value);
    // Add filtering logic if needed
  };

  const handleAssignDriver = async (reservationId, driverId) => {
    try {
      await assignDriver({ rID: reservationId, driverId }).unwrap();
      message.success("Driver assigned successfully");
    } catch (error) {
      console.error("Driver assignment failed", error);
      message.error("Failed to assign driver");
    }
  };

  const formatReservationData = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map((item, index) => ({
      key: item._id || index,
      id: item._id,
      pickupTime: dayjs(item.pickupTime).format("DD/MM/YYYY, h:mm A"),
      pickupLocation: item.pickupLocation?.location || "N/A",
      returnTime: dayjs(item.returnTime).format("DD/MM/YYYY, h:mm A"),
      returnLocation: item.returnLocation?.location || "N/A",
      carSize: item.vehicle?.name || "N/A",
      carNumberPlate: "N/A",
      carModel: "N/A",
      client:
        `${item.clientId?.firstName || ""} ${
          item.clientId?.lastName || ""
        }`.trim() || "N/A",
      clientPhone: item.clientId?.email || "N/A",
      price: `₦${item.amount || 0}`,
      status: item.status || "NOT CONFIRMED",
      driverId: item.driverId?._id || null,
    }));
  };

  const displayData = formatReservationData(
    reservationData?.data?.result || []
  );

  const columns = [
    {
      title: "Pickup",
      dataIndex: "pickUp",
      key: "pickUp",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.pickupTime}</span>
          <span className="text-gray-600 text-sm">{record.pickupLocation}</span>
        </div>
      ),
    },
    {
      title: "Return",
      dataIndex: "return",
      key: "return",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.returnTime}</span>
          <span className="text-gray-600 text-sm">{record.returnLocation}</span>
        </div>
      ),
    },
    {
      title: "Car",
      dataIndex: "car",
      key: "car",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.carSize}</span>
          <div className="flex text-gray-600 text-sm">
            <span>{record.carNumberPlate}</span>
            {record.carNumberPlate !== "N/A" && record.carModel !== "N/A" && (
              <span>, </span>
            )}
            <span>{record.carModel}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{text}</span>
          <span className="text-gray-600 text-sm">{record.clientPhone}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="font-medium text-green-600">{text}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Select
          className="w-[160px]"
          placeholder="Assign Driver"
          value={record.driverId || undefined}
          onChange={(value) => handleAssignDriver(record.id, value)}
        >
          {driverData?.data?.map((driver) => (
            <Option key={driver._id} value={driver._id}>
              {driver.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const getStatusColor = (status) => {
          switch (status?.toLowerCase()) {
            case "confirmed":
              return "bg-[#5AC5B6]";
            case "not confirmed":
              return "bg-[#F9C74F]";
            case "canceled":
            case "cancelled":
              return "bg-[#F37272]";
            case "completed":
              return "bg-[#90BE6D]";
            default:
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
  ];

  return (
    <>
      <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
      <div className="flex justify-between items-center py-5">
        <Button
          icon={<GrFormAdd size={25} />}
          onClick={showModal}
          className="bg-smart hover:bg-smart text-white border-none h-8"
        >
          Add reservation
        </Button>
        <div className="flex gap-3">
          <CustomSearch onSearch={onSearch} placeholder="search..." />
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<DeleteOutlined />}
              className="bg-smart hover:bg-smart text-white border-none h-8"
            >
              Delete Selected
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

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={displayData}
        loading={isLoading}
        rowClassName={() => "text-black"}
        size="small"
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          size: "default",
          showSizeChanger: false,
          showQuickJumper: false,
        }}
      />

      <ReservationAddModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        handleCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default Reservation;
