import { ConfigProvider } from "antd";
import React from "react";

function AntdConfig({ children }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemHoverBg: "#3b55ff",
            itemHoverColor: "white",
            trackBg: "#04bf61",
            itemColor: "white",
            itemSelectedColor: "black",
            fontSize: 14,
          },
          Button: {
            defaultActiveColor: "#ffffff",
            defaultActiveBorderColor: "#04bf61",
            defaultActiveBg: "#04bf61",
            defaultHoverBg: "#04BF61CC",
            defaultHoverBorderColor: "#04bf61",
            defaultHoverColor: "#ffffff",
          },
          Table: {
            rowSelectedBg: "#f6f6f6",
            headerBg: "#f6f6f6",
            headerSplitColor: "none",
            headerBorderRadius: "none",
            cellFontSize: "16px",
          },
          // Pagination: {
          //   borderRadius: "3px",
          //   itemActiveBg: "#18a0fb",
          // },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default AntdConfig;
