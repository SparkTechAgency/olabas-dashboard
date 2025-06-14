import { useState } from "react";
import { Table, Button, message } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { useGetContactListQuery } from "../../../redux/apiSlices/contact";

function ContactList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const {
    data: contactlistData,
    isError,
    isLoading,
  } = useGetContactListQuery({ page, limit });

  console.log("Contact List Data:", contactlistData);

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  // Handle edit action
  const handleEdit = (record) => {
    console.log("Edit record:", record);
    // Add your edit logic here
  };

  // Handle delete action
  const handleDeleteSingle = (id) => {
    console.log("Delete record with id:", id);
    // Add your delete logic here
  };

  // Get status color helper function
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: 150,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 300,
      render: (text) => (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      ),
    },
  ];

  // Prepare data for table
  const tableData =
    contactlistData?.data?.contacts?.map((contact, index) => ({
      key: contact.id, // Use id as key for React
      id: index + 1, // Add a sequential ID for display
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    })) || [];

  return (
    <>
      <div className="mb-4">
        <h1 className="text-[20px] font-medium">Contact Management</h1>
      </div>

      <Table
        columns={columns}
        dataSource={tableData} // Add the data source
        size="small"
        loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize: limit,
          total: contactlistData?.meta?.total || 0,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          position: ["bottomRight"],
          size: "small",
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["1", "5", "10", "20", "50"],
        }}
        scroll={{ x: 1000 }} // Add horizontal scroll for responsive design
      />

      {isError && (
        <div className="text-red-500 text-center mt-4">
          Error loading contact data. Please try again.
        </div>
      )}
    </>
  );
}

export default ContactList;
