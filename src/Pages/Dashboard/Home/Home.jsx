import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import RevenueAnalysis from "./RevenueAnalysis";
import TinyChart from "./TinyChart";
import TotalUserChart from "./TotalUserChart";
import PieChartAnalytics from "./PieChart";
import { useDashboardQuery } from "../../../redux/apiSlices/homeApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
dayjs.extend(customParseFormat);

export const Card = ({ item }) => {
  return (
    <Link to={item.links} className="w-full">
      <div
        className={`flex flex-col w-full items-start justify-center h-32 rounded-lg border bg-white p-12 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${item.bg}`}
      >
        <p className="text-sm text-gray-500">{item.label}</p>
        <div className="w-full flex items-center justify-between mt-2">
          <p className="text-3xl font-bold">{item.value}</p>
          <div className="h-10 flex items-center justify-end w-16">
            <TinyChart color={item.color} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const { data: overViewData, isLoading, isError } = useDashboardQuery();

  console.log("dashboard", overViewData);

  const [cardData, setCardData] = useState({
    totalRevenue: 0,
    totalReservations: 0,
    activeCars: 0,
  });

  useEffect(() => {
    if (overViewData !== undefined) {
      setCardData({
        totalRevenue: overViewData.totalRevenue,
        totalReservations: overViewData.totalReservations,
        activeCars: overViewData.activeCars,
      });
    }
  }, [overViewData]);

  const stats = [
    {
      label: "Total Reservations",
      value: cardData.totalReservations,
      percent: +2.6,
      color: "#00a76f",
      links: "/reservation",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
    {
      label: "Active Cars",
      value: cardData.activeCars,
      percent: +2.6,
      color: "#00b8d9",
      links: "/fleet-management",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
    {
      label: "Total Revenue",
      value: cardData.totalRevenue,
      percent: +2.6,
      color: "#18a0fb",
      links: "/transaction",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
  ];
  return (
    <div className="">
      {/* Stat Cards */}
      <div className="flex flex-col flex-wrap items-end gap-5 justify-between w-full bg-transparent rounded-md">
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-10 w-full">
          {stats.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>

      {/* Bar + Pie Side by Side */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Bar Chart */}
        <div className="w-full lg:w-[85%] h-[330px] border bg-white rounded-lg flex flex-col justify-evenly">
          <TotalUserChart overViewData={overViewData} setYear={setYear} />
        </div>

        {/* Pie Chart */}
        <div className="w-full lg:w-[15%] h-[330px] border bg-white rounded-lg flex flex-col justify-evenly">
          <PieChartAnalytics overViewData={overViewData} />
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="w-full h-[340px] border mt-4 flex items-center justify-between bg-transparent rounded-lg">
        <RevenueAnalysis overViewData={overViewData} setYear={setYear} />
      </div>
    </div>
  );
};

export default Home;
