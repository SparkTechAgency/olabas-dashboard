import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Flex, message } from "antd";
import { FaFacebook, FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import ButtonEDU from "../../../components/common/ButtonEDU";
import {
  useGetContactQuery,
  useUpdateContactMutation,
} from "../../../redux/apiSlices/contact";

const Social = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: getContact, isSuccess } = useGetContactQuery();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

  const contactInfo = getContact?.data;

  // Local state to edit form
  const [editedContact, setEditedContact] = useState({
    facebook: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
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
    { key: "facebook", label: "Facebook", type: "text", icon: <FaFacebook /> },
    { key: "whatsapp", label: "WhatsApp", type: "text", icon: <FaWhatsapp /> },
    {
      key: "instagram",
      label: "Instagram",
      type: "text",
      icon: <FaInstagram />,
    },
    { key: "tiktok", label: "TikTok", type: "text", icon: <FaTiktok /> },
  ];

  return (
    <div className="py-5">
      <h1 className="text-[20px] font-medium mb-5">Social</h1>
      <Flex vertical justify="center" gap={30} className="w-full">
        <div className="flex items-center justify-normal bg-white p-12 w-4/5 gap-4 rounded-xl">
          {[
            {
              icon: <FaFacebook size={50} />,
              title: "Facebook",
              details: contactInfo?.facebook || "-",
            },
            {
              icon: <FaWhatsapp size={50} />,
              title: "WhatsApp",
              details: contactInfo?.whatsapp || "-",
            },
            {
              icon: <FaInstagram size={50} />,
              title: "Instagram",
              details: contactInfo?.instagram || "-",
            },
            {
              icon: <FaTiktok size={50} />,
              title: "TikTok",
              details: contactInfo?.tiktok || "-",
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
                label={
                  <div className="flex items-center gap-2">
                    {field.icon}
                    {field.label}
                  </div>
                }
                name={field.key}
                rules={[
                  {
                    required: true,
                    message: `Please enter the ${field.label.toLowerCase()} link`,
                  },
                  {
                    pattern: /^https?:\/\/.+/,
                    message:
                      "Please enter a valid URL (starting with http:// or https://)",
                  },
                ]}
              >
                <Input
                  type={field.type}
                  placeholder={`Enter your ${field.label.toLowerCase()} link`}
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

export default Social;
