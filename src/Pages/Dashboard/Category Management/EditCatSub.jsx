import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Select,
  message,
  ConfigProvider,
  Segmented,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const beforeUpload = (file) => {
  const isImage =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  if (!isImage) {
    message.error("Only JPG/PNG/JPEG files are allowed!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }
  return isImage && isLt2M;
};

const EditCatSub = ({ isSelected, initialData = null }) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);

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

  // Handle image file changes
  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImageFile(fileList[0].originFileObj);
    } else {
      setImageFile(null);
    }
  };

  const onFinish = async (values) => {
    try {
      const categoryData = {
        name:
          isSelected === "Category"
            ? values.categoryName
            : values.subCategoryName,
        description:
          isSelected === "Category"
            ? values.categoryDesc
            : values.subCategoryDesc,
        image: imageFile ? imageFile.name : "",
      };

      if (isSelected === "Sub Category" && values.parentCategory) {
        categoryData.parentCategory = values.parentCategory;
      }

      message.success(`${isSelected} created successfully!`);

      // Reset form
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Something went wrong!");
      console.error(error);
    }
  };

  const [selected, setSelected] = useState("Category");

  const handleSelected = (value) => {
    setSelected(value);
    console.log(value);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Segmented
        options={["Category", "Sub Category"]}
        block
        className="border border-smart mb-4 w-1/2"
        onChange={handleSelected}
        value={selected}
      />
      <div className="w-1/2 flex gap-4">
        <div className="w-full mt-4">
          <Form
            form={form}
            name="categoryForm"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="bg-white p-4 border rounded-lg"
          >
            {/* Category Form Fields */}

            <Form.Item
              label="Select Category"
              name="category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select placeholder="Select Category" options={categoryOptions} />
            </Form.Item>

            {/* Subcategory Form Fields */}
            {selected === "Sub Category" ? (
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

                <Form.Item
                  label="Subcategory Name"
                  name="subCategoryName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the subcategory name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </>
            ) : (
              <Form.Item
                label="Category Name"
                name="categoryName"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Category name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            )}

            <Form.Item
              label="Upload Image"
              name="image"
              rules={[
                {
                  required: !fileList.length,
                  message: "Please upload an image!",
                },
              ]}
            >
              <Upload
                listType="picture"
                beforeUpload={beforeUpload}
                fileList={fileList}
                maxCount={1}
                accept=".png,.jpg,.jpeg"
                onChange={handleImageChange}
                customRequest={({ onSuccess }) =>
                  setTimeout(() => onSuccess("ok"), 0)
                }
              >
                <Button icon={<InboxOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            {/* <Form.Item
              label={
                selected === "Category"
                  ? "Category Description"
                  : "Subcategory Description"
              }
              name={
                selected === "Category" ? "categoryDesc" : "subCategoryDesc"
              }
              rules={[
                { required: true, message: "Please enter the description!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item> */}

            <Form.Item>
              <Button
                htmlType="submit"
                className="bg-smart/80 border-none text-white min-w-20 min-h-10 text-xs rounded-lg"
              >
                Add {selected}
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* 
        <div className="w-1/3 mt-4">
          <div className="border-2 rounded-lg border-green-700 p-4 flex flex-col gap-4">
            <p>
              {selected === "Category" ? "Category Name" : "Subcategory Name"}:
              {form.getFieldValue(
                selected === "Category" ? "categoryName" : "subCategoryName"
              )}
            </p>
            <div className="w-40 h-auto">
              <p>Image:</p>
              {fileList.length > 0 && (
                <img
                  src={fileList[0]?.thumbUrl || fileList[0]?.url}
                  alt="Preview"
                  width="100%"
                />
              )}
            </div>
            <div>
              <p>
                {selected === "Category"
                  ? "Category Description"
                  : "Subcategory Description"}
                :
              </p>
              <div className="overflow-auto h-20">
                <p>
                  {form.getFieldValue(
                    selected === "Category" ? "categoryDesc" : "subCategoryDesc"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EditCatSub;
