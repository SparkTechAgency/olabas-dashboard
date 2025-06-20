import { useState } from "react";
import { Table, Button, Pagination } from "antd";
import { useGetContactListQuery } from "../../../redux/apiSlices/contact";
import { AiOutlineEye } from "react-icons/ai";
import ContactInfoModal from "./contactInfoModal";
import dayjs from "dayjs";

function ContactList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const {
    data: contactlistData,
    isError,
    isLoading,
  } = useGetContactListQuery({ page, limit });

  console.log("Contact List Data:", contactlistData);

  const handleViewClient = (record) => {
    setSelectedClient(record);
    setShowInfoModal(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: 150,
      sorter: (a, b) => a.subject.localeCompare(b.subject),
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
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
      sorter: (a, b) =>
        dayjs(a.dateOriginal).unix() - dayjs(b.dateOriginal).unix(),
      render: (text, record) => (
        <span>{dayjs(record.dateOriginal).format("MMM D, YYYY h:mm A")}</span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      align: "right",
      width: 150,
      render: (_, record) => (
        <Button
          className="p-1 border-2 border-smart"
          onClick={() => handleViewClient(record)}
        >
          <AiOutlineEye size={20} className="text-black" />
        </Button>
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
      date: dayjs(contact.createdAt).format("MMM D, YYYY h:mm A"), // Formatted date for display
      dateOriginal: contact.createdAt, // Keep original date for sorting
    })) || [];

  return (
    <>
      <div className="mb-4">
        <h1 className="text-[20px] font-medium">Contact Management</h1>
      </div>

      <div className="max-h-[77vh] overflow-auto border rounded-md">
        <Table
          columns={columns}
          dataSource={tableData}
          size="small"
          loading={isLoading}
          scroll={{ x: 1000 }}
          pagination={false}
        />
      </div>
      <Pagination
        current={page}
        pageSize={limit}
        total={contactlistData?.data?.meta?.total || 0}
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
        className="mt-2 text-right"
      />
      <ContactInfoModal
        open={showInfoModal}
        onCancel={() => setShowInfoModal(false)}
        record={selectedClient}
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
