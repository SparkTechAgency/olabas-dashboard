// import React, { useState, useMemo } from "react";
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

// const App = () => {
//   const { styles } = useStyle();

//   const { data: driverData, isLoading, isError } = useGetDriverQuery();
//   console.log("driverData", driverData?.data);

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
//     return driverData.data.map((driver, index) => ({
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

//     return driverData.data.map((driver, index) => ({
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
//       {
//         title: "Action",
//         key: "operation",
//         fixed: "right",
//         width: 100,
//         render: () => <a>action</a>,
//       },
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

//       // Add each driver as a column with their assigned vehicle/info
//       driverData.data.forEach((driver) => {
//         row[driver.name] = `${driver.licenseNumber} - ${driver.phone || "N/A"}`;
//         // You can customize what information to show for each driver
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

// export default App;

import React, { useState, useMemo } from "react";
import { Table, Select, Button, DatePicker, message } from "antd";
import { createStyles } from "antd-style";
import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";
import dayjs from "dayjs";

const { Option } = Select;

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

        // Custom select styling for car assignment
        .car-assignment-select {
          width: 100%;

          .ant-select-selector {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
          }

          .ant-select-selection-item {
            color: white !important;
          }

          .ant-select-arrow {
            color: white !important;
          }
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

// Sample car data - you can replace this with API data
const availableCars = [
  { id: 1, name: "PRADO 2", model: "Toyota Prado", plateNumber: "ABC-123" },
  { id: 2, name: "BAMIDELE BMW", model: "BMW X5", plateNumber: "XYZ-456" },
  {
    id: 3,
    name: "MARINO / Sienna",
    model: "Toyota Sienna",
    plateNumber: "DEF-789",
  },
  { id: 4, name: "GX460", model: "Lexus GX460", plateNumber: "GHI-012" },
  {
    id: 5,
    name: "Highlander-2",
    model: "Toyota Highlander",
    plateNumber: "JKL-345",
  },
  { id: 6, name: "ACURA", model: "Acura MDX", plateNumber: "MNO-678" },
  { id: 7, name: "COROLLA", model: "Toyota Corolla", plateNumber: "PQR-901" },
  { id: 8, name: "CAMRY", model: "Toyota Camry", plateNumber: "STU-234" },
];

const App = () => {
  const { styles } = useStyle();

  const { data: driverData, isLoading, isError } = useGetDriverQuery();
  console.log("driverData", driverData?.data);

  // State for car assignments
  const [carAssignments, setCarAssignments] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Generate initial dates (you can modify this based on your requirements)
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(dayjs().add(i, "day").format("YYYY-MM-DD"));
    }
    return dates;
  };

  const [scheduleDates] = useState(generateDates());

  // Function to handle car assignment
  const handleCarAssignment = (date, driverId, carId) => {
    const key = `${date}-${driverId}`;

    // Check if car is already assigned to another driver on the same date
    const existingAssignment = Object.entries(carAssignments).find(
      ([assignmentKey, assignedCarId]) =>
        assignmentKey.startsWith(date) &&
        assignmentKey !== key &&
        assignedCarId === carId
    );

    if (existingAssignment && carId) {
      message.warning(
        "This car is already assigned to another driver on this date!"
      );
      return;
    }

    setCarAssignments((prev) => ({
      ...prev,
      [key]: carId,
    }));

    if (carId) {
      const car = availableCars.find((c) => c.id === carId);
      const driver = driverData?.data?.find((d) => d._id === driverId);
      message.success(`${car?.name} assigned to ${driver?.name} for ${date}`);
    }
  };

  // Get assigned car for a specific date and driver
  const getAssignedCar = (date, driverId) => {
    const key = `${date}-${driverId}`;
    const carId = carAssignments[key];
    return availableCars.find((car) => car.id === carId);
  };

  // Check if a car is available for a specific date
  const isCarAvailable = (carId, date, currentDriverId) => {
    const assignedToOther = Object.entries(carAssignments).some(
      ([key, assignedCarId]) => {
        const [assignmentDate, assignmentDriverId] = key.split("-");
        return (
          assignmentDate === date &&
          assignmentDriverId !== currentDriverId &&
          assignedCarId === carId
        );
      }
    );
    return !assignedToOther;
  };

  // Generate driver columns dynamically based on API data
  const generateDriverColumns = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) {
      return [];
    }

    return driverData.data.map((driver, index) => ({
      title: driver.name,
      dataIndex: driver.name,
      key: driver._id || driver.name,
      width: 200,
      render: (text, record) => {
        const assignedCar = getAssignedCar(record.date, driver._id);

        return (
          <div className="space-y-2">
            <Select
              className="car-assignment-select"
              placeholder="Assign Car"
              value={assignedCar?.id}
              onChange={(carId) =>
                handleCarAssignment(record.date, driver._id, carId)
              }
              allowClear
            >
              {availableCars.map((car) => (
                <Option
                  key={car.id}
                  value={car.id}
                  disabled={!isCarAvailable(car.id, record.date, driver._id)}
                >
                  {car.name} ({car.plateNumber})
                  {!isCarAvailable(car.id, record.date, driver._id) &&
                    " - Assigned"}
                </Option>
              ))}
            </Select>
            {assignedCar && (
              <div className="text-xs opacity-80">{assignedCar.model}</div>
            )}
          </div>
        );
      },
    }));
  }, [driverData?.data, carAssignments]);

  // Generate columns including dynamic driver columns
  const generateColumns = useMemo(() => {
    const dynamicDriverColumns = generateDriverColumns;

    return [
      {
        title: "Date",
        width: 120,
        dataIndex: "dateDriver",
        key: "dateDriver",
        fixed: "left",
      },
      ...dynamicDriverColumns,
      {
        title: "Action",
        key: "operation",
        fixed: "right",
        width: 150,
        render: (_, record) => (
          <div className="space-y-1">
            <Button size="small" onClick={() => handleBulkAssign(record.date)}>
              Auto Assign
            </Button>
            <Button
              size="small"
              danger
              onClick={() => handleClearDate(record.date)}
            >
              Clear All
            </Button>
          </div>
        ),
      },
    ];
  }, [generateDriverColumns]);

  // Create structured data for the table
  const createStructuredData = useMemo(() => {
    return scheduleDates.map((date, index) => ({
      key: date,
      date: date,
      dateDriver: dayjs(date).format("DD MMM YY"),
    }));
  }, [scheduleDates]);

  // Generate dynamic CSS for column colors
  const generateColumnStyles = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) {
      return "";
    }

    let styles = "";
    driverData.data.forEach((driver, index) => {
      const columnIndex = index + 2;
      const colorIndex = index % columnColors.length;
      styles += `
        .ant-table-tbody > tr > td:nth-child(${columnIndex}) {
          background-color: ${columnColors[colorIndex]} !important;
        }
      `;
    });
    return styles;
  }, [driverData?.data]);

  // Auto assign available cars to drivers for a specific date
  const handleBulkAssign = (date) => {
    if (!driverData?.data) return;

    const availableCarsForDate = availableCars.filter((car) =>
      isCarAvailable(car.id, date, null)
    );

    driverData.data.forEach((driver, index) => {
      if (
        index < availableCarsForDate.length &&
        !getAssignedCar(date, driver._id)
      ) {
        handleCarAssignment(date, driver._id, availableCarsForDate[index].id);
      }
    });
  };

  // Clear all assignments for a specific date
  const handleClearDate = (date) => {
    const newAssignments = { ...carAssignments };
    Object.keys(newAssignments).forEach((key) => {
      if (key.startsWith(date)) {
        delete newAssignments[key];
      }
    });
    setCarAssignments(newAssignments);
    message.success(
      `All assignments cleared for ${dayjs(date).format("DD MMM YY")}`
    );
  };

  // Export assignments (you can save this to your backend)
  const exportAssignments = () => {
    console.log("Car Assignments:", carAssignments);
    message.success("Assignments exported to console");
  };

  if (isLoading) {
    return <div className="w-full p-4">Loading drivers...</div>;
  }

  if (isError) {
    return <div className="w-full p-4">Error loading driver data</div>;
  }

  return (
    <div className="w-full p-4">
      <style>{generateColumnStyles}</style>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            Driver Car Assignment Schedule
          </h3>
          <p className="text-gray-600">
            {driverData?.data?.length || 0} drivers • {availableCars.length}{" "}
            cars available
          </p>
        </div>

        <div className="space-x-2">
          <Button onClick={exportAssignments}>Export Assignments</Button>
          <Button
            danger
            onClick={() => {
              setCarAssignments({});
              message.success("All assignments cleared");
            }}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Available Cars:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {availableCars.map((car) => (
            <div key={car.id} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor: columnColors[car.id % columnColors.length],
                }}
              ></div>
              <span>{car.name}</span>
            </div>
          ))}
        </div>
      </div>

      <Table
        className={styles.customTable}
        columns={generateColumns}
        dataSource={createStructuredData}
        scroll={{ x: "max-content", y: 550 }}
        pagination={false}
      />
    </div>
  );
};

export default App;
