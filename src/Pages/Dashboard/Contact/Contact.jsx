import { useEffect, useState } from "react";
import { Button, Pagination, Table, Modal, Form, Input, message } from "antd";
import { GrFormAdd } from "react-icons/gr";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ButtonEDU from "../../../components/common/ButtonEDU";
import {
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useGetContactQuery,
} from "../../../redux/apiSlices/contact";

function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "add", "edit", "delete"
  const [selectedContact, setSelectedContact] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // API hooks
  const { data: contactsData, isLoading } = useGetContactQuery();
  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const contacts = contactsData?.data || [];
  const totalContacts = contacts.length;

  // Contact field configuration
  const contactFields = [
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "location", label: "Location", type: "text" },
  ];

  // Table columns
  const columns = [
    {
      title: "Ref",
      dataIndex: "ref",
      key: "ref",
      render: (_, __, index) => {
        return <div>Contact {index + 1}</div>;
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            onClick={() => handleEdit(record)}
            className="p-1 border-2 border-smart rounded-full"
          >
            <FiEdit3 size={20} className="text-black" />
          </Button>
          <Button
            className="p-1 border-2 border-smart rounded-full"
            onClick={() => handleDeleteSingle(record)}
          >
            <RiDeleteBin6Line size={20} className="text-black" />
          </Button>
        </div>
      ),
    },
  ];

  // Modal handlers
  const handleAdd = () => {
    console.log("Add button clicked"); // Debug log
    setModalType("add");
    setSelectedContact(null);
    form.resetFields();
    setIsModalOpen(true);
    console.log("Modal should be open:", true); // Debug log
  };

  const handleEdit = (record) => {
    setModalType("edit");
    setSelectedContact(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDeleteSingle = (record) => {
    setModalType("delete");
    setSelectedContact(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalType("");
    setSelectedContact(null);
    form.resetFields();
  };

  // Form submission handlers
  const handleSubmit = async (values) => {
    try {
      let res;
      if (modalType === "add") {
        res = await createContact(values).unwrap();
      } else if (modalType === "edit") {
        res = await updateContact({
          id: selectedContact._id,
          data: { ...values },
        }).unwrap();
      }

      if (res.success) {
        message.success(
          `Contact ${modalType === "add" ? "created" : "updated"} successfully`
        );
        handleCancel();
      }
    } catch (err) {
      message.error(err?.data?.message || `Failed to ${modalType} contact`);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteContact(selectedContact._id).unwrap();
      if (res.success) {
        message.success("Contact deleted successfully");
        handleCancel();
      }
    } catch (err) {
      message.error(err?.data?.message || "Failed to delete contact");
    }
  };

  // Get modal title and content based on type
  const getModalTitle = () => {
    switch (modalType) {
      case "add":
        return "Add New Contact";
      case "edit":
        return "Edit Contact";
      case "delete":
        return "Delete Contact";
      default:
        return "";
    }
  };

  const renderModalContent = () => {
    if (modalType === "delete") {
      return (
        <div className="py-5">
          <p className="text-center text-lg mb-6">
            Are you sure you want to delete this contact?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p>
              <strong>Phone:</strong> {selectedContact?.phone}
            </p>
            <p>
              <strong>Email:</strong> {selectedContact?.email}
            </p>
            <p>
              <strong>Location:</strong> {selectedContact?.location}
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleDelete}
              loading={isDeleting}
              danger
            >
              Delete
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="py-5">
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {contactFields.map((field) => (
            <Form.Item
              key={field.key}
              label={field.label}
              name={field.key}
              rules={[
                {
                  required: true,
                  message: `Please enter the ${field.label.toLowerCase()}`,
                },
                field.key === "email" && {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              ].filter(Boolean)}
            >
              <Input
                type={field.type}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="h-12 rounded-xl"
              />
            </Form.Item>
          ))}

          <div className="flex justify-end gap-4">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={modalType === "add" ? isCreating : isUpdating}
            >
              {modalType === "add" ? "Create" : "Update"}
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  return (
    <>
      <div className="mt-4">
        <h1 className="text-[20px] font-medium">Contact</h1>
        <div className="flex justify-between items-center py-5">
          <Button
            icon={<GrFormAdd size={25} />}
            onClick={handleAdd}
            className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
            type="primary"
          >
            Add New
          </Button>
        </div>
      </div>

      <div className="max-h-[72vh] overflow-auto border rounded-md">
        <Table
          dataSource={contacts}
          columns={columns}
          loading={isLoading}
          size="small"
          pagination={false}
          rowKey="_id"
        />
      </div>

      {/* CRUD Modal */}
      <Modal
        title={getModalTitle()}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        centered
        width={modalType === "delete" ? 400 : 500}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
}

export default Contact;
