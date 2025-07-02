// import { Select, Table } from "antd";
// import React, { useMemo } from "react";
// import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";

// function DriverManagementSchedule() {
//   const {
//     data: driverData,
//     isLoading,
//     isError,
//   } = useGetDriverQuery({ page: 1, limit: 50 });
//   console.log("Schedule", driverData?.data?.driversWithStatus);

//   // Transform data for schedule table
//   const transformedData = useMemo(() => {
//     // Check if we have the correct data structure
//     const drivers =
//       driverData?.data?.driversWithStatus || driverData?.data || [];

//     if (!Array.isArray(drivers) || drivers.length === 0) {
//       return [];
//     }

//     const groupedByDate = {};

//     drivers.forEach((driver) => {
//       // Check if driver has bookings
//       if (!driver.bookings || !Array.isArray(driver.bookings)) {
//         return;
//       }

//       driver.bookings.forEach((booking) => {
//         const rawDate = new Date(booking.pickupDate);
//         const pickupDate = rawDate.toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "2-digit",
//         });

//         // Initialize date group if it doesn't exist
//         if (!groupedByDate[pickupDate]) {
//           groupedByDate[pickupDate] = {
//             key: pickupDate,
//             dateDriver: pickupDate,
//             sortDate: rawDate.getTime(),
//           };
//         }

//         // Get vehicle name and status from booking
//         const vehicleName = booking.vehicle?.name || "Unknown Vehicle";
//         const status = booking.status || "N/A";
//         const bookingInfo = `${vehicleName}|${status}`; // Use | as separator to preserve status

//         // Add or append vehicle info for this driver on this date
//         if (groupedByDate[pickupDate][driver.name]) {
//           groupedByDate[pickupDate][driver.name] += `, ${bookingInfo}`;
//         } else {
//           groupedByDate[pickupDate][driver.name] = bookingInfo;
//         }
//       });
//     });

//     // Sort by date
//     return Object.values(groupedByDate).sort((a, b) => a.sortDate - b.sortDate);
//   }, [driverData]);

//   // Generate schedule columns
//   const scheduleColumns = useMemo(() => {
//     const base = [
//       {
//         title: "Date/Driver",
//         dataIndex: "dateDriver",
//         key: "dateDriver",
//         fixed: "left",
//         width: 130,
//         render: (text) => <strong className="text-blue-600">{text}</strong>,
//       },
//     ];

//     // Get drivers from the correct data structure
//     const drivers =
//       driverData?.data?.driversWithStatus || driverData?.data || [];

//     if (!Array.isArray(drivers) || drivers.length === 0) {
//       return base;
//     }

//     const driverColumns = drivers.map((driver) => ({
//       title: driver.name || "Unknown Driver",
//       dataIndex: driver.name || "unknown",
//       key: driver._id || driver.id || driver.name,
//       width: 200,
//       render: (text) => {
//         if (!text) {
//           return (
//             <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-sm">
//               No Bookings
//             </span>
//           );
//         }

//         // Split multiple bookings and render each one
//         const bookings = text.split(", ");
//         return (
//           <div className="space-y-1">
//             {bookings.map((booking, index) => {
//               const [vehicleName, status] = booking.split("|");
//               const statusUpper = status?.toUpperCase();
//               const isCompleted = statusUpper === "COMPLETED";
//               const isOnRide = statusUpper === "ON RIDE";

//               let bgColor, textColor;
//               if (isCompleted) {
//                 bgColor = "bg-green-400";
//                 textColor = "text-black font-semibold";
//               } else if (isOnRide) {
//                 bgColor = "bg-[#ef621e]";
//                 textColor = "text-white";
//               } else {
//                 bgColor = "bg-yellow-500";
//                 textColor = "text-black";
//               }

//               return (
//                 <div
//                   key={index}
//                   className={`${bgColor} ${textColor} px-2 py-1 rounded-md text-xs`}
//                 >
//                   {vehicleName} ({status})
//                 </div>
//               );
//             })}
//           </div>
//         );
//       },
//     }));

//     return [...base, ...driverColumns];
//   }, [driverData]);

//   // Debug information
//   const debugInfo = useMemo(() => {
//     const drivers =
//       driverData?.data?.driversWithStatus || driverData?.data || [];
//     return {
//       totalDrivers: drivers.length,
//       driversWithBookings: drivers.filter(
//         (d) => d.bookings && d.bookings.length > 0
//       ).length,
//       totalBookings: drivers.reduce(
//         (sum, d) => sum + (d.bookings?.length || 0),
//         0
//       ),
//     };
//   }, [driverData]);

//   return (
//     <div>
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-600">
//           <h3 className="text-lg font-semibold">Driver Booking Schedule</h3>
//           {debugInfo.totalDrivers} drivers | {debugInfo.driversWithBookings}{" "}
//           with bookings | {debugInfo.totalBookings} total bookings
//         </div>
//       </div>

//       {transformedData.length === 0 ? (
//         <div className="bg-gray-100 p-4 rounded-md text-center text-gray-600">
//           No booking data available to display
//         </div>
//       ) : (
//         <Table
//           columns={scheduleColumns}
//           dataSource={transformedData}
//           scroll={{ x: "max-content", y: 550 }}
//           size="middle"
//           pagination={false}
//           bordered
//         />
//       )}
//     </div>
//   );
// }

// export default DriverManagementSchedule;

import React, { useMemo, useState } from "react";
import { Calendar, Badge, Select, Spin } from "antd";
import dayjs from "dayjs";
import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";

const statusColour = (status = "") => {
  const s = status.toUpperCase();
  if (s === "COMPLETED")
    return {
      badge: "success",
      bg: "bg-green-400",
      txt: "text-black font-semibold",
    };
  if (s === "ON RIDE")
    return { badge: "processing", bg: "bg-[#ef621e]", txt: "text-white" };
  return { badge: "warning", bg: "bg-yellow-400", txt: "text-black" };
};

function DriverManagementSchedule() {
  /** ─────────────────── API ─────────────────── */
  const {
    data: driverData,
    isLoading,
    isError,
  } = useGetDriverQuery({ page: 1, limit: 50 });

  /** ────────────────── Driver list ────────────────── */
  const allDrivers = useMemo(
    () => driverData?.data?.driversWithStatus || driverData?.data || [],
    [driverData]
  );

  /** ─────────── Optional driver filter ─────────── */
  const [selectedDriver, setSelectedDriver] = useState(null);

  /** ─────── Map bookings → date string (“YYYY‑MM‑DD”) ─────── */
  const bookingsByDate = useMemo(() => {
    const map = {};
    allDrivers.forEach((driver) => {
      if (!driver.bookings || !Array.isArray(driver.bookings)) return;

      // Skip if a driver filter is active and this driver isn’t selected
      if (selectedDriver && driver.name !== selectedDriver) return;

      driver.bookings.forEach((bk) => {
        const key = dayjs(bk.pickupDate).format("YYYY-MM-DD");
        if (!map[key]) map[key] = [];

        map[key].push({
          driver: driver.name,
          vehicle: bk.vehicle?.name ?? "Unknown Vehicle",
          status: bk.status ?? "N/A",
        });
      });
    });
    return map;
  }, [allDrivers, selectedDriver]);

  /** ──────────────── Calendar cell renderers ──────────────── */
  const dateCellRender = (value /* dayjs */) => {
    const key = value.format("YYYY-MM-DD");
    const bookings = bookingsByDate[key] ?? [];

    return (
      <ul className="space-y-1">
        {bookings.map((b, idx) => {
          const { badge, bg, txt } = statusColour(b.status);
          return (
            <li key={idx}>
              <div className={`rounded-md px-1 ${bg} ${txt} flex items-center`}>
                <Badge status={badge} />
                <span className="ml-1">
                  {b.driver}: {b.vehicle} ({b.status})
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const monthCellRender = (value /* dayjs */) => {
    // simple monthly count
    const count = Object.entries(bookingsByDate).filter(([d]) =>
      value.isSame(d, "month")
    ).length;
    return count ? (
      <div className="notes-month">
        <section>{count}</section>
        <span className="text-xs text-gray-500">booked days</span>
      </div>
    ) : null;
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  /** ──────────────────── UI ──────────────────── */
  if (isLoading) return <Spin />;

  if (isError || !allDrivers.length)
    return (
      <div className="bg-gray-100 p-4 rounded-md text-center text-gray-600">
        No booking data available
      </div>
    );

  return (
    <div className="space-y-4  ">
      {/* Header / driver filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Driver Booking Calendar</h3>

        <Select
          allowClear
          showSearch
          placeholder="Filter by driver"
          optionFilterProp="label"
          value={selectedDriver}
          onChange={setSelectedDriver}
          options={allDrivers.map((d) => ({ label: d.name, value: d.name }))}
          style={{ minWidth: 180 }}
          size="small"
        />
      </div>

      {/* Calendar */}
      <div className="max-h-[20vh]">
        <Calendar cellRender={cellRender} />
      </div>
    </div>
  );
}

export default DriverManagementSchedule;
