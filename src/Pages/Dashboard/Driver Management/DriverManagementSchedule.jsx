import { Table } from "antd";
import React, { useMemo } from "react";

function DriverManagementSchedule({ driverData }) {
  // Transform data for schedule table
  const transformedData = useMemo(() => {
    if (!driverData?.data || !Array.isArray(driverData.data)) return [];

    const groupedByDate = {};

    driverData.data.forEach((driver) => {
      driver.bookings?.forEach((booking) => {
        const rawDate = new Date(booking.pickupDate);
        const pickupDate = rawDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        });

        if (!groupedByDate[pickupDate]) {
          groupedByDate[pickupDate] = {
            key: pickupDate,
            dateDriver: pickupDate,
            sortDate: rawDate.getTime(), // Add raw timestamp for sorting
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

  // Generate schedule columns
  const scheduleColumns = useMemo(() => {
    const base = [
      {
        title: "Date/Driver",
        dataIndex: "dateDriver",
        key: "dateDriver",
        fixed: "left",
        width: 130,
        defaultSortOrder: "ascend",
        sorter: (a, b) => a.sortDate - b.sortDate, // Sort by raw timestamp
      },
    ];

    if (!driverData?.data) return base;

    const driverColumns = driverData.data.map((driver) => ({
      title: driver.name,
      dataIndex: driver.name,
      key: driver._id,
      width: 150,
      render: (text) => (
        <p className="bg-yellow-500 text-black px-2 py-1 rounded-md">
          {text || "Not Assigned"}
        </p>
      ),
    }));

    return [...base, ...driverColumns];
  }, [driverData?.data]);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Driver Booking Schedule</h3>
      </div>
      <Table
        columns={scheduleColumns}
        dataSource={transformedData}
        scroll={{ x: "max-content", y: 550 }}
        pagination={{ pageSize: 1 }}
        size="middle"
      />
    </div>
  );
}

export default DriverManagementSchedule;
