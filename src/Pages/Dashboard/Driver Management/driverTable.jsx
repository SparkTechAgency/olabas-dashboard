import { useMemo, useState } from "react";
import { Table, Button, Popconfirm, message, Pagination } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  useGetDriverQuery,
  useDeleteDriverMutation,
} from "../../../redux/apiSlices/driverManagementApi";
import { getImageUrl } from "../../../utils/baseUrl";
import DriverManagementSchedule from "./DriverManagementSchedule";

const DriverTable = ({ onEditDriver, refetch, selectedSegment }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const {
    data: driverData,
    isLoading,
    isError,
  } = useGetDriverQuery({ page, limit });

  console.log("driver", driverData?.data);

  const [deleteDriver, { isLoading: deleteLoading }] =
    useDeleteDriverMutation();

  const handleDelete = async (driverId, driverName) => {
    try {
      await deleteDriver(driverId).unwrap();
      message.success(`Driver ${driverName} deleted successfully!`);
      refetch(); // Refresh the data
    } catch (error) {
      console.error("Error deleting driver:", error);
      message.error(error?.data?.message || "Failed to delete driver");
    }
  };

  const handleEdit = (driver) => {
    console.log("Editing driver:", driver);
    onEditDriver(driver);
  };

  const driverColumns = useMemo(
    () => [
      {
        title: "Profile",
        dataIndex: "image",
        key: "image",
        width: 80,
        // No sorter for Profile column
        render: (image) => (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {image ? (
              <img
                src={`${getImageUrl}${image}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        render: (text) => <span className="font-medium">{text}</span>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""),
      },
      {
        title: "License Number",
        dataIndex: "licenseNumber",
        key: "licenseNumber",
        sorter: (a, b) =>
          (a.licenseNumber || "").localeCompare(b.licenseNumber || ""),
      },
      {
        title: "Status",
        dataIndex: "driverCurrentStatus",
        key: "driverCurrentStatus",
        sorter: (a, b) => {
          const statusA = a.driverCurrentStatus || "IDLE";
          const statusB = b.driverCurrentStatus || "IDLE";
          return statusA.localeCompare(statusB);
        },
        render: (status) => (
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium  ${
                status === "IDLE"
                  ? "bg-green-100 text-green-800"
                  : status === "ON RIDE"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-blue-800"
              }`}
            >
              {status || "IDLE"}
            </span>
            {status === "ON RIDE" && (
              <div className="bg-red-500 w-2 h-2 rounded-full animate-ping"></div>
            )}
          </div>
        ),
      },
      {
        title: "Active Bookings",
        key: "bookings",
        sorter: (a, b) => {
          const bookingsA = a.bookings?.length || 0;
          const bookingsB = b.bookings?.length || 0;
          return bookingsA - bookingsB;
        },
        render: (_, record) => (
          <span className="font-medium">{record.bookings?.length || 0}</span>
        ),
      },
      {
        title: "Verified",
        dataIndex: "verified",
        key: "verified",
        sorter: (a, b) => {
          // Sort verified drivers first (true > false)
          const verifiedA = a.verified ? 1 : 0;
          const verifiedB = b.verified ? 1 : 0;
          return verifiedB - verifiedA;
        },
        render: (verified) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              verified
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {verified ? "Verified" : "Pending"}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        // No sorter for Actions column
        render: (_, record) => (
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Delete Driver"
              description={`Are you sure you want to delete ${record.name}?`}
              onConfirm={() => handleDelete(record._id, record.name)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: deleteLoading }}
            >
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </div>
        ),
      },
    ],
    [deleteLoading, onEditDriver]
  );

  const driverTableData = useMemo(() => {
    return (
      driverData?.data?.map((driver) => ({
        ...driver,
        key: driver._id,
      })) || []
    );
  }, [driverData?.data]);

  if (isLoading)
    return (
      <div className="p-4 flex justify-center items-center">Loading...</div>
    );
  if (isError) return <div className="p-4">Error loading driver data.</div>;

  return (
    <div className="w-full p-4">
      {/* Conditional rendering based on selected segment */}
      {selectedSegment === "drivers" && (
        <div className="mb-8">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Driver Management ({driverData?.data?.length || 0} drivers)
            </h3>
          </div>
          <div className="max-h-[62vh] overflow-auto border rounded-md">
            <Table
              columns={driverColumns}
              dataSource={driverTableData}
              scroll={{ x: "max-content" }}
              size="middle"
              pagination={false}
              showSorterTooltip={{ target: "sorter-icon" }}
            />
          </div>

          {/* Separate Pagination Component */}
          <Pagination
            current={page}
            pageSize={limit}
            total={driverData?.data?.meta?.total || 0}
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
              setPage(1); // Reset to first page when changing page size
              setLimit(size);
            }}
            className="mt-2 text-right" // Add some top margin and align to right
          />
        </div>
      )}

      {/* Driver Schedule Table - Only show when schedule segment is selected */}
      {selectedSegment === "schedule" && (
        <DriverManagementSchedule driverData={driverData} />
      )}
    </div>
  );
};

export default DriverTable;
