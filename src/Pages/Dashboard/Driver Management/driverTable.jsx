import { useMemo } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  useGetDriverQuery,
  useDeleteDriverMutation,
} from "../../../redux/apiSlices/driverManagementApi";

const DriverTable = ({ onEditDriver, refetch }) => {
  const {
    data: driverData,
    isLoading,
    isError,
  } = useGetDriverQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    refetchOnFocus: false,
    skip: false,
    pollingInterval: 0,
  });

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

  const transformedData = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) return [];

    const groupedByDate = {};

    driverData.data.forEach((driver) => {
      driver.bookings?.forEach((booking) => {
        const pickupDate = new Date(booking.pickupDate).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }
        );

        if (!groupedByDate[pickupDate]) {
          groupedByDate[pickupDate] = {
            key: pickupDate,
            dateDriver: pickupDate,
          };
        }

        const vehicleName = booking.vehicle?.name || "N/A";
        if (groupedByDate[pickupDate][driver.name]) {
          groupedByDate[pickupDate][driver.name] += `, ${vehicleName}`;
        } else {
          groupedByDate[pickupDate][driver.name] = vehicleName;
        }
      });
    });

    return Object.values(groupedByDate);
  }, [driverData?.data]);

  const scheduleColumns = useMemo(() => {
    const base = [
      {
        title: "Date/Driver",
        dataIndex: "dateDriver",
        key: "dateDriver",
        fixed: "left",
        width: 130,
      },
    ];

    if (!driverData?.data) return base;

    const driverColumns = driverData.data.map((driver, index) => ({
      title: driver.name,
      dataIndex: driver.name,
      key: driver._id,
      width: 150,
      render: (text) => text || "Not Assigned",
    }));

    return [...base, ...driverColumns];
  }, [driverData?.data]);

  const driverColumns = useMemo(
    () => [
      {
        title: "Profile",
        dataIndex: "image",
        key: "image",
        width: 80,
        render: (image) => (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {image ? (
              <img
                src={`http://10.0.60.110:5000${image}`}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/40x40?text=No+Image";
                }}
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
        render: (text) => <span className="font-medium">{text}</span>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "License Number",
        dataIndex: "licenseNumber",
        key: "licenseNumber",
      },
      {
        title: "Status",
        dataIndex: "driverCurrentStatus",
        key: "driverCurrentStatus",
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
        render: (_, record) => (
          <span className="font-medium">{record.bookings?.length || 0}</span>
        ),
      },
      {
        title: "Verified",
        dataIndex: "verified",
        key: "verified",
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
      {/* Driver Management Table */}
      <div className="mb-8">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Driver Management ({driverData?.data?.length || 0} drivers)
          </h3>
        </div>
        <Table
          columns={driverColumns}
          dataSource={driverTableData}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} drivers`,
          }}
          size="middle"
        />
      </div>

      {/* Driver Schedule Table */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Driver Booking Schedule</h3>
        </div>
        <Table
          columns={scheduleColumns}
          dataSource={transformedData}
          scroll={{ x: "max-content", y: 550 }}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default DriverTable;
