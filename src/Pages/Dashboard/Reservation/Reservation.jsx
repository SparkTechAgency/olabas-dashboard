import { useState } from "react";
import { Table, Button, Select, message, Modal, Pagination } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { LuDownload } from "react-icons/lu";
import { GrFormAdd } from "react-icons/gr";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";
import CustomSearch from "../../../components/common/CustomSearch";
import GetPageName from "../../../components/common/GetPageName";
import ReservationAddModal from "./ReservationAddModal";
import { FiEdit3, FiEye } from "react-icons/fi";
import {
  useAssignDreiverMutation,
  useGetReservationQuery,
  useDeleteReservationMutation,
  useUpdateReservationStatusMutation,
  useLazyGetExportDataQuery,
} from "../../../redux/apiSlices/reservation";
import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";
import ExportModal from "./ExportModal";
import ReservationViewModal from "./ReservationViewModal";

const { Option } = Select;
const { confirm } = Modal;

function Reservation() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [csvData, setCsvData] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [csvLinkRef, setCsvLinkRef] = useState(null);
  const [search, setSearch] = useState("");

  const [updateStatus] = useUpdateReservationStatusMutation();

  // API hooks
  const {
    data: reservationData,
    isLoading,
    refetch,
  } = useGetReservationQuery({ page, limit, searchTerm: search });

  console.log("reservationData:", reservationData);

  // Use lazy query for export data - this allows us to trigger it manually
  const [
    getExportData,
    { isLoading: exportDataLoading, isError: exportDataError },
  ] = useLazyGetExportDataQuery();

  const [assignDriver, { isLoading: assignDriverLoading }] =
    useAssignDreiverMutation();
  const [deleteReservation] = useDeleteReservationMutation();
  const { data: driverData } = useGetDriverQuery({ page: null, limit: null });

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);

  const handleViewReservation = (record) => {
    // Find the original data from the API response
    const originalData = reservationData?.data?.result?.find(
      (item) => item._id === record.id
    );

    // Create enhanced record with both formatted and raw data
    const enhancedRecord = {
      ...record,
      rawData: originalData,
    };

    setSelectedReservation(enhancedRecord);
    setIsViewModalOpen(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const onSearch = (value) => {
    console.log("Search value:", value);
    setSearch(value);
    // Add filtering logic if needed
  };

  const handleAssignDriver = async (reservationId, driverId) => {
    console.log("reservationId:", reservationId);
    console.log("driverId:", driverId);
    try {
      await assignDriver({ rID: reservationId, driverId }).unwrap();
      message.success("Driver assigned successfully");
      refetch();
    } catch (error) {
      console.error("Driver assignment failed", error);
      message.error(error.data?.message || "Failed to assign driver");
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      await deleteReservation(id).unwrap();
      message.success("Reservation deleted successfully");
      refetch();
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

  const handleStatusUpdate = async (reservationId, newStatus) => {
    console.log("Updating status:", { reservationId, newStatus });

    try {
      const result = await updateStatus({
        id: reservationId,
        data: { status: newStatus },
      }).unwrap();

      console.log("Status update result:", result);
      message.success("Status updated successfully");
      refetch();
    } catch (error) {
      console.error("Status update failed:", error);
      message.error(
        error?.data?.message || error?.message || "Failed to update status"
      );
    }
  };

  const formatReservationData = (data) => {
    if (!Array.isArray(data)) return [];

    return data?.map((item, index) => ({
      key: item?._id || index,
      id: item?._id,
      createdAt: dayjs(item?.createdAt).format("DD/MM/YYYY, h:mm A"),
      pickupTime: dayjs(item?.pickupTime).format("DD/MM/YYYY, h:mm A"),
      pickupLocation: item?.pickupLocation?.location || "N/A",
      returnTime: dayjs(item?.returnTime).format("DD/MM/YYYY, h:mm A"),
      returnLocation: item?.returnLocation?.location || "N/A",
      carName: item?.vehicle?.name || "N/A",
      carSize: item?.vehicleType || "N/A",
      rentedDays: item?.carRentedForInDays || 0,
      carNumberPlate: item?.vehicle?.plateNumber || "N/A",
      carModel: item?.vehicle?.model || "N/A",
      client:
        `${item?.clientId?.firstName || ""} ${
          item?.clientId?.lastName || ""
        }`.trim() || "N/A",
      clientPhone:
        item?.clientId?.phoneNumber || item?.clientId?.email || "N/A",
      price: `₦${item?.amount || 0}`,
      status: item?.status || "NOT CONFIRMED",
      driverId: item?.driverId?._id || null,
      driverName: item?.driverId?.name || "Not Assigned",
      // Additional fields for CSV export
      rawAmount: item?.amount || 0,
      clientEmail: item?.clientId?.email || "N/A",
      clientFirstName: item?.clientId?.firstName || "N/A",
      clientLastName: item?.clientId?.lastName || "N/A",
      vehicleBrand: item?.vehicle?.brand || "N/A",
      pickupDate: dayjs(item?.pickupTime).format("DD/MM/YYYY"),
      pickupTimeOnly: dayjs(item?.pickupTime).format("h:mm A"),
      returnDate: dayjs(item?.returnTime).format("DD/MM/YYYY"),
      returnTimeOnly: dayjs(item?.returnTime).format("h:mm A"),
      originalPickupTime: item?.pickupTime,
      isPaid: item?.isPaid,
    }));
  };

  // New function to format export data specifically for CSV
  const formatExportDataForCSV = (data) => {
    if (!Array.isArray(data)) return [];

    return data?.map((item, index) => ({
      key: item?._id || index,
      id: item?._id,
      client:
        `${item?.clientId?.firstName || ""} ${
          item?.clientId?.lastName || ""
        }`.trim() || "N/A",
      clientFirstName: item?.clientId?.firstName || "N/A",
      clientLastName: item?.clientId?.lastName || "N/A",
      clientPhone: item?.clientId?.phoneNumber || "N/A",
      clientEmail: item?.clientId?.email || "N/A",
      pickupDate: dayjs(item?.pickupTime).format("DD/MM/YYYY"),
      pickupTimeOnly: dayjs(item?.pickupTime).format("h:mm A"),
      pickupLocation: item?.pickupLocation?.location || "N/A",
      returnDate: dayjs(item?.returnTime).format("DD/MM/YYYY"),
      returnTimeOnly: dayjs(item?.returnTime).format("h:mm A"),
      returnLocation: item?.returnLocation?.location || "N/A",
      carSize: item?.vehicleType || "N/A",
      carModel: item?.vehicle?.model || "N/A",
      vehicleBrand: item?.vehicle?.brand || "N/A",
      carNumberPlate: item?.vehicle?.plateNumber || "N/A",
      rawAmount: item?.amount || 0,
      status: item?.status || "NOT CONFIRMED",
      driverName: item?.driverId?.name || "Not Assigned",
      // Keep original pickup time for filtering
      originalPickupTime: item?.pickupTime,
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
    { label: "Vehicle Type", key: "carSize" },
    { label: "Vehicle Model", key: "carModel" },
    { label: "Vehicle Brand", key: "vehicleBrand" },
    { label: "License Plate", key: "carNumberPlate" },
    { label: "Amount (₦)", key: "rawAmount" },
    { label: "Status", key: "status" },
    { label: "Assigned Driver", key: "driverName" },
  ];

  // Updated export function to handle date filtering and API call
  const handleExportWithDateRange = async ({ startDate, endDate }) => {
    console.log(
      "Export date range:",
      startDate.format("YYYY-MM-DD"),
      "to",
      endDate.format("YYYY-MM-DD")
    );
    setExportLoading(true);

    try {
      // Fetch data from the API using lazy query
      console.log("=== FETCHING EXPORT DATA FROM API ===");
      console.log("Date Range:", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // Trigger the lazy query with date parameters
      const apiResponse = await getExportData({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }).unwrap();

      // Get the export data from API response
      const exportData = apiResponse?.data?.result || [];

      if (exportData.length === 0) {
        message.warning("No reservations found in the selected date range");
        setExportLoading(false);
        setIsExportModalOpen(false);
        return;
      }

      // Format the export data for CSV
      let formattedExportData = formatExportDataForCSV(exportData);

      // If there are selected rows, filter only those from the export data
      if (selectedRowKeys.length > 0) {
        formattedExportData = formattedExportData.filter((item) =>
          selectedRowKeys.includes(item.key)
        );

        if (formattedExportData.length === 0) {
          message.warning(
            "None of the selected reservations are in the specified date range"
          );
          setExportLoading(false);
          setIsExportModalOpen(false);
          return;
        }
      }

      console.log("=== FINAL CSV DATA ===");
      console.log("CSV Export Data:", formattedExportData);
      console.log("CSV Export Count:", formattedExportData.length);
      console.log("======================");

      setCsvData(formattedExportData);
      setIsExportModalOpen(false);

      // Trigger CSV download
      setTimeout(() => {
        if (csvLinkRef) {
          csvLinkRef.link.click();
        }
        setExportLoading(false);
        message.success(
          `Exported ${formattedExportData.length} reservation(s) successfully!`
        );
      }, 500);
    } catch (error) {
      console.error("=== EXPORT ERROR ===");
      console.error("Error fetching export data:", error);
      console.error("Error details:", error?.data || error?.message);
      console.error("===================");

      message.error("Failed to fetch export data from server");
      setExportLoading(false);
      setIsExportModalOpen(false);
    }
  };

  // Generate filename with current date and date range
  const generateFilename = () => {
    const currentDate = dayjs().format("YYYY-MM-DD_HH-mm");
    const recordCount = csvData.length;
    return `reservations_${currentDate}_${recordCount}records.csv`;
  };

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const columns = [
    {
      title: "Res..Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => {
        const dateA = dayjs(a.createdAt, "DD/MM/YYYY, h:mm A").toDate();
        const dateB = dayjs(b.createdAt, "DD/MM/YYYY, h:mm A").toDate();
        return dateA - dateB;
      },
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.createdAt}</span>
        </div>
      ),
    },
    {
      title: "Pickup",
      dataIndex: "pickUp",
      key: "pickUp",
      sorter: (a, b) => {
        const dateA = dayjs(a.pickupTime, "DD/MM/YYYY, h:mm A").toDate();
        const dateB = dayjs(b.pickupTime, "DD/MM/YYYY, h:mm A").toDate();
        return dateA - dateB;
      },
      sortDirections: ["ascend", "descend"],
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
      sorter: (a, b) => {
        const dateA = dayjs(a.returnTime, "DD/MM/YYYY, h:mm A").toDate();
        const dateB = dayjs(b.returnTime, "DD/MM/YYYY, h:mm A").toDate();
        return dateA - dateB;
      },
      sortDirections: ["ascend", "descend"],
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
      // width: "10%",
      sorter: (a, b) => {
        const nameA = a.carName || "";
        const nameB = b.carName || "";
        return nameA.localeCompare(nameB);
      },
      sortDirections: ["ascend", "descend"],
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
      dataIndex: "rentedDays",
      key: "rentedDays",
      sorter: (a, b) => {
        const daysA = a.rentedDays || 0;
        const daysB = b.rentedDays || 0;
        return daysA - daysB;
      },
      sortDirections: ["ascend", "descend"],
      width: "8%",
      render: (_, record) => (
        <div className="flex text-gray-600 text-sm">
          <span className="text-black font-bold">{`${record.rentedDays} Days`}</span>
        </div>
      ),
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",

      sorter: (a, b) => {
        const clientA = a.client || "";
        const clientB = b.client || "";
        return clientA.localeCompare(clientB);
      },
      sortDirections: ["ascend", "descend"],
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
      sorter: (a, b) => {
        const priceA = parseFloat(a.price?.replace(/[₦,]/g, "") || "0");
        const priceB = parseFloat(b.price?.replace(/[₦,]/g, "") || "0");
        return priceA - priceB;
      },
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium text-green-600">{text}</span>
          <span
            className={`text-xs w-fit px-1.5 py-.5 border rounded mt-1 ${
              record.isPaid
                ? "text-green-600 bg-green-50 border-green-600"
                : "text-red-600 bg-red-50 border-red-600"
            } `}
          >
            {record.isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "18%",
      sorter: (a, b) => {
        const statusA = a.status || "";
        const statusB = b.status || "";
        return statusA.localeCompare(statusB);
      },
      sortDirections: ["ascend", "descend"],
      render: (text, record) => {
        const getStatusColor = (status) => {
          const normalizedStatus = status?.toLowerCase().trim();
          console.log("Status for color:", normalizedStatus);

          switch (normalizedStatus) {
            case "confirmed":
              return "bg-[#5AC5B6]";
            case "not confirmed":
              return "bg-[#F9C74F]";
            case "canceled":
            case "cancelled":
              return "bg-[#F37272]";
            case "completed":
              return "bg-[#90BE6D]";
            case "on ride":
            case "on_ride":
            case "onride":
              return "bg-[#ef621e]";
            default:
              console.log("Using default color for status:", normalizedStatus);
              return "bg-[#F9C74F]";
          }
        };

        const isStatusUpdateDisabled = (currentStatus) => {
          const status = currentStatus?.toLowerCase();
          return status === "cancelled" || status === "completed";
        };

        const getAvailableStatusOptions = (currentStatus) => {
          const status = currentStatus?.toLowerCase();

          switch (status) {
            case "not confirmed":
              return ["NOT CONFIRMED", "CONFIRMED", "CANCELLED"];
            case "confirmed":
              return ["CONFIRMED", "ON RIDE", "CANCELLED"];
            case "on ride":
              return ["ON RIDE", "COMPLETED", "CANCELLED"];
            case "cancelled":
            case "completed":
              return [];
            default:
              return [
                "NOT CONFIRMED",
                "CONFIRMED",
                "ON RIDE",
                "CANCELLED",
                "COMPLETED",
              ];
          }
        };

        const availableOptions = getAvailableStatusOptions(text);
        const isDisabled = isStatusUpdateDisabled(text);

        return (
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-light text-white px-2 py-1 rounded h-[24px] flex items-center ${getStatusColor(
                text
              )}`}
            >
              {text}
            </span>
            {isDisabled ? (
              <span className="text-xs text-gray-500 italic">
                No further updates allowed
              </span>
            ) : (
              <Select
                className="h-[24px]"
                size="small"
                value={text}
                onChange={(value) => handleStatusUpdate(record.id, value)}
                placeholder="Update status"
              >
                {availableOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        );
      },
    },
    {
      title: "Assign Driver",
      dataIndex: "assignDriver",
      key: "assignDriver",
      render: (text, record) => {
        const isDriverAssignmentDisabled =
          record.status?.toLowerCase() === "on ride";

        return (
          <div className="flex">
            <Select
              className=" w-32"
              placeholder="Assign Driver"
              value={record.driverId || undefined}
              onChange={(value) => handleAssignDriver(record.id, value)}
              disabled={isDriverAssignmentDisabled}
            >
              {driverData?.data?.driversWithStatus.map((driver) => (
                <Option key={driver._id} value={driver._id}>
                  {driver.name}
                </Option>
              ))}
            </Select>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-2">
            <Button info icon={<FiEdit3 />} className="border-green-500" />
            <Button
              info
              icon={<FiEye />}
              className="border-green-500"
              onClick={() => handleViewReservation(record)}
            />
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
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
          )}

          <Button
            icon={<LuDownload size={20} />}
            className="bg-smart hover:bg-smart text-white border-none h-8"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export{" "}
            {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ""}
          </Button>

          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={generateFilename()}
            ref={(r) => setCsvLinkRef(r)}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {selectedRowKeys.length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <span className="font-medium">Export Mode:</span>{" "}
          {selectedRowKeys.length} selected reservation(s) will be exported.
          Deselect all to export all reservations.
        </div>
      )}

      <div className="max-h-[72vh] overflow-auto border rounded-md">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={displayData}
          loading={isLoading}
          rowClassName={() => "text-black"}
          size="small"
          pagination={false}
        />
      </div>
      <Pagination
        current={page}
        pageSize={limit}
        total={reservationData?.data?.meta?.total || 0}
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

      <ReservationAddModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        refetch={refetch}
      />

      <ExportModal
        isModalOpen={isExportModalOpen}
        setIsModalOpen={setIsExportModalOpen}
        onExport={handleExportWithDateRange}
        exportLoading={exportLoading}
        selectedCount={selectedRowKeys.length}
      />

      <ReservationViewModal
        isVisible={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedReservatio(null);
        }}
        reservationData={selectedReservation}
      />
    </>
  );
}

export default Reservation;
