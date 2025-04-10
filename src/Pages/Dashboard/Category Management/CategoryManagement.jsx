import React, { useState } from "react";
import { ConfigProvider, Segmented } from "antd";
import CategorySubcategoryForm from "./CategorySubcategoryForm";
import CategoryList from "./CategoryList";
import EditCatSub from "./EditCatSub";
import DeleteCatSub from "./DeleteCatSub";

function CategoryManagement() {
  // Default selected value is set to "Quick View"
  const [selected, setSelected] = useState("Quick View");

  const handleSelected = (value) => {
    setSelected(value);
    console.log(value);
  };

  const ControlView = () => {
    switch (selected) {
      case "Quick View":
        return <CategoryList />;
      case "Add New":
        return <CategorySubcategoryForm />;
      case "Edit":
        return <EditCatSub isSelected={selected} />;
      case "Delete":
        return <DeleteCatSub isSelected={selected} />;
      default:
        return <div>Default</div>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center ">
      <Segmented
        options={["Quick View", "Add New", "Edit", "Delete"]}
        block
        className="border border-smart mb-4 w-1/2"
        onChange={handleSelected}
        value={selected}
      />
      <ControlView />
    </div>
  );
}

export default CategoryManagement;
