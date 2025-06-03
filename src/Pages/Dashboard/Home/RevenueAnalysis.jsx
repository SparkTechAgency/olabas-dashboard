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

export default function RevenueAnalysis({ overViewData }) {
  // console.log("Revenue Analytics Data:", overViewData?.revenueAnalyticsByMonth);

  const [isDateSelected, setIsDateSelected] = useState(false);

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

    if (!overViewData?.revenueAnalyticsByMonth) {
      return [];
    }

    return monthNames.map((month, index) => {
      const monthKey = Object.keys(overViewData.revenueAnalyticsByMonth)[index];
      const monthData = overViewData.revenueAnalyticsByMonth[monthKey] || 0;

      return {
        name: month,
        pv: monthData,
        amt: monthData,
      };
    });
  }, [overViewData]);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setIsDateSelected(!!date); // Update state based on date selection
  };

  return (
    <div className="w-full h-full rounded-lg bg-white">
      <div className="flex items-center justify-between px-6 my-5 relative">
        <h1 className="text-2xl font-semibold">Revenue Analytics</h1>

        <PickDate />
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
              Total Revenue:{" $"}
              <span className="text-smart font-bold">{pld.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
