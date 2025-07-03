import React, { useState } from "react";
import { Table, Button, message, Checkbox, Pagination } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetPageName from "../../../components/common/GetPageName";
import { FiEdit3 } from "react-icons/fi";
import { FaCheck, FaPlus } from "react-icons/fa";
import { GrFormAdd } from "react-icons/gr";

import driver from "../../../assets/driver.png";
import AddNewExtraModal from "./AddNewExtraModal";
import {
  useAddToProtectionMutation,
  useCreateExtraMutation,
  useDeleteExtraMutation,
  useGetAllServicesQuery,
  useUpdateExtraMutation,
} from "../../../redux/apiSlices/extra";
import { getImageUrl } from "../../../utils/baseUrl";

// Utility function to extract error message from API response
const getErrorMessage = (error) => {
  if (error?.data?.message) {
    return error.data.message;
  }
  if (error?.data?.errorMessages?.length > 0) {
    return error.data.errorMessages[0].message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

function Extra() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [editingRecord, setEditingRecord] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const {
    data: extraData,
    isLoading,
    isError,
    error: fetchError,
  } = useGetAllServicesQuery({ page, limit, status: filter.toUpperCase() });

  console.log("sss", extraData);

  const [addToProtection] = useAddToProtectionMutation();
  const [createExtra] = useCreateExtraMutation();
  const [updateExtra] = useUpdateExtraMutation();
  const [deleteExtra] = useDeleteExtraMutation();

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

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
      cost: parseFloat(values.cost),
      status: values.status.toUpperCase(),
      vat: Number(values.vat),
      isPerDay: values.serviceDuration === true ? true : false,
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
          message.error(res.message || "Update Failed");
        }
      } else {
        const res = await createExtra(formData).unwrap();
        if (res.success) {
          message.success("Create Success");
        } else {
          message.error(res.message || "Create Failed");
        }
      }

      setEditingRecord(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save extra:", error);
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    const idsToDelete = id ? [id] : selectedRowKeys;

    try {
      const results = await Promise.allSettled(
        idsToDelete.map((itemId) => deleteExtra(itemId).unwrap())
      );

      const failures = results.filter((result) => result.status === "rejected");

      if (failures.length === 0) {
        message.success("Deleted successfully");
        setSelectedRowKeys([]);
      } else {
        // Show specific error message from the first failure
        const errorMessage = getErrorMessage(failures[0].reason);
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
    }
  };

  const handleToggleProtection = async (record, checked) => {
    try {
      const updatedData = {
        isProtection: checked ? true : false,
      };

      const res = await addToProtection({
        id: record.key,
        updatedData,
      }).unwrap();

      if (res.success) {
        message.success(
          `Protection ${checked ? "enabled" : "disabled"} successfully`
        );
      } else {
        message.error(res.message || "Failed to update protection status");
      }
    } catch (error) {
      console.error("Protection toggle failed:", error);
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
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
    cost: `$${item.cost}`,
    vat: item.vat,
    status: item.status === "ACTIVE" ? "Active" : "Inactive",
    isProtection: item.isProtection,
    originalRecord: item,
    serviceDuration: item.isPerDay,
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
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      sorter: (a, b) => {
        const numA = parseFloat(a.cost.replace(/[^\d.]/g, "")) || 0;
        const numB = parseFloat(b.cost.replace(/[^\d.]/g, "")) || 0;
        return numA - numB;
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "VAT",
      dataIndex: "vat",
      key: "vat",
      sorter: (a, b) => {
        const numA = parseFloat(a.vat.replace(/[^\d.]/g, "")) || 0;
        const numB = parseFloat(b.vat.replace(/[^\d.]/g, "")) || 0;
        return numA - numB;
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
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
      title: `Add to Protection`,
      key: "addToProtection",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Checkbox
            checked={
              record.isProtection === "true" || record.isProtection === true
            }
            onChange={(e) => handleToggleProtection(record, e.target.checked)}
          />
        </div>
      ),
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

  if (isError) {
    const errorMessage = getErrorMessage(fetchError);
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg mb-2">Failed to fetch data</div>
        <div className="text-gray-600 text-sm">{errorMessage}</div>
      </div>
    );
  }

  return (
    <>
      <Head
        selectedRowKeys={selectedRowKeys}
        handleDelete={handleDelete}
        showModal={showModal}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="h-[72vh] overflow-auto border rounded-md">
        <Table
          columns={columns}
          rowSelection={rowSelection}
          dataSource={transformedData}
          size="small"
          showSorterTooltip={{ target: "sorter-icon" }}
          pagination={false}
        />
      </div>

      <Pagination
        current={page}
        pageSize={limit}
        total={extraData?.data?.meta?.total || 0}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        size="small"
        align="end"
        showSizeChanger={true}
        showQuickJumper={true}
        pageSizeOptions={["10", "20", "50"]}
        onChange={(newPage, newPageSize) => {
          setPage(newPage);
          setLimit(newPageSize);
        }}
        onShowSizeChange={(current, size) => {
          setPage(1);
          setLimit(size);
        }}
        className="mt-2 text-right"
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
