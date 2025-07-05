import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import PickDate from "../../../components/common/PickDate";
import { useTotalRevenueChartQuery } from "../../../redux/apiSlices/homeApi";

export default function RevenueAnalysis() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isDateSelected, setIsDateSelected] = useState(false);

  const {
    data: revenueData,
    isLoading,
    isError,
  } = useTotalRevenueChartQuery(year);
  console.log("Revenue Data:", revenueData);

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

    if (!revenueData?.revenueAnalyticsByMonth) {
      return [];
    }

    return monthMapping.map(({ name, key }) => {
      const monthData = revenueData.revenueAnalyticsByMonth[key] || 0;
      return {
        name: name,
        pv: monthData,
        amt: monthData,
      };
    });
  }, [revenueData]);

  console.log("Chart Data:", chartData); // Add this to debug

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setIsDateSelected(!!date); // Update state based on date selection
  };

  return (
    <div className="w-full h-full rounded-lg bg-white">
      <div className="flex items-center justify-between px-6 my-5 relative">
        <h1 className="text-2xl font-semibold">Revenue Analytics</h1>

        <PickDate setYear={setYear} />
      </div>

      <ResponsiveContainer width="100%" height={255}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#04BF61" stopOpacity={1} />
              <stop offset="100%" stopColor="#04BF61" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="none"
            strokeWidth={0.2}
            vertical={false}
          />
          <XAxis dataKey="name" style={{ fontSize: "14px" }} />
          <YAxis hide={false} style={{ fontSize: "14px" }} />
          <Tooltip
            content={<CustomTooltip />}
            isAnimationActive={true}
            cursor={false}
          />

          <Area
            type="monotone"
            dataKey="pv"
            stroke=""
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative flex items-center ml-4">
        {/* Arrow (pointing left) */}
        <div className="absolute w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white -left-1.5"></div>

        {/* Tooltip Content */}
        <div className="bg-white p-2 text-black text-[14px] rounded shadow-md ">
          {payload.map((pld, index) => (
            <div key={index}>
              Total Revenue:{" ₦ "}
              <span className="text-smart font-bold">{pld.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
