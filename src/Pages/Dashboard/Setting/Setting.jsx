// import React, { useState, useEffect } from "react";
// import { ConfigProvider, Segmented } from "antd";
// import AdminList from "./AdminList";
// import AdminPassword from "./AdminPassword";
// import Profile from "./Profile";
// import { AnimatePresence, motion } from "framer-motion";
// import { useSelector } from "react-redux";
// import ManagerList from "./ManagerList";

// function Setting() {
//   const profile = useSelector((state) => state.profile);
//   const [selected, setSelected] = useState("");

//   console.log("Profile Data:", profile?.role);

//   const optionMaker = () => {
//     const options = [];
//     if (profile?.role === "SUPER ADMIN") {
//       options.push("Admin", "Manager");
//     }
//     options.push("Password", "Profile");
//     return options;
//   };

//   // Set initial selected value based on available options
//   useEffect(() => {
//     const availableOptions = optionMaker();
//     if (availableOptions.length > 0 && !selected) {
//       setSelected(availableOptions[0]);
//     } else if (selected === "Admin" && profile?.role !== "SUPER ADMIN") {
//       // If user was on Admin tab but role changed, switch to first available option
//       setSelected(availableOptions[0]);
//     }
//   }, [profile?.role, selected]);

//   const handleSegmentChange = (value) => {
//     setSelected(value);
//     console.log(value);
//   };

//   const renderContent = () => {
//     switch (selected) {
//       case "Admin":
//         // Strict check: Only render AdminList if user is SUPER ADMIN
//         return profile?.role === "SUPER ADMIN"
//           ? <AdminList /> && <ManagerList />
//           : null;
//       case "Manager":
//         // Render ManagerList for SUPER ADMIN
//         return profile?.role === "SUPER ADMIN" ? <ManagerList /> : null;
//       case "Password":
//         return <AdminPassword />;
//       case "Profile":
//         return <Profile />;
//       default:
//         return null;
//     }
//   };

//   const availableOptions = optionMaker();

//   // Don't render if no options available or profile not loaded
//   if (!profile || availableOptions.length === 0) {
//     return null;
//   }

//   return (
//     <ConfigProvider
//       theme={{
//         components: {
//           Segmented: {
//             itemHoverBg: "#000000",
//             itemHoverColor: "white",
//             trackBg: "#04bf61",
//             itemColor: "white",
//             itemSelectedColor: "black",
//             fontSize: 18,
//           },
//         },
//       }}
//     >
//       <div className="py-8 font-medium w-1/2">
//         <div className="w-full">
//           <Segmented
//             options={availableOptions}
//             value={selected}
//             onChange={handleSegmentChange}
//             block
//             className="mb-6 border border-[#04bf61]"
//           />
//         </div>

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={selected}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             {renderContent()}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </ConfigProvider>
//   );
// }

// export default Setting;

import React, { useState, useEffect } from "react";
import { ConfigProvider, Segmented } from "antd";
import AdminList from "./AdminList";
import AdminPassword from "./AdminPassword";
import Profile from "./Profile";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import ManagerList from "./ManagerList";

function Setting() {
  const profile = useSelector((state) => state.profile);
  const [selected, setSelected] = useState("");

  console.log("Profile Data:", profile?.role);

  const optionMaker = () => {
    const options = [];
    if (profile?.role === "SUPER ADMIN") {
      options.push("Admin", "Manager");
    }
    options.push("Password", "Profile");
    return options;
  };

  // Set initial selected value based on available options
  useEffect(() => {
    const availableOptions = optionMaker();
    if (availableOptions.length > 0 && !selected) {
      setSelected(availableOptions[0]);
    } else if (selected === "Admin" && profile?.role !== "SUPER ADMIN") {
      // If user was on Admin tab but role changed, switch to first available option
      setSelected(availableOptions[0]);
    }
  }, [profile?.role, selected]);

  const handleSegmentChange = (value) => {
    setSelected(value);
    console.log(value);
  };

  const renderContent = () => {
    switch (selected) {
      case "Admin":
        // Strict check: Only render AdminList if user is SUPER ADMIN
        return profile?.role === "SUPER ADMIN" ? <AdminList /> : null;
      case "Manager":
        // Render ManagerList for SUPER ADMIN
        return profile?.role === "SUPER ADMIN" ? <ManagerList /> : null;
      case "Password":
        return <AdminPassword />;
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  };

  const availableOptions = optionMaker();

  // Don't render if no options available or profile not loaded
  if (!profile || availableOptions.length === 0) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemHoverBg: "#000000",
            itemHoverColor: "white",
            trackBg: "#04bf61",
            itemColor: "white",
            itemSelectedColor: "black",
            fontSize: 18,
          },
        },
      }}
    >
      <div className="py-8 font-medium w-1/2">
        <div className="w-full">
          <Segmented
            options={availableOptions}
            value={selected}
            onChange={handleSegmentChange}
            block
            className="mb-6 border border-[#04bf61]"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ConfigProvider>
  );
}

export default Setting;
