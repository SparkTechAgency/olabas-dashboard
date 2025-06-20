import { useState } from "react";
import { Table, Button, message, Pagination } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import GetPageName from "../../../components/common/GetPageName";
import CustomSearch from "../../../components/common/CustomSearch";
import { useGetClientQuery } from "../../../redux/apiSlices/clientMnanagement";
import ClientInfoModal from "./clientInfoModal";

function ClientMangement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const {
    data: clientData,
    isLoading,
    isError,
  } = useGetClientQuery({ page, limit, searchTerm: searchQuery });

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  // Remove client-side filtering since backend handles search
  const clientList = clientData?.data?.result || [];

  const handleSearch = (value) => {
    setSearchQuery(value);
    // Reset pagination when searching
    setPage(1);
    // Clear selected rows when searching
    setSelectedRowKeys([]);
  };

  const handleViewClient = (record) => {
    setSelectedClient(record);
    setShowInfoModal(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const handleDelete = () => {
    message.warning(
      "Delete functionality needs to be implemented with your API"
    );
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: "Client",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Contact",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Total Rentals",
      dataIndex: "totalBookings",
      key: "totalBookings",
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpend",
      key: "totalSpend",
      sorter: (a, b) => a.totalSpend - b.totalSpend,
      render: (totalSpend) => (
        <p className="text-black font-medium">₦ {totalSpend || 0}</p>
      ),
    },
    {
      title: "Last Rental Date",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (_, record) => (
        <div className="flex flex-col">
          <span>{record.lastBooking?.createdAt || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            className="p-1 border-smart"
            onClick={() => handleViewClient(record)}
          >
            <AiOutlineEye size={20} className="text-black" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head
        onSearch={handleSearch}
        pagename="Client Management"
        selectedRowKeys={selectedRowKeys}
        handleDelete={handleDelete}
        filteredData={clientList} // Use server-filtered data
      />

      <div className="max-h-[75vh] overflow-auto">
        <Table
          columns={columns}
          rowSelection={rowSelection}
          dataSource={clientList} // Use server-filtered data
          loading={isLoading}
          size="small"
          rowKey={(record) => record._id || record.id}
          pagination={false}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      </div>
      <Pagination
        current={page}
        pageSize={limit}
        total={clientData?.data?.meta?.total || 0}
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
          setPage(1); // Reset to first page when changing page size
          setLimit(size);
        }}
        className="mt-2 text-right" // Add some top margin and align to right
      />

      <ClientInfoModal
        open={showInfoModal}
        onCancel={() => setShowInfoModal(false)}
        record={selectedClient}
      />
    </>
  );
}

export default ClientMangement;

// Head Component
function Head({ onSearch, selectedRowKeys, handleDelete, filteredData }) {
  return (
    <div className="flex justify-between items-center py-5">
      <h1 className="text-[20px] font-medium">Client Management</h1>

      <div className="flex gap-3 items-center">
        <CustomSearch
          onSearch={onSearch}
          placeholder="Search by name, email, phone..."
        />

        {selectedRowKeys.length > 0 && (
          <Button
            onClick={handleDelete}
            icon={<DeleteOutlined />}
            className="bg-smart text-white border-none h-8"
            disabled={selectedRowKeys.length === 0}
          >
            {`Delete (${selectedRowKeys.length})`}
          </Button>
        )}
      </div>
    </div>
  );
}
