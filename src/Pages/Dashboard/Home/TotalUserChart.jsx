import { useMemo } from "react";
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

function TotalUserChart({ overViewData }) {
  // console.log("totalUser", overViewData?.totalBookingsByMonth);

  // Convert your data to the format needed by the chart
  const chartData = useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (!overViewData?.totalBookingsByMonth) {
      return [];
    }

    return monthNames.map((month, index) => {
      const monthKey = Object.keys(overViewData.totalBookingsByMonth)[index];
      const monthData = overViewData.totalBookingsByMonth[monthKey] || 0;

      return {
        month,
        Customer: monthData,
      };
    });
  }, [overViewData]);

  return (
    <>
      <div className="flex items-center justify-between px-6 mt-5 relative">
        <h1 className="text-2xl font-semibold">Total User Chart</h1>
        <PickDate />
      </div>

      <div className="w-full h-full py-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
            <Bar dataKey="Customer" fill="#03bf5f" barSize={35} radius={4} />
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
        {payload.map((pld, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: "#03bf5f" }}
            ></span>
            <span className="text-gray-800">Total Users: {pld.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
