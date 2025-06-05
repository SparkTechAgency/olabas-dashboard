import React, { useState, useMemo } from "react";
import { Table } from "antd";
import { createStyles } from "antd-style";
import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";
import { useGetFleetByIdQuery } from "../../../redux/apiSlices/fleetManagement";

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

        // Date/Driver column (green)
        ${antCls}-table-tbody > tr > td:first-child {
          background-color: #52c41a !important;
        }

        // Action column (white)
        ${antCls}-table-tbody > tr > td:last-child {
          background-color: white !important;
          color: #333 !important;
        }
      }
    `,
  };
});

// Predefined colors for dynamic columns
const columnColors = [
  "#ff4d4f", // Red
  "#faad14", // Gold
  "#f759ab", // Pink
  "#ff7a45", // Orange
  "#fadb14", // Yellow
  "#fa8c16", // Orange Red
  "#722ed1", // Purple
  "#13c2c2", // Cyan
  "#1890ff", // Blue
  "#52c41a", // Green
  "#eb2f96", // Magenta
  "#a0d911", // Lime
];

const DriverInfo = () => {
  const { styles } = useStyle();

  const { data: driverData, isLoading, isError } = useGetDriverQuery();
  console.log("driverData", driverData?.data);

  //   driverData?.data?.bookings.map((vID) => console.log(vID));

  const { data: vechileData } = useGetFleetByIdQuery();

  // Sample data for fallback - you can remove this once API is working
  const [sampleDataSource] = useState([
    {
      key: 1,
      dateDriver: "1 March 25",
      Uche: "PRADO 2",
      Soji: "BAMIDELE BMW",
      Musili: "MARINO / Sienna",
      Solomon: "GX460",
      Isreal: "Highlander-2",
      Paul: "ACURA",
    },
    // ... other sample data
  ]);

  // Transform API data to table format
  const transformedDataSource = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) {
      return sampleDataSource; // Fallback to sample data
    }

    // Transform driver data to table rows
    // Assuming you want to create rows for each date/assignment
    // You might need to adjust this based on your exact requirements
    return driverData?.data?.map((driver, index) => ({
      key: driver._id || index,
      dateDriver: `Driver ${index + 1}`, // You can modify this based on your date logic
      [driver.name]: `${driver.licenseNumber}`, // Use driver name as column key
      // Add more fields as needed
    }));
  }, [driverData?.data, sampleDataSource]);

  // Generate driver columns dynamically based on API data
  const generateDriverColumns = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) {
      return []; // Return empty if no driver data
    }

    return driverData?.data?.map((driver, index) => ({
      title: driver.name,
      dataIndex: driver.name,
      key: driver._id || driver.name,
      width: 150,
      render: (text, record) => {
        // You can customize what to display in each driver column
        // For example, show assigned vehicle, license number, etc.
        return record[driver.name] || "Not Assigned";
      },
    }));
  }, [driverData?.data]);

  // Automatically generate all columns including dynamic driver columns
  const generateColumns = useMemo(() => {
    const dynamicDriverColumns = generateDriverColumns;

    // Return complete column structure
    return [
      {
        title: "Date/Driver",
        width: 120,
        dataIndex: "dateDriver",
        key: "dateDriver",
        fixed: "left",
      },
      ...dynamicDriverColumns,
      //   {
      //     title: "Action",
      //     key: "operation",
      //     fixed: "right",
      //     width: 100,
      //     render: () => <a>action</a>,
      //   },
    ];
  }, [generateDriverColumns]);

  // Generate dynamic CSS for column colors
  const generateColumnStyles = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) {
      return "";
    }

    let styles = "";
    driverData.data.forEach((driver, index) => {
      const columnIndex = index + 2; // +2 because first column is date/driver
      const colorIndex = index % columnColors.length;
      styles += `
        .ant-table-tbody > tr > td:nth-child(${columnIndex}) {
          background-color: ${columnColors[colorIndex]} !important;
        }
      `;
    });
    return styles;
  }, [driverData?.data]);

  // Alternative approach: Create a more structured data format
  const createStructuredData = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) {
      return sampleDataSource;
    }

    // Create structured data where each row represents a date/schedule
    // and each driver has their own column
    const structuredData = [];

    // Example: Create rows for different dates or assignments
    // You'll need to adjust this based on your business logic
    for (let i = 0; i < 10; i++) {
      // Creating 10 rows as example
      const row = {
        key: i + 1,
        dateDriver: `${i + 1} March 25`, // You can use actual dates here
      };

      // Add each driver as a column with their assigned vehicle/info
      driverData.data.forEach((driver) => {
        // Get all vehicle names for the driver, or "N/A" if no bookings exist
        const vehicleNames =
          driver.bookings.length > 0
            ? driver.bookings.map((booking) => booking.vehicle.name).join(", ")
            : "N/A"; // In case the driver has no bookings

        // Only store the vehicle names in the row
        row[driver.name] = `${vehicleNames}`;
      });

      structuredData.push(row);
    }

    return structuredData;
  }, [driverData?.data, sampleDataSource]);

  if (isLoading) {
    return <div className="w-full p-4">Loading drivers...</div>;
  }

  if (isError) {
    return <div className="w-full p-4">Error loading driver data</div>;
  }

  return (
    <div className="w-full p-4">
      <style>{generateColumnStyles}</style>

      <div className="mb-4">
        <h3>
          Dynamic Driver Columns ({driverData?.data?.length || 0} drivers
          loaded)
        </h3>
      </div>

      <Table
        className={styles.customTable}
        columns={generateColumns}
        dataSource={createStructuredData}
        scroll={{ x: "max-content", y: 550 }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DriverInfo;
