import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function TinyChart(props) {
  function getRandomPv() {
    return Math.floor(Math.random() * (10000 - 2000) + 2000);
  }

  const data = generateRandomData();
  function generateRandomData() {
    return [
      { name: "Jan", pv: getRandomPv(), amt: 2400 },
      { name: "Feb", pv: getRandomPv(), amt: 2210 },
      { name: "Mar", pv: getRandomPv(), amt: 2290 },
      { name: "Apr", pv: getRandomPv(), amt: 2000 },
      { name: "May", pv: getRandomPv(), amt: 2181 },
      { name: "Jun", pv: getRandomPv(), amt: 2500 },
      { name: "Jul", pv: getRandomPv(), amt: 2100 },
      { name: "Aug", pv: getRandomPv(), amt: 2600 },
    ];
  }

  return (
    <div className="w-40 h-10 flex items-center justify-end ">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, left: 20, bottom: 5 }}>
          <Bar dataKey="pv" fill={`${props.color}`} barSize={35} radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TinyChart;
