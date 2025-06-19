import React, { useState } from "react";
import { Table, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetPageName from "../../../components/common/GetPageName";
import { FiEdit3 } from "react-icons/fi";
import { FaCheck, FaPlus } from "react-icons/fa";
import { GrFormAdd } from "react-icons/gr";

import driver from "../../../assets/driver.png";
import AddNewExtraModal from "./AddNewExtraModal";
import {
  useCreateExtraMutation,
  useDeleteExtraMutation,
  useGetExtraQuery,
  useUpdateExtraMutation,
} from "../../../redux/apiSlices/extra";
import { getImageUrl } from "../../../utils/baseUrl";

function Extra() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [editingRecord, setEditingRecord] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const {
    data: extraData,
    isLoading,
    isError,
  } = useGetExtraQuery({ page, limit, status: filter.toUpperCase() });
  console.log("sss", extraData);

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const [createExtra] = useCreateExtraMutation();
  const [updateExtra] = useUpdateExtraMutation();
  const [deleteExtra] = useDeleteExtraMutation();

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Prepare the data object
    const data = {
      name: values.name,
      description: values.description,
      cost: parseFloat(values.cost), // Fixed: use values.cost instead of editingRecord.cost
      status: values.status.toUpperCase(),
    };

    // Append the JSON string under the 'data' key
    formData.append("data", JSON.stringify(data));

    // Append the file under the 'image' key
    const fileList = values.image;
    if (fileList && fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    }

    try {
      if (editingRecord) {
        const res = await updateExtra({
          id: editingRecord.key,
          updatedData: formData,
        }).unwrap();

        if (res.success) {
          message.success("Update Success");
        } else {
          message.error("Update Failed");
        }
      } else {
        const res = await createExtra(formData).unwrap();
        if (res.success) {
          message.success("Create Success");
        } else {
          message.error("Create Failed");
        }
      }

      setEditingRecord(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save extra:", error);
    }
  };

  const handleDelete = async (id) => {
    const idsToDelete = id ? [id] : selectedRowKeys;

    try {
      await Promise.all(
        idsToDelete.map((itemId) => deleteExtra(itemId).unwrap())
      );
      message.success("Deleted successfully");
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete");
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const transformedData = extraData?.data?.result?.map((item) => ({
    key: item._id,
    image: item.image,
    name: item.name,
    description: item.description,
    cost: `$${item.cost}`, // Fixed: changed from 'price' to 'cost'
    status: item.status === "ACTIVE" ? "Active" : "Inactive",
  }));

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={`${getImageUrl}${image}`}
            alt="extra"
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <img
            src={driver}
            alt="extra"
            className="w-12 h-12 object-cover rounded"
          />
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Cost", dataIndex: "cost", key: "cost" }, // Fixed: changed title from "Price" to "Cost"
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const getStatusColor = (status) => {
          switch (status) {
            case "Active":
              return "bg-[#90BE6D]";
            case "Inactive":
              return "bg-[#F37272]";
            default:
              return "bg-gray-400";
          }
        };
        return (
          <div className="flex justify-start">
            <span
              className={`text-xs font-light text-white px-2 py-0.5 rounded ${getStatusColor(
                text
              )}`}
            >
              {text}
            </span>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            className="p-1 border-smart border-2 rounded-full"
            onClick={() => handleEdit(record)}
          >
            <FiEdit3 size={20} className="text-black" />
          </Button>
          <Button
            className="p-1 border-smart border-2 rounded-full"
            onClick={() => handleDelete(record.key)}
          >
            <RiDeleteBin6Line size={20} className="text-black" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to fetch data.</div>;

  return (
    <>
      <Head
        selectedRowKeys={selectedRowKeys}
        handleDelete={handleDelete}
        showModal={showModal}
        filter={filter}
        setFilter={setFilter}
      />

      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={transformedData}
        size="small"
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize: limit,
          total: extraData?.data?.meta?.total || 0,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          position: ["bottomRight"],
          size: "small",
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["5", "10"],
        }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />

      <AddNewExtraModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
      />
    </>
  );
}

export default Extra;

function Head({ selectedRowKeys, handleDelete, showModal, filter, setFilter }) {
  const handleFilterChange = (newFilter) => setFilter(newFilter);

  const isActive = (key) =>
    filter === key
      ? "bg-smart text-white"
      : "bg-transparent text-gray-400 border hover:bg-smart hover:text-white";

  const iconClass = (key) =>
    filter === key ? "text-white" : "text-gray-400 group-hover:text-white";

  return (
    <div>
      <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
      <div className="flex justify-between items-center py-5">
        <Button
          icon={<GrFormAdd size={25} />}
          onClick={showModal}
          className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
        >
          Add Extra
        </Button>
        <div className="flex gap-3">
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
            >
              Delete ({selectedRowKeys.length})
            </Button>
          )}
          <div className="flex gap-1">
            <button
              onClick={() => handleFilterChange("All")}
              className={`group text-xs px-2 h-8 flex items-center border rounded ${isActive(
                "All"
              )}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("Active")}
              className={`group text-xs px-2 h-8 flex items-center gap-1 border rounded ${isActive(
                "Active"
              )}`}
            >
              <FaCheck className={iconClass("Active")} />
              Active
            </button>
            <button
              onClick={() => handleFilterChange("Inactive")}
              className={`group text-xs px-2 h-8 flex items-center gap-1 border rounded ${isActive(
                "Inactive"
              )}`}
            >
              <FaPlus className={`rotate-45 ${iconClass("Inactive")}`} />
              Inactive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
