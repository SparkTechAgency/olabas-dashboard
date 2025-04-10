import React, { useState } from "react";
import { ConfigProvider, Segmented } from "antd";
import AdminList from "./AdminList";
import AdminPassword from "./AdminPassword";
import Profile from "./Profile";

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
            itemHoverBg: "#3b55ff",
            itemHoverColor: "white",
            trackBg: "#0100fa",
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
            className="mb-6 border border-[#0100fa]"
          />
        </div>
        {renderContent()}
      </div>
    </ConfigProvider>
  );
}

export default Setting;
