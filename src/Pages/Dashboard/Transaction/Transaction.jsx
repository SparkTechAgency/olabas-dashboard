import React, { useState } from "react";
import { Table, Alert, Spin, Pagination } from "antd";
import { useGetTransactionQuery } from "../../../redux/apiSlices/TransactionApi";

export default function TransactionList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  // Pass page and limit to query hook
  const {
    data: transactionData,
    error,
    isLoading,
    isFetching,
  } = useGetTransactionQuery({
    page,
    limit,
  });

  const transactions = transactionData?.data?.result || [];
  const meta = transactionData?.data?.meta || { totalPage: 1, total: 0 };

  // Define table columns with sorting
  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
    },
    {
      title: "Vehicle ID",
      dataIndex: "vehicleId",
      key: "vehicleId",
      sorter: (a, b) => a.vehicleId.localeCompare(b.vehicleId),
    },
    {
      title: "Client ID",
      dataIndex: "clientId",
      key: "clientId",
      sorter: (a, b) => a.clientId.localeCompare(b.clientId),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => {
        return <span>&#8358; {`${amount.toFixed(2)}`}</span>;
      },
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            status === "PAID"
              ? "bg-green-100 text-green-800"
              : status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
  ];

  return (
    <div>
      <h1 className="text-[20px] font-medium mb-5">Transactions</h1>

      {error && (
        <Alert
          message="Error loading transactions"
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {(isLoading || isFetching) && (
        <div className="text-center py-8">
          <Spin tip="Loading transactions..." />
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="max-h-[76vh] overflow-auto border-rounded-md">
            <Table
              rowKey={(record) => record._id}
              columns={columns}
              dataSource={transactions}
              loading={isFetching}
              pagination={false} // Disable built-in pagination
              scroll={{ x: 800 }} // Add horizontal scroll for mobile responsiveness
              size="middle"
            />
          </div>
          {/* Separate Pagination Component */}
          <div className="mt-4 flex justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              size="small"
              total={meta.total}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              showSizeChanger={true}
              showQuickJumper={true}
              pageSizeOptions={["10", "20", "50", "100"]}
              onChange={(newPage, newPageSize) => {
                setPage(newPage);
                if (newPageSize !== limit) {
                  setLimit(newPageSize);
                }
              }}
              onShowSizeChange={(current, size) => {
                setPage(1); // Reset to first page when changing page size
                setLimit(size);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
