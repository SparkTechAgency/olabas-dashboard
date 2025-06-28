import { Select, Table } from "antd";
import React, { useMemo } from "react";
import { useGetDriverQuery } from "../../../redux/apiSlices/driverManagementApi";

function DriverManagementSchedule() {
  const {
    data: driverData,
    isLoading,
    isError,
  } = useGetDriverQuery({ page: 1, limit: 50 });
  console.log("Schedule", driverData?.data?.driversWithStatus);

  // Transform data for schedule table
  const transformedData = useMemo(() => {
    // Check if we have the correct data structure
    const drivers =
      driverData?.data?.driversWithStatus || driverData?.data || [];

    if (!Array.isArray(drivers) || drivers.length === 0) {
      return [];
    }

    const groupedByDate = {};

    drivers.forEach((driver) => {
      // Check if driver has bookings
      if (!driver.bookings || !Array.isArray(driver.bookings)) {
        return;
      }

      driver.bookings.forEach((booking) => {
        const rawDate = new Date(booking.pickupDate);
        const pickupDate = rawDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        });

        // Initialize date group if it doesn't exist
        if (!groupedByDate[pickupDate]) {
          groupedByDate[pickupDate] = {
            key: pickupDate,
            dateDriver: pickupDate,
            sortDate: rawDate.getTime(),
          };
        }

        // Get vehicle name and status from booking
        const vehicleName = booking.vehicle?.name || "Unknown Vehicle";
        const status = booking.status || "N/A";
        const bookingInfo = `${vehicleName}|${status}`; // Use | as separator to preserve status

        // Add or append vehicle info for this driver on this date
        if (groupedByDate[pickupDate][driver.name]) {
          groupedByDate[pickupDate][driver.name] += `, ${bookingInfo}`;
        } else {
          groupedByDate[pickupDate][driver.name] = bookingInfo;
        }
      });
    });

    // Sort by date
    return Object.values(groupedByDate).sort((a, b) => a.sortDate - b.sortDate);
  }, [driverData]);

  // Generate schedule columns
  const scheduleColumns = useMemo(() => {
    const base = [
      {
        title: "Date/Driver",
        dataIndex: "dateDriver",
        key: "dateDriver",
        fixed: "left",
        width: 130,
        render: (text) => <strong className="text-blue-600">{text}</strong>,
      },
    ];

    // Get drivers from the correct data structure
    const drivers =
      driverData?.data?.driversWithStatus || driverData?.data || [];

    if (!Array.isArray(drivers) || drivers.length === 0) {
      return base;
    }

    const driverColumns = drivers.map((driver) => ({
      title: driver.name || "Unknown Driver",
      dataIndex: driver.name || "unknown",
      key: driver._id || driver.id || driver.name,
      width: 200,
      render: (text) => {
        if (!text) {
          return (
            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-sm">
              No Bookings
            </span>
          );
        }

        // Split multiple bookings and render each one
        const bookings = text.split(", ");
        return (
          <div className="space-y-1">
            {bookings.map((booking, index) => {
              const [vehicleName, status] = booking.split("|");
              const statusUpper = status?.toUpperCase();
              const isCompleted = statusUpper === "COMPLETED";
              const isOnRide = statusUpper === "ON RIDE";

              let bgColor, textColor;
              if (isCompleted) {
                bgColor = "bg-green-400";
                textColor = "text-black font-semibold";
              } else if (isOnRide) {
                bgColor = "bg-[#ef621e]";
                textColor = "text-white";
              } else {
                bgColor = "bg-yellow-500";
                textColor = "text-black";
              }

              return (
                <div
                  key={index}
                  className={`${bgColor} ${textColor} px-2 py-1 rounded-md text-xs`}
                >
                  {vehicleName} ({status})
                </div>
              );
            })}
          </div>
        );
      },
    }));

    return [...base, ...driverColumns];
  }, [driverData]);

  // Debug information
  const debugInfo = useMemo(() => {
    const drivers =
      driverData?.data?.driversWithStatus || driverData?.data || [];
    return {
      totalDrivers: drivers.length,
      driversWithBookings: drivers.filter(
        (d) => d.bookings && d.bookings.length > 0
      ).length,
      totalBookings: drivers.reduce(
        (sum, d) => sum + (d.bookings?.length || 0),
        0
      ),
    };
  }, [driverData]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <h3 className="text-lg font-semibold">Driver Booking Schedule</h3>
          {debugInfo.totalDrivers} drivers | {debugInfo.driversWithBookings}{" "}
          with bookings | {debugInfo.totalBookings} total bookings
        </div>
        {/* <Select className="w-32" placeholder="--Month--">
          <Option value="jan">January</Option>
          <Option value="feb">February</Option>
          <Option value="mar">March</Option>
          <Option value="apr">April</Option>
          <Option value="may">May</Option>
          <Option value="jun">June</Option>
          <Option value="jul">July</Option>
          <Option value="aug">August</Option>
          <Option value="sep">September</Option>
          <Option value="oct">October</Option>
          <Option value="nov">November</Option>
          <Option value="dec">December</Option>
        </Select> */}
      </div>

      {transformedData.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-md text-center text-gray-600">
          No booking data available to display
        </div>
      ) : (
        <Table
          columns={scheduleColumns}
          dataSource={transformedData}
          scroll={{ x: "max-content", y: 550 }}
          size="middle"
          pagination={false}
          bordered
        />
      )}
    </div>
  );
}

export default DriverManagementSchedule;
