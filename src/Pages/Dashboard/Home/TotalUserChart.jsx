import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PickDate from "../../../components/common/PickDate";

function TotalUserChart() {
  const [visibleBars, setVisibleBars] = useState({
    Customer: true,
    Revenue: true,
  });

  const data = [
    { month: "Jan", Customer: 4000, Revenue: 2400 },
    { month: "Feb", Customer: 3000, Revenue: 1398 },
    { month: "Mar", Customer: 2000, Revenue: 9800 },
    { month: "Apr", Customer: 2780, Revenue: 3908 },
    { month: "May", Customer: 1890, Revenue: 4800 },
    { month: "Jun", Customer: 2390, Revenue: 3800 },
    { month: "Jul", Customer: 3490, Revenue: 4300 },
    { month: "Aug", Customer: 2000, Revenue: 9800 },
    { month: "Sep", Customer: 2780, Revenue: 3908 },
    { month: "Oct", Customer: 1890, Revenue: 4800 },
    { month: "Nov", Customer: 2390, Revenue: 3800 },
    { month: "Dec", Customer: 3490, Revenue: 4300 },
  ];

  const handleLegendClick = (dataKey) => {
    setVisibleBars({
      ...visibleBars,
      [dataKey]: !visibleBars[dataKey],
    });
  };

  const CustomLegend = () => {
    return (
      <div className="flex items-center justify-center gap-8 absolute top-1 right-[40%]">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            setVisibleBars((prev) => ({
              ...prev,
              Customer: !prev.Customer,
            }))
          }
        >
          <span
            className="inline-block w-4 h-4 mr-2 rounded-full"
            style={{
              backgroundColor: visibleBars.Customer ? "#0100fa" : "#e5e7eb",
            }}
          ></span>
          <span>User</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            setVisibleBars((prev) => ({
              ...prev,
              Revenue: !prev.Revenue,
            }))
          }
        >
          <span
            className="inline-block w-4 h-4 mr-2 rounded-full"
            style={{
              backgroundColor: visibleBars.Revenue ? "#bbbbfa" : "#e5e7eb",
            }}
          ></span>
          <span>Revenue</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 mt-5 relative">
        <h1 className="text-2xl font-semibold">Total User Chart</h1>
        {/* <CustomLegend /> */}
        <PickDate />
      </div>

      <div className="w-full h-full py-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="none"
              strokeWidth={0.2}
              vertical={false}
            />
            <XAxis dataKey="month" style={{ fontSize: "14px" }} />
            <YAxis hide={false} style={{ fontSize: "14px" }} />
            <Tooltip
              content={<CustomTooltip />}
              isAnimationActive={true}
              cursor={false}
            />
            {/* {visibleBars.Customer && (
              <Bar dataKey="Customer" fill="#0100fa" barSize={35} radius={4} />
            )} */}
            {visibleBars.Revenue && (
              <Bar dataKey="Revenue" fill="#04BF61" barSize={35} radius={4} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default TotalUserChart;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative flex flex-col gap-1 p-2 bg-white border border-gray-200 rounded shadow-md text-sm">
        <div className="font-semibold text-gray-700 mb-1">Month: {label}</div>
        {payload.map((pld, index) => {
          const isCustomer = pld.dataKey === "Customer";
          const color = isCustomer ? "#0100fa" : "#bbbbfa";
          const labelText = isCustomer ? "Total Users" : "Total Revenue";

          return (
            <div key={index} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              <span className="text-gray-800">
                {labelText}: {pld.value}K
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
