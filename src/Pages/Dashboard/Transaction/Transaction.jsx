import React, { useState } from "react";
import { Table, Alert, Spin } from "antd";
import { useGetTransactionQuery } from "../../../redux/apiSlices/TransactionApi";

export default function TransactionList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Pass page and limit to query hook
  const { data, error, isLoading, isFetching } = useGetTransactionQuery({
    page,
    limit,
  });

  const transactions = data?.data?.result || [];
  const meta = data?.data?.meta || { totalPage: 1, total: 0 };

  // Define table columns
  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
  };

  return (
    <div>
      <h2>Transactions</h2>

      {error && (
        <Alert message="Error loading transactions" type="error" showIcon />
      )}

      {(isLoading || isFetching) && <Spin tip="Loading transactions..." />}

      {!isLoading && !error && (
        <Table
          rowKey={(record) => record._id}
          columns={columns}
          dataSource={transactions}
          pagination={{
            current: page,
            pageSize: limit,
            total: meta.total,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          loading={isLoading || isFetching}
        />
      )}
    </div>
  );
}
