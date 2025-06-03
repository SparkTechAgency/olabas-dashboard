// import {
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";

// const PieChartAnalytics = ({ overViewData }) => {
//   console.log("Fleet management:", overViewData?.fleetOverview);
//   const data = [
//     { name: "Available", value: 8 },
//     { name: "Rented", value: 4 },
//     { name: "Under Maintenance", value: 5 },
//   ];

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
//           <Tooltip />
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

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo } from "react";

const PieChartAnalytics = ({ overViewData }) => {
  console.log("Fleet management:", overViewData?.fleetOverview);

  // Use actual data from overViewData
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

  const COLORS = ["#00C49F", "#F25C66", "#3F4B63"]; // Green, Red, Navy

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold my-3 -mt-1 text-[#0A1F44]">
        Fleet Overview
      </h1>

      <ResponsiveContainer
        width={200}
        height={180}
        className="p-0 flex items-start -mt-3"
      >
        <RechartsPieChart>
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
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>

      <CustomLegend data={data} colors={COLORS} />
    </div>
  );
};

export default PieChartAnalytics;

// ✅ Custom Legend Component
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
