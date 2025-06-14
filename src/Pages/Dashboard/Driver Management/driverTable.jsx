// import { useMemo } from "react";
// import { Table, Button, Popconfirm, message } from "antd";
// import { createStyles } from "antd-style";
// import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import {
//   useGetDriverQuery,
//   useDeleteDriverMutation,
// } from "../../../redux/apiSlices/driverManagementApi";

// const useStyle = createStyles(({ css, token }) => {
//   const { antCls } = token;
//   return {
//     customTable: css`
//       ${antCls}-table {
//         ${antCls}-table-container {
//           ${antCls}-table-body,
//           ${antCls}-table-content {
//             scrollbar-width: thin;
//             scrollbar-color: #eaeaea transparent;
//             scrollbar-gutter: stable;
//           }
//         }

//         ${antCls}-table-thead > tr > th {
//           background: white !important;
//           border-bottom: 2px solid #f0f0f0;
//           font-weight: 600;
//           color: #333;
//         }

//         ${antCls}-table-tbody > tr > td {
//           border: 1px solid white;
//           color: white;
//           font-weight: 500;
//         }

//         ${antCls}-table-tbody > tr > td:first-child {
//           background-color: #52c41a !important;
//         }

//         ${antCls}-table-tbody > tr > td:last-child {
//           background-color: white !important;
//           color: #333 !important;
//         }
//       }
//     `,
//   };
// });

// const columnColors = [
//   "#ff4d4f",
//   "#faad14",
//   "#f759ab",
//   "#ff7a45",
//   "#fadb14",
//   "#fa8c16",
//   "#722ed1",
//   "#13c2c2",
//   "#1890ff",
//   "#52c41a",
//   "#eb2f96",
//   "#a0d911",
// ];

// const DriverTable = () => {
//   const { styles } = useStyle();
//   const {
//     data: driverData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetDriverQuery(undefined, {
//     refetchOnMountOrArgChange: false,
//     refetchOnReconnect: false,
//     refetchOnFocus: false,
//   });
//   const [deleteDriver, { isLoading: deleteLoading }] =
//     useDeleteDriverMutation();

//   // Handle delete driver
//   const handleDelete = async (driverId, driverName) => {
//     try {
//       await deleteDriver(driverId).unwrap();
//       message.success(`Driver ${driverName} deleted successfully!`);
//       refetch();
//     } catch (error) {
//       console.error("Error deleting driver:", error);
//       message.error(error?.data?.message || "Failed to delete driver");
//     }
//   };

//   // Transform data for the schedule table
//   const transformedData = useMemo(() => {
//     if (!driverData?.data || !Array.isArray(driverData.data)) return [];

//     const groupedByDate = {};

//     driverData.data.forEach((driver) => {
//       driver.bookings?.forEach((booking) => {
//         const pickupDate = new Date(booking.pickupDate).toLocaleDateString(
//           "en-GB",
//           {
//             day: "2-digit",
//             month: "short",
//             year: "2-digit",
//           }
//         );

//         if (!groupedByDate[pickupDate]) {
//           groupedByDate[pickupDate] = {
//             key: pickupDate,
//             dateDriver: pickupDate,
//           };
//         }

//         const vehicleName = booking.vehicle?.name || "N/A";
//         if (groupedByDate[pickupDate][driver.name]) {
//           groupedByDate[pickupDate][driver.name] += `, ${vehicleName}`;
//         } else {
//           groupedByDate[pickupDate][driver.name] = vehicleName;
//         }
//       });
//     });

//     return Object.values(groupedByDate);
//   }, [driverData]);

//   // Columns for schedule table
//   const scheduleColumns = useMemo(() => {
//     const base = [
//       {
//         title: "Date/Driver",
//         dataIndex: "dateDriver",
//         key: "dateDriver",
//         fixed: "left",
//         width: 130,
//       },
//     ];

//     if (!driverData?.data) return base;

//     const driverColumns = driverData.data.map((driver, index) => ({
//       title: driver.name,
//       dataIndex: driver.name,
//       key: driver._id,
//       width: 150,
//       render: (text) => text || "Not Assigned",
//     }));

//     return [...base, ...driverColumns];
//   }, [driverData]);

//   // Columns for driver management table
//   const driverColumns = [
//     {
//       title: "Profile",
//       dataIndex: "image",
//       key: "image",
//       width: 80,
//       render: (image) => (
//         <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
//           {image ? (
//             <img
//               src={`http://10.0.60.110:5000${image}`}
//               alt="Profile"
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.target.src =
//                   "https://via.placeholder.com/40x40?text=No+Image";
//               }}
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
//               No Image
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       render: (text) => <span className="font-medium">{text}</span>,
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       key: "phone",
//     },
//     {
//       title: "License Number",
//       dataIndex: "licenseNumber",
//       key: "licenseNumber",
//     },
//     {
//       title: "Status",
//       dataIndex: "driverCurrentStatus",
//       key: "driverCurrentStatus",
//       render: (status) => (
//         <div className="flex items-center gap-2.5">
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium  ${
//               status === "IDLE"
//                 ? "bg-green-100 text-green-800"
//                 : status === "ON RIDE"
//                 ? "bg-red-100 text-red-800"
//                 : "bg-gray-100 text-blue-800"
//             }`}
//           >
//             {status || "IDLE"}
//           </span>
//           {status === "ON RIDE" && (
//             // <FaCar className="text-red-500 animate-ping" />
//             <div className="bg-red-500 w-2 h-2 rounded-full animate-ping"></div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Active Bookings",
//       key: "bookings",
//       render: (_, record) => (
//         <span className="font-medium">{record.bookings?.length || 0}</span>
//       ),
//     },
//     {
//       title: "Verified",
//       dataIndex: "verified",
//       key: "verified",
//       render: (verified) => (
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${
//             verified
//               ? "bg-blue-100 text-blue-800"
//               : "bg-yellow-100 text-yellow-800"
//           }`}
//         >
//           {verified ? "Verified" : "Pending"}
//         </span>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       width: 120,
//       render: (_, record) => (
//         <div className="flex gap-2">
//           <Button
//             type="primary"
//             icon={<EditOutlined />}
//             size="small"
//             onClick={() => {
//               // Handle edit - you can implement this
//               message.info("Edit functionality to be implemented");
//             }}
//           />
//           <Popconfirm
//             title="Delete Driver"
//             description={`Are you sure you want to delete ${record.name}?`}
//             onConfirm={() => handleDelete(record._id, record.name)}
//             okText="Yes"
//             cancelText="No"
//             okButtonProps={{ loading: deleteLoading }}
//           >
//             <Button danger icon={<DeleteOutlined />} size="small" />
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   const generateColumnStyles = useMemo(() => {
//     if (!driverData?.data || !Array.isArray(driverData.data)) return "";

//     let styles = "";
//     driverData.data.forEach((driver, index) => {
//       const columnIndex = index + 2; // +2 for Date/Driver column
//       const color = columnColors[index % columnColors.length];
//       styles += `
//         .ant-table-tbody > tr > td:nth-child(${columnIndex}) {
//           background-color: ${color} !important;
//         }
//       `;
//     });
//     return styles;
//   }, [driverData]);

//   if (isLoading)
//     return <div className="p-4 flex justify-center items-center"></div>;
//   if (isError) return <div className="p-4">Error loading driver data.</div>;

//   return (
//     <div className="w-full p-4">
//       {/* Driver Management Table */}
//       <div className="mb-8">
//         <div className="mb-4 flex justify-between items-center">
//           <h3 className="text-lg font-semibold">
//             Driver Management ({driverData?.data?.length || 0} drivers)
//           </h3>
//         </div>
//         <Table
//           columns={driverColumns}
//           dataSource={
//             driverData?.data?.map((driver) => ({
//               ...driver,
//               key: driver._id,
//             })) || []
//           }
//           scroll={{ x: "max-content" }}
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total, range) =>
//               `${range[0]}-${range[1]} of ${total} drivers`,
//           }}
//           size="middle"
//         />
//       </div>

//       {/* Driver Schedule Table */}
//       <div>
//         <style>{generateColumnStyles}</style>
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold">Driver Booking Schedule</h3>
//         </div>
//         <Table
//           className={styles.customTable}
//           columns={scheduleColumns}
//           dataSource={transformedData}
//           scroll={{ x: "max-content", y: 550 }}
//           pagination={{ pageSize: 10 }}
//           size="middle"
//         />
//       </div>
//     </div>
//   );
// };

// export default DriverTable;

import { useMemo } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { createStyles } from "antd-style";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  useGetDriverQuery,
  useDeleteDriverMutation,
} from "../../../redux/apiSlices/driverManagementApi";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }

        ${antCls}-table-thead > tr > th {
          background: white !important;
          border-bottom: 2px solid #f0f0f0;
          font-weight: 600;
          color: #333;
        }

        ${antCls}-table-tbody > tr > td {
          border: 1px solid white;
          color: white;
          font-weight: 500;
        }

        ${antCls}-table-tbody > tr > td:first-child {
          background-color: #52c41a !important;
        }

        ${antCls}-table-tbody > tr > td:last-child {
          background-color: white !important;
          color: #333 !important;
        }
      }
    `,
  };
});

const columnColors = [
  "#ff4d4f",
  "#faad14",
  "#f759ab",
  "#ff7a45",
  "#fadb14",
  "#fa8c16",
  "#722ed1",
  "#13c2c2",
  "#1890ff",
  "#52c41a",
  "#eb2f96",
  "#a0d911",
];

const DriverTable = () => {
  const { styles } = useStyle();
  const {
    data: driverData,
    isLoading,
    isError,
    refetch,
  } = useGetDriverQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    refetchOnFocus: false,
    // Add these to prevent unnecessary refetches
    skip: false,
    pollingInterval: 0, // Disable polling
  });

  const [deleteDriver, { isLoading: deleteLoading }] =
    useDeleteDriverMutation();

  // Handle delete driver - Remove refetch() call
  const handleDelete = async (driverId, driverName) => {
    try {
      await deleteDriver(driverId).unwrap();
      message.success(`Driver ${driverName} deleted successfully!`);
      // Remove manual refetch - RTK Query will invalidate cache automatically
      // if your API slice is configured properly
    } catch (error) {
      console.error("Error deleting driver:", error);
      message.error(error?.data?.message || "Failed to delete driver");
    }
  };

  // Memoize with proper dependencies
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
  }, [driverData?.data]); // More specific dependency

  // Better memoization for schedule columns
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
  }, [driverData?.data]); // More specific dependency

  // Memoize driver columns to prevent recreating on every render
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
              onClick={() => {
                message.info("Edit functionality to be implemented");
              }}
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
    [deleteLoading, handleDelete]
  ); // Add dependencies

  const generateColumnStyles = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) return "";

    let styles = "";
    driverData.data.forEach((driver, index) => {
      const columnIndex = index + 2;
      const color = columnColors[index % columnColors.length];
      styles += `
        .ant-table-tbody > tr > td:nth-child(${columnIndex}) {
          background-color: ${color} !important;
        }
      `;
    });
    return styles;
  }, [driverData?.data]); // More specific dependency

  // Memoize table data source
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
        <style>{generateColumnStyles}</style>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Driver Booking Schedule</h3>
        </div>
        <Table
          className={styles.customTable}
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
