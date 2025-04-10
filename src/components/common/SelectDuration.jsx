import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Select, Space } from "antd";
function SelectDuration() {
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div>
      <Select
        defaultValue="Today"
        style={{ width: 120, height: 40 }}
        onChange={handleChange}
        options={[
          { value: "Today", label: "Today" },
          { value: "This Week", label: "This Week" },
          { value: "This Month", label: "This Month" },
          { value: "Last Thirty Days", label: "Last 30 Days" },
        ]}
      />
    </div>
  );
}

export default SelectDuration;
