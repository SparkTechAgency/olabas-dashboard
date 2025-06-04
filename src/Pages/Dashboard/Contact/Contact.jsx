import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Flex, message } from "antd";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { PiMapPinAreaLight } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import ButtonEDU from "../../../components/common/ButtonEDU";
import {
  useGetContactQuery,
  useUpdateContactMutation,
} from "../../../redux/apiSlices/contact";

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: getContact, isSuccess } = useGetContactQuery();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

  const contactInfo = getContact?.data;

  // Local state to edit form
  const [editedContact, setEditedContact] = useState({
    phone: "",
    email: "",
    location: "",
  });

  // Populate editedContact when data is loaded
  useEffect(() => {
    if (contactInfo) {
      setEditedContact(contactInfo);
      form.setFieldsValue(contactInfo);
    }
  }, [contactInfo, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async (values) => {
    try {
      await updateContact({ updatedData: values }).unwrap();
      message.success("Contact info updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      message.error("Failed to update contact info");
    }
  };

  const contactFields = [
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "location", label: "Location", type: "text" },
  ];

  return (
    <div className="py-5">
      <h1 className="text-[20px] font-medium mb-5">Contact</h1>
      <Flex vertical justify="center" gap={30} className="w-full">
        <div className="flex items-center justify-normal bg-white p-12 w-4/5 gap-4 rounded-xl">
          {[
            {
              icon: <LiaPhoneVolumeSolid size={50} />,
              title: "Phone",
              details: contactInfo?.phone || "-",
            },
            {
              icon: <CiMail size={50} />,
              title: "Email",
              details: contactInfo?.email || "-",
            },
            {
              icon: <PiMapPinAreaLight size={50} />,
              title: "Location",
              details: contactInfo?.location || "-",
            },
          ].map((item, index) => (
            <Flex
              vertical
              key={index}
              gap={20}
              align="center"
              className="flex-auto"
            >
              <div className="bg-white rounded-xl shadow-[0px_0px_15px_4px_rgba(0,_0,_0,_0.1)] p-4 hover:bg-smart text-smart hover:text-white">
                {item.icon}
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-600">{item.details}</p>
              </div>
            </Flex>
          ))}
        </div>
        <button
          onClick={showModal}
          className="w-4/5 h-12 bg-white rounded-lg border border-1 border-smart text-smart font-bold tracking-wider hover:bg-smart hover:text-white hover:transition-all duration-500"
        >
          Edit Info
        </button>
      </Flex>

      {/* Edit Contact Modal */}
      <Modal
        title="Edit Contact"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        centered
      >
        <div className="py-5">
          <Form
            layout="vertical"
            form={form}
            onFinish={handleUpdate}
            initialValues={editedContact}
          >
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
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  className="h-12 rounded-xl"
                />
              </Form.Item>
            ))}

            <div className="flex justify-end gap-4">
              <ButtonEDU actionType="cancel" onClick={handleCancel}>
                Cancel
              </ButtonEDU>
              <ButtonEDU
                actionType="update"
                htmlType="submit"
                loading={isUpdating}
              >
                Update
              </ButtonEDU>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Contact;
