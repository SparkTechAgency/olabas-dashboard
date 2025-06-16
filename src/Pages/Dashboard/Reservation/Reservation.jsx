import { useState } from "react";
import { Table, Button, Select, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { LuDownload } from "react-icons/lu";
import { GrFormAdd } from "react-icons/gr";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";
import CustomSearch from "../../../components/common/CustomSearch";
import GetPageName from "../../../components/common/GetPageName";
import ReservationAddModal from "./ReservationAddModal";
import {
  useAssignDreiverMutation,
  useGetReservationQuery,
  useDeleteReservationMutation,
} from "../../../redux/apiSlices/reservation";
import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";

const { Option } = Select;
const { confirm } = Modal;

function Reservation() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [csvData, setCsvData] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

  // API hooks - now passing page and limit parameters
  const {
    data: reservationData,
    isLoading,
    refetch,
  } = useGetReservationQuery({ page, limit });

  console.log("reservationData:", reservationData);

  const [assignDriver, { isLoading: assignDriverLoading }] =
    useAssignDreiverMutation();
  const [deleteReservation] = useDeleteReservationMutation();
  const { data: driverData } = useGetDriverQuery({ page: null, limit: null });

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
    console.log("reservationId:", reservationId);
    console.log("driverId:", driverId);
    try {
      await assignDriver({ rID: reservationId, driverId }).unwrap();
      message.success("Driver assigned successfully");
      refetch(); // Refresh the data after assignment
    } catch (error) {
      console.error("Driver assignment failed", error);
      message.error(error.data?.message || "Failed to assign driver");
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      await deleteReservation(id).unwrap();
      message.success("Reservation deleted successfully");
      refetch(); // Refresh the data after deletion
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== id));
    } catch (error) {
      console.error("Deletion failed", error);
      message.error(error.data?.message || "Failed to delete reservation");
    }
  };

  const handleDeleteSelected = () => {
    confirm({
      title: "Are you sure you want to delete these reservations?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return Promise.all(
          selectedRowKeys.map((id) => handleDeleteReservation(id))
        )
          .then(() => {
            message.success("Selected reservations deleted successfully");
          })
          .catch(() => {
            message.error("Some reservations could not be deleted");
          });
      },
    });
  };

  const formatReservationData = (data) => {
    if (!Array.isArray(data)) return [];

    return data?.map((item, index) => ({
      key: item._id || index,
      id: item._id,
      pickupTime: dayjs(item.pickupTime).format("DD/MM/YYYY, h:mm A"),
      pickupLocation: item.pickupLocation?.location || "N/A",
      returnTime: dayjs(item.returnTime).format("DD/MM/YYYY, h:mm A"),
      returnLocation: item.returnLocation?.location || "N/A",
      carName: item.vehicle?.name || "N/A",
      carSize: item.vehicleType || "N/A",
      rentedDays: item.carRentedForInDays || 0,
      carNumberPlate: item.vehicle?.plateNumber || "N/A",
      carModel: item.vehicle?.model || "N/A",
      client:
        `${item.clientId?.firstName || ""} ${
          item.clientId?.lastName || ""
        }`.trim() || "N/A",
      clientPhone: item.clientId?.phoneNumber || item.clientId?.email || "N/A",
      price: `₦${item.amount || 0}`,
      status: item.status || "NOT CONFIRMED",
      driverId: item.driverId?._id || null,
      driverName: item.driverId?.name || "Not Assigned",
      // Additional fields for CSV export
      rawAmount: item.amount || 0,
      clientEmail: item.clientId?.email || "N/A",
      clientFirstName: item.clientId?.firstName || "N/A",
      clientLastName: item.clientId?.lastName || "N/A",
      vehicleBrand: item.vehicle?.brand || "N/A",
      pickupDate: dayjs(item.pickupTime).format("DD/MM/YYYY"),
      pickupTimeOnly: dayjs(item.pickupTime).format("h:mm A"),
      returnDate: dayjs(item.returnTime).format("DD/MM/YYYY"),
      returnTimeOnly: dayjs(item.returnTime).format("h:mm A"),
    }));
  };

  const displayData = formatReservationData(
    reservationData?.data?.result || []
  );

  // CSV Export Configuration
  const csvHeaders = [
    { label: "Reservation ID", key: "id" },
    { label: "Client Name", key: "client" },
    { label: "Client First Name", key: "clientFirstName" },
    { label: "Client Last Name", key: "clientLastName" },
    { label: "Client Phone", key: "clientPhone" },
    { label: "Client Email", key: "clientEmail" },
    { label: "Pickup Date", key: "pickupDate" },
    { label: "Pickup Time", key: "pickupTimeOnly" },
    { label: "Pickup Location", key: "pickupLocation" },
    { label: "Return Date", key: "returnDate" },
    { label: "Return Time", key: "returnTimeOnly" },
    { label: "Return Location", key: "returnLocation" },
    { label: "Vehicle Name", key: "carSize" },
    { label: "Vehicle Model", key: "carModel" },
    { label: "Vehicle Brand", key: "vehicleBrand" },
    { label: "License Plate", key: "carNumberPlate" },
    { label: "Amount (₦)", key: "rawAmount" },
    { label: "Status", key: "status" },
    { label: "Assigned Driver", key: "driverName" },
  ];

  // Prepare CSV data - use all data or only selected rows
  const prepareCsvData = () => {
    setExportLoading(true);

    let dataToExport = displayData;

    // If there are selected rows, export only those
    if (selectedRowKeys.length > 0) {
      dataToExport = displayData.filter((item) =>
        selectedRowKeys.includes(item.key)
      );
    }

    setCsvData(dataToExport);

    // Set loading to false after a brief delay to show loading state
    setTimeout(() => {
      setExportLoading(false);
    }, 500);
  };

  // Generate filename with current date
  const generateFilename = () => {
    const currentDate = dayjs().format("YYYY-MM-DD_HH-mm");
    const recordCount =
      selectedRowKeys.length > 0 ? selectedRowKeys.length : displayData.length;
    return `reservations_${currentDate}_${recordCount}records.csv`;
  };

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

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
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.carName}</span>
          <div className="flex text-gray-600 text-sm">
            <span>{record.carSize}</span>
            {record.carSize !== "N/A" && record.rentedDays !== 0 && (
              <span>, </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Rented for",
      dataIndex: "car",
      key: "car",
      render: (_, record) => (
        <div className="flex text-gray-600 text-sm">
          <span className="text-black font-bold">
            {`${record.rentedDays} Days`}{" "}
          </span>
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-2">
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
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              confirm({
                title: "Are you sure you want to delete this reservation?",
                content: "This action cannot be undone.",
                okText: "Yes, delete",
                okType: "danger",
                cancelText: "No",
                onOk() {
                  return handleDeleteReservation(record.id);
                },
              });
            }}
          />
        </div>
      ),
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
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
          )}

          {/* Export Button with CSV functionality */}
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={generateFilename()}
            className="ant-btn bg-smart hover:bg-smart text-white border-none h-8 flex items-center gap-2 px-4 rounded"
            onClick={prepareCsvData}
            style={{ textDecoration: "none", color: "white" }}
          >
            <Button
              icon={<LuDownload size={20} />}
              className="bg-smart hover:bg-smart text-white border-none h-8 p-0"
              loading={exportLoading}
              style={{
                border: "none",
                boxShadow: "none",
                background: "transparent",
              }}
            >
              Export{" "}
              {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ""}
            </Button>
          </CSVLink>
        </div>
      </div>

      {/* Export Status Message */}
      {selectedRowKeys.length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <span className="font-medium">Export Mode:</span>{" "}
          {selectedRowKeys.length} selected reservation(s) will be exported.
          Deselect all to export all reservations.
        </div>
      )}

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={displayData}
        loading={isLoading}
        rowClassName={() => "text-black"}
        size="small"
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize: limit,
          total: reservationData?.data?.meta?.total || 0,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          position: ["bottomRight"],
          size: "small",
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["1", "5", "10", "20", "50"],
        }}
      />

      <ReservationAddModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        refetch={refetch}
      />
    </>
  );
}

export default Reservation;
