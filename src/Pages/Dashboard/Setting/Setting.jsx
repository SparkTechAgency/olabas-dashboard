import React, { useState } from "react";
import { ConfigProvider, Segmented } from "antd";
import AdminList from "./AdminList";
import AdminPassword from "./AdminPassword";
import Profile from "./Profile";
import { AnimatePresence, motion } from "framer-motion";

function Setting() {
  const [selected, setSelected] = useState("Admin");

  const handleSegmentChange = (value) => {
    setSelected(value);
    console.log(value);
  };

  const renderContent = () => {
    switch (selected) {
      case "Admin":
        return <AdminList />;
      case "Password":
        return <AdminPassword />;
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  };

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
            options={["Admin", "Password", "Profile"]}
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
