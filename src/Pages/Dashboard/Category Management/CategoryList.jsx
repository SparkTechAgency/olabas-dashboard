import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Tree } from "antd";

const treeData = [
  {
    title: "Category 1",
    key: "cat-1",
    children: [
      {
        title: "Sub Category 1.1",
        key: "cat-1-sub-1",
      },
      {
        title: "Sub Category 1.2",
        key: "cat-1-sub-2",
      },
      {
        title: "Sub Category 1.3",
        key: "cat-1-sub-3",
      },
      {
        title: "Sub Category 1.4",
        key: "cat-1-sub-4",
      },
    ],
  },
  {
    title: "Category 2",
    key: "cat-2",
    children: [
      {
        title: "Sub Category 2.1",
        key: "cat-2-sub-1",
      },
      {
        title: "Sub Category 2.2",
        key: "cat-2-sub-2",
      },
      {
        title: "Sub Category 2.3",
        key: "cat-2-sub-3",
      },
      {
        title: "Sub Category 2.4",
        key: "cat-2-sub-4",
      },
    ],
  },
];

function CategoryList() {
  const onSelect = (selectedKeys, info) => {
    console.log("Selected keys:", selectedKeys);
    console.log("Selected node info:", info);
  };

  return (
    <div className="w-1/2 ">
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={["cat-1"]}
        onSelect={onSelect}
        treeData={treeData}
        className="p-4"
      />
    </div>
  );
}

export default CategoryList;
