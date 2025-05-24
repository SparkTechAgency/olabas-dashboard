import React, { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import CustomerServiceChart from "./TotalUserChart";
import RevenueAnalysis from "./RevenueAnalysis";
import TinyChart from "./TinyChart";
import TotalUserChart from "./TotalUserChart";
dayjs.extend(customParseFormat);

const stats = [
  {
    label: "Total Reservations",
    value: "3765",
    percent: +2.6,
    color: "#00a76f",
    icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
  },
  {
    label: "Active Users",
    value: "3765",
    percent: +2.6,
    color: "#00b8d9",
    icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
  },
  {
    label: "Total Revenue",
    value: "3765",
    percent: +2.6,
    color: "#18a0fb",
    icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
  },
];

export const Card = ({ item }) => {
  return (
    <div
      className={`flex flex-col w-full items-start justify-center h-32 rounded-lg border bg-white p-12 ${item.bg}`}
    >
      <p className="text-sm text-gray-500">{item.label}</p>
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-3xl font-bold">{item.value}</p>
        <div className="h-10 flex items-center justify-end w-16">
          <TinyChart color={item.color} />
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="">
      <div className="flex flex-col flex-wrap items-end gap-5 justify-between w-full bg-transparent rounded-md">
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-10 w-full">
          {stats.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="w-full h-[330px] border  bg-white rounded-lg mt-4 relative flex flex-col justify-evenly">
        <TotalUserChart />
      </div>
      <div className="w-full h-[330px] border mt-4 flex items-center justify-between bg-transparent rounded-lg">
        <RevenueAnalysis />
      </div>
    </div>
  );
};

export default Home;
