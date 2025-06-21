import {
  Collapse,
  Modal,
  Form,
  Input,
  ConfigProvider,
  message,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import FaqPopover from "../../../components/common/PopContent";
import ButtonEDU from "../../../components/common/ButtonEDU";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqQuery,
  useUpdateFaqMutation,
} from "../../../redux/apiSlices/faq";
import { useState } from "react";

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

export const HeadFaq = ({ showModal }) => (
  <div className="flex justify-between items-center py-5">
    <h1 className="text-[20px] font-medium">FAQ</h1>
    <button
      className="bg-smart text-white px-4 py-2 text-sm rounded-md shadow-md"
      onClick={showModal}
    >
      <PlusOutlined className="mr-2" />
      Add New
    </button>
  </div>
);

export default function FaqCollapse() {
  const [activeKeys, setActiveKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState(null);
  const [form] = Form.useForm();
  const [deleteFaq, setDeleteFaq] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: faqData,
    isLoading,
    isError,
    error: fetchError,
  } = useGetFaqQuery();

  const [createFAQ] = useCreateFaqMutation();
  const [updateFAQ] = useUpdateFaqMutation();
  const [deleteFAQ] = useDeleteFaqMutation();

  const showAddModal = () => {
    setEditFaq(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (faq) => {
    // Map _id to id for consistency
    const faqData = { ...faq, id: faq._id };
    setEditFaq(faqData);
    form.setFieldsValue({ question: faq.question, answer: faq.answer });
    setIsModalOpen(true);
  };

  const showDeleteModal = (faq) => {
    // Map _id to id for consistency
    const faqData = { ...faq, id: faq._id };
    setDeleteFaq(faqData);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      if (editFaq) {
        console.log("editFaq", editFaq);
        const res = await updateFAQ({
          id: editFaq.id,
          updatedData: values,
        }).unwrap();

        if (res.success) {
          message.success("FAQ updated successfully!");
        } else {
          message.error(res.message || "Failed to update FAQ");
        }
      } else {
        const res = await createFAQ(values).unwrap();

        if (res.success) {
          message.success("FAQ added successfully!");
        } else {
          message.error(res.message || "Failed to create FAQ");
        }
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Save error:", error);
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      console.log("Deleting FAQ with ID:", deleteFaq?.id);
      if (!deleteFaq?.id) {
        message.error("FAQ ID is missing");
        return;
      }

      const res = await deleteFAQ(deleteFaq.id).unwrap();

      if (res.success) {
        message.success("FAQ deleted successfully!");
      } else {
        message.error(res.message || "Failed to delete FAQ");
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
      setIsDeleteModalOpen(false);
    }
  };

  const getItems = () =>
    faqData?.data?.map((faq) => {
      console.log("FAQ item:", faq);
      const { _id, question, answer } = faq;
      return {
        key: _id,
        label: (
          <div className="flex items-center justify-between">
            {question}
            <FaqPopover
              onEdit={() => showEditModal({ _id, question, answer })}
              onDelete={() => showDeleteModal({ _id, question, answer })}
            />
          </div>
        ),
        children: <p className="border-l-2 border-smart pl-4">{answer}</p>,
      };
    }) || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full">
        <HeadFaq showModal={showAddModal} />
        <div className="flex justify-center mt-10">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Show error state with specific error message
  if (isError) {
    const errorMessage = getErrorMessage(fetchError);
    return (
      <div className="h-full">
        <HeadFaq showModal={showAddModal} />
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-lg mb-2 font-medium">
            Failed to load FAQs
          </div>
          <div className="text-gray-600 text-sm text-center max-w-md">
            {errorMessage}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Please contact your administrator if this issue persists.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <HeadFaq showModal={showAddModal} />

      <Collapse
        bordered={false}
        activeKey={activeKeys}
        onChange={setActiveKeys}
        expandIcon={({ isActive }) => (
          <div
            className="flex items-center justify-center w-6 h-6 transition-transform duration-300"
            style={{ transform: `rotate(${isActive ? 180 : 0}deg)` }}
          >
            <PlusOutlined className="text-smart" />
          </div>
        )}
        items={getItems()}
        className="shadow-md bg-white"
      />

      {/* Add/Edit FAQ Modal */}
      <Modal
        title={editFaq ? "Edit FAQ" : "Add FAQ"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        centered
        footer={null}
      >
        <ConfigProvider
          theme={{
            components: {
              Form: { labelFontSize: 16, itemMarginBottom: 8 },
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            className="flex flex-col gap-5"
          >
            <Form.Item
              label="Question"
              name="question"
              rules={[{ required: true, message: "Please enter the question" }]}
            >
              <Input placeholder="Enter the question" className="h-12" />
            </Form.Item>

            <Form.Item
              label="Answer"
              name="answer"
              rules={[{ required: true, message: "Please enter the answer" }]}
            >
              <Input.TextArea placeholder="Enter the answer" rows={5} />
            </Form.Item>

            <div className="flex justify-end gap-4">
              <ButtonEDU
                actionType="cancel"
                onClick={() => {
                  form.resetFields();
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </ButtonEDU>
              <ButtonEDU actionType="save" htmlType="submit">
                Save
              </ButtonEDU>
            </div>
          </Form>
        </ConfigProvider>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete FAQ"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        centered
        footer={null}
      >
        <div className="py-4">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete this FAQ?
          </p>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium text-sm text-gray-800">
              Q: {deleteFaq?.question}
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <ButtonEDU
            actionType="cancel"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </ButtonEDU>
          <ButtonEDU actionType="delete" onClick={handleDelete}>
            Delete
          </ButtonEDU>
        </div>
      </Modal>
    </div>
  );
}
