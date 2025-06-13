import { useMemo, useState } from "react";
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
import { useTotalUserChartQuery } from "../../../redux/apiSlices/homeApi";

function TotalUserChart() {
  // Use state to manage the year, initialize with current year
  const [year, setYear] = useState(new Date().getFullYear());

  const {
    data: totalUserData,
    isLoading,
    isError,
  } = useTotalUserChartQuery(year);

  console.log("Total User Data:", totalUserData);
  console.log("Selected Year:", year);

  // Convert your data to the format needed by the chart
  const chartData = useMemo(() => {
    const monthMapping = [
      { name: "Jan", key: "jan" },
      { name: "Feb", key: "feb" },
      { name: "Mar", key: "mar" },
      { name: "Apr", key: "apr" },
      { name: "May", key: "may" },
      { name: "Jun", key: "jun" },
      { name: "Jul", key: "jul" },
      { name: "Aug", key: "aug" },
      { name: "Sep", key: "sep" },
      { name: "Oct", key: "oct" },
      { name: "Nov", key: "nov" },
      { name: "Dec", key: "dec" },
    ];

    if (!totalUserData?.totalBookingsByMonth) {
      return [];
    }

    return monthMapping.map(({ name, key }) => {
      const monthData = totalUserData.totalBookingsByMonth[key] || 0;
      return {
        month: name,
        Customer: monthData,
      };
    });
  }, [totalUserData]);

  console.log("Chart Data:", chartData); // Add this to debug

  return (
    <>
      <div className="flex items-center justify-between px-6 mt-5 relative">
        <h1 className="text-2xl font-semibold">Total User Chart</h1>
        <PickDate setYear={setYear} />
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
