// import {
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";
// import { useMemo } from "react";

// const PieChartAnalytics = ({ overViewData }) => {
//   console.log("Fleet management:", overViewData?.fleetOverview);

//   // Use actual data from overViewData
//   const data = useMemo(() => {
//     if (!overViewData?.fleetOverview) {
//       return [
//         { name: "Available", value: 0 },
//         { name: "Rented", value: 0 },
//         { name: "Under Maintenance", value: 0 },
//       ];
//     }

//     const fleetData = overViewData.fleetOverview;
//     return [
//       { name: "Available", value: fleetData.available || 0 },
//       { name: "Rented", value: fleetData.rented || 0 },
//       { name: "Under Maintenance", value: fleetData.maintenance || 0 },
//     ];
//   }, [overViewData]);

//   const COLORS = ["#00C49F", "#F25C66", "#3F4B63"]; // Green, Red, Navy

//   return (
//     <div className="flex flex-col items-center justify-center px-6">
//       <h1 className="text-2xl font-semibold my-3 -mt-1 text-[#0A1F44]">
//         Fleet Overview
//       </h1>

//       <ResponsiveContainer
//         width={200}
//         height={180}
//         className="p-0 flex items-start -mt-3"
//       >
//         <RechartsPieChart>
//           <Pie
//             data={data}
//             cx="40%"
//             cy="50%"
//             innerRadius={50}
//             outerRadius={80}
//             dataKey="value"
//             labelLine={false}
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Pie>
//           <Tooltip content={<FuturisticTooltip />} />
//         </RechartsPieChart>
//       </ResponsiveContainer>

//       <CustomLegend data={data} colors={COLORS} />
//     </div>
//   );
// };

// export default PieChartAnalytics;

// // ✅ Custom Legend Component
// const CustomLegend = ({ data, colors }) => {
//   return (
//     <div className="mt-1 flex flex-col gap-1">
//       {data.map((item, index) => (
//         <div
//           key={index}
//           className="flex items-center gap-2 text-sm text-[#0A1F44] font-medium"
//         >
//           <span
//             className="w-3 h-3 rounded-full inline-block"
//             style={{ backgroundColor: colors[index % colors.length] }}
//           ></span>
//           <span>
//             {item.name} - {item.value.toString().padStart(2, "0")}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const FuturisticTooltip = ({ active, payload }) => {
//   if (!active || !payload || !payload.length) return null;

//   const data = payload[0].payload;
//   const color = payload[0].color;

//   return (
//     <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-2xl">
//       <div className="flex items-center gap-2 mb-1">
//         <div
//           className="w-3 h-3 rounded-full"
//           style={{ backgroundColor: color }}
//         />
//         <span className="text-sm font-medium text-white">{data.name}</span>
//       </div>
//       <div className="text-lg font-bold text-white">
//         {data.value}
//         <span className="ml-1 text-xs font-normal text-gray-300">vehicles</span>
//       </div>
//       <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900 border-opacity-80"></div>
//     </div>
//   );
// };

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo, useState } from "react";

const PieChartAnalytics = ({ overViewData }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (e && e.activeCoordinate) {
      setMousePosition({
        x: e.activeCoordinate.x,
        y: e.activeCoordinate.y,
      });
    }
  };

  const data = useMemo(() => {
    if (!overViewData?.fleetOverview) {
      return [
        { name: "Available", value: 0 },
        { name: "Rented", value: 0 },
        { name: "Under Maintenance", value: 0 },
      ];
    }

    const fleetData = overViewData.fleetOverview;
    return [
      { name: "Available", value: fleetData.available || 0 },
      { name: "Rented", value: fleetData.rented || 0 },
      { name: "Under Maintenance", value: fleetData.maintenance || 0 },
    ];
  }, [overViewData]);

  const COLORS = ["#00C49F", "#F25C66", "#3F4B63"];

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold my-3 -mt-1 text-[#0A1F44]">
        Fleet Overview
      </h1>

      <ResponsiveContainer
        width={200}
        height={180}
        className="p-0 flex items-start -mt-3 relative"
      >
        <RechartsPieChart onMouseMove={handleMouseMove}>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={<FuturisticTooltip mousePosition={mousePosition} />}
            position={{ x: mousePosition.x, y: mousePosition.y }}
          />

          {/* <Tooltip /> */}
        </RechartsPieChart>
      </ResponsiveContainer>

      <CustomLegend data={data} colors={COLORS} />
    </div>
  );
};

const CustomLegend = ({ data, colors }) => {
  return (
    <div className="mt-1 flex flex-col gap-1">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-sm text-[#0A1F44] font-medium"
        >
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: colors[index % colors.length] }}
          ></span>
          <span>
            {item.name} - {item.value.toString().padStart(2, "0")}
          </span>
        </div>
      ))}
    </div>
  );
};

const FuturisticTooltip = ({ active, payload, mousePosition }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const color = payload[0].color;

  return (
    <div
      className="bg-gray-900 bg-opacity-80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-2xl absolute pointer-events-none"
      style={{
        left: mousePosition.x + 20,
        top: mousePosition.y - 50,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-medium text-white">{data.name}</span>
      </div>
      <div className="text-lg font-bold text-white">
        {data.value}
        <span className="ml-1 text-xs font-normal text-gray-300">vehicles</span>
      </div>
    </div>
  );
};

export default PieChartAnalytics;
