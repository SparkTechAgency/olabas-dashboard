// import React, { useState, useMemo } from "react";
// import { Table } from "antd";
// import { createStyles } from "antd-style";
// import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";
// import { useGetFleetByIdQuery } from "../../../redux/apiSlices/fleetManagement";

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

//         // Date/Driver column (green)
//         ${antCls}-table-tbody > tr > td:first-child {
//           background-color: #52c41a !important;
//         }

//         // Action column (white)
//         ${antCls}-table-tbody > tr > td:last-child {
//           background-color: white !important;
//           color: #333 !important;
//         }
//       }
//     `,
//   };
// });

// // Predefined colors for dynamic columns
// const columnColors = [
//   "#ff4d4f", // Red
//   "#faad14", // Gold
//   "#f759ab", // Pink
//   "#ff7a45", // Orange
//   "#fadb14", // Yellow
//   "#fa8c16", // Orange Red
//   "#722ed1", // Purple
//   "#13c2c2", // Cyan
//   "#1890ff", // Blue
//   "#52c41a", // Green
//   "#eb2f96", // Magenta
//   "#a0d911", // Lime
// ];

// const DriverInfo = () => {
//   const { styles } = useStyle();

//   const { data: driverData, isLoading, isError } = useGetDriverQuery();
//   console.log("driverData", driverData?.data);

//   //   driverData?.data?.bookings.map((vID) => console.log(vID));

//   const { data: vechileData } = useGetFleetByIdQuery();

//   // Sample data for fallback - you can remove this once API is working
//   const [sampleDataSource] = useState([
//     {
//       key: 1,
//       dateDriver: "1 March 25",
//       Uche: "PRADO 2",
//       Soji: "BAMIDELE BMW",
//       Musili: "MARINO / Sienna",
//       Solomon: "GX460",
//       Isreal: "Highlander-2",
//       Paul: "ACURA",
//     },
//     // ... other sample data
//   ]);

//   // Transform API data to table format
//   const transformedDataSource = useMemo(() => {
//     if (!driverData?.data || !Array.isArray(driverData.data)) {
//       return sampleDataSource; // Fallback to sample data
//     }

//     // Transform driver data to table rows
//     // Assuming you want to create rows for each date/assignment
//     // You might need to adjust this based on your exact requirements
//     return driverData?.data?.map((driver, index) => ({
//       key: driver._id || index,
//       dateDriver: `Driver ${index + 1}`, // You can modify this based on your date logic
//       [driver.name]: `${driver.licenseNumber}`, // Use driver name as column key
//       // Add more fields as needed
//     }));
//   }, [driverData?.data, sampleDataSource]);

//   // Generate driver columns dynamically based on API data
//   const generateDriverColumns = useMemo(() => {
//     if (!driverData?.data || !Array.isArray(driverData.data)) {
//       return []; // Return empty if no driver data
//     }

//     return driverData?.data?.map((driver, index) => ({
//       title: driver.name,
//       dataIndex: driver.name,
//       key: driver._id || driver.name,
//       width: 150,
//       render: (text, record) => {
//         // You can customize what to display in each driver column
//         // For example, show assigned vehicle, license number, etc.
//         return record[driver.name] || "Not Assigned";
//       },
//     }));
//   }, [driverData?.data]);

//   // Automatically generate all columns including dynamic driver columns
//   const generateColumns = useMemo(() => {
//     const dynamicDriverColumns = generateDriverColumns;

//     // Return complete column structure
//     return [
//       {
//         title: "Date/Driver",
//         width: 120,
//         dataIndex: "dateDriver",
//         key: "dateDriver",
//         fixed: "left",
//       },
//       ...dynamicDriverColumns,
//     ];
//   }, [generateDriverColumns]);

//   // Generate dynamic CSS for column colors
//   const generateColumnStyles = useMemo(() => {
//     if (!driverData?.data || !Array.isArray(driverData.data)) {
//       return "";
//     }

//     let styles = "";
//     driverData.data.forEach((driver, index) => {
//       const columnIndex = index + 2; // +2 because first column is date/driver
//       const colorIndex = index % columnColors.length;
//       styles += `
//         .ant-table-tbody > tr > td:nth-child(${columnIndex}) {
//           background-color: ${columnColors[colorIndex]} !important;
//         }
//       `;
//     });
//     return styles;
//   }, [driverData?.data]);

//   // Alternative approach: Create a more structured data format
//   const createStructuredData = useMemo(() => {
//     if (!driverData?.data || !Array.isArray(driverData.data)) {
//       return sampleDataSource;
//     }

//     // Create structured data where each row represents a date/schedule
//     // and each driver has their own column
//     const structuredData = [];

//     // Example: Create rows for different dates or assignments
//     // You'll need to adjust this based on your business logic
//     for (let i = 0; i < 10; i++) {
//       // Creating 10 rows as example
//       const row = {
//         key: i + 1,
//         dateDriver: `${i + 1} March 25`, // You can use actual dates here
//       };

//       driverData.data.forEach((driver) => {
//         // Get all vehicle names for the driver, or "N/A" if no bookings exist
//         const row = {
//           key: driver._id,
//           dateDriver: driver.bookings.map(
//             (booking) => booking.vehicle.pickupDate
//           ), // You can use actual dates here
//         };

//         // Only store the vehicle names in the row
//       });

//       // Add each driver as a column with their assigned vehicle/info
//       driverData.data.forEach((driver) => {
//         // Get all vehicle names for the driver, or "N/A" if no bookings exist
//         const vehicleNames =
//           driver.bookings.length > 0
//             ? driver.bookings.map((booking) => booking.vehicle.name).join(", ")
//             : "N/A"; // In case the driver has no bookings

//         // Only store the vehicle names in the row
//         row[driver.name] = `${vehicleNames}`;
//       });

//       structuredData.push(row);
//     }

//     return structuredData;
//   }, [driverData?.data, sampleDataSource]);

//   if (isLoading) {
//     return <div className="w-full p-4">Loading drivers...</div>;
//   }

//   if (isError) {
//     return <div className="w-full p-4">Error loading driver data</div>;
//   }

//   return (
//     <div className="w-full p-4">
//       <style>{generateColumnStyles}</style>

//       <div className="mb-4">
//         <h3>
//           Dynamic Driver Columns ({driverData?.data?.length || 0} drivers
//           loaded)
//         </h3>
//       </div>

//       <Table
//         className={styles.customTable}
//         columns={generateColumns}
//         dataSource={createStructuredData}
//         scroll={{ x: "max-content", y: 550 }}
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
// };

// export default DriverInfo;

// import { useMemo } from "react";
// import { Table } from "antd";
// import { createStyles } from "antd-style";
// import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";

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
//   const { data: driverData, isLoading, isError } = useGetDriverQuery();

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

//   const columns = useMemo(() => {
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

//   if (isLoading) return <div className="p-4">Loading drivers...</div>;
//   if (isError) return <div className="p-4">Error loading driver data.</div>;

//   return (
//     <div className="w-full p-4">
//       <style>{generateColumnStyles}</style>
//       <div className="mb-4">
//         <h3>
//           Driver Booking Table ({driverData?.data?.length || 0} drivers loaded)
//         </h3>
//       </div>
//       <Table
//         className={styles.customTable}
//         columns={columns}
//         dataSource={transformedData}
//         scroll={{ x: "max-content", y: 550 }}
//         pagination={{ pageSize: 10 }}
//       />
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
import { getBaseUrl } from "../../../utils/baseUrl";
import { FaCar } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
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
  const { data: driverData, isLoading, isError, refetch } = useGetDriverQuery();
  const [deleteDriver, { isLoading: deleteLoading }] =
    useDeleteDriverMutation();

  // Handle delete driver
  const handleDelete = async (driverId, driverName) => {
    try {
      await deleteDriver(driverId).unwrap();
      message.success(`Driver ${driverName} deleted successfully!`);
      refetch();
    } catch (error) {
      console.error("Error deleting driver:", error);
      message.error(error?.data?.message || "Failed to delete driver");
    }
  };

  // Transform data for the schedule table
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
  }, [driverData]);

  // Columns for schedule table
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
  }, [driverData]);

  // Columns for driver management table
  const driverColumns = [
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
            // <FaCar className="text-red-500 animate-ping" />
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
              // Handle edit - you can implement this
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
  ];

  const generateColumnStyles = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) return "";

    let styles = "";
    driverData.data.forEach((driver, index) => {
      const columnIndex = index + 2; // +2 for Date/Driver column
      const color = columnColors[index % columnColors.length];
      styles += `
        .ant-table-tbody > tr > td:nth-child(${columnIndex}) {
          background-color: ${color} !important;
        }
      `;
    });
    return styles;
  }, [driverData]);

  if (isLoading)
    return <div className="p-4 flex justify-center items-center"></div>;
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
          dataSource={
            driverData?.data?.map((driver) => ({
              ...driver,
              key: driver._id,
            })) || []
          }
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
