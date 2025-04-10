import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  message,
  ConfigProvider,
  Segmented,
} from "antd";
import { MdInfo } from "react-icons/md";
import { useDeleteCategoryMutation } from "../../../redux/apiSlices/categoryApi";
import { useDeleteSubCategoryMutation } from "../../../redux/apiSlices/subCategoryApi";

const DeleteCatSub = ({ isSelected, initialData = null }) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = useState("Category");

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const categoryOptions = [
    { value: "cat1", label: "Category 1" },
    { value: "cat2", label: "Category 2" },
    { value: "cat3", label: "Category 3" },
  ];

  const subCategoryOptions = [
    { value: "subCat1", label: "Sub Category 1" },
    { value: "subCat2", label: "Sub Category 2" },
    { value: "subCat3", label: "Sub Category 3" },
  ];

  const handleSelected = (value) => {
    setSelected(value);
  };

  const onFinish = async (values) => {
    try {
      if (selected === "Category") {
        const id = values.category;
        await deleteCategory(id).unwrap();
        message.success("Category deleted successfully!");
      } else {
        const id = values.subCategory;
        await deleteSubCategory(id).unwrap();
        message.success("Subcategory deleted successfully!");
      }
      form.resetFields();
    } catch (error) {
      message.error("Something went wrong during deletion!");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Segmented
        options={["Category", "Sub Category"]}
        block
        vertical
        className="border border-smart mb-4 w-1/2"
        onChange={handleSelected}
        value={selected}
      />
      <div className="w-1/2 flex gap-4">
        <div className="w-full mt-4">
          <Form
            form={form}
            name="deleteCategoryForm"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="bg-white p-4 border rounded-lg"
          >
            <Form.Item
              label="Select Category"
              name="category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select placeholder="Select Category" options={categoryOptions} />
            </Form.Item>

            {selected === "Sub Category" && (
              <>
                <Form.Item
                  label="Select Sub Category"
                  name="subCategory"
                  rules={[
                    { required: true, message: "Please select a subcategory!" },
                  ]}
                >
                  <Select
                    placeholder="Select Sub Category"
                    options={subCategoryOptions}
                  />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" danger htmlType="submit">
                Delete {selected}
              </Button>
            </Form.Item>
          </Form>
          {selected !== "Sub Category" ? (
            <div className="flex items-center gap-2 mt-4">
              <MdInfo size={25} className="text-yellow-500" />
              <p>
                If you delete a Category all the sub category under the category
                will be deleted
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DeleteCatSub;
