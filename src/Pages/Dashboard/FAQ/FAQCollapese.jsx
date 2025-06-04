// import React, { useState } from "react";
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

  const { data: faqData, isLoading } = useGetFaqQuery();
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
        await updateFAQ({ id: editFaq.id, updatedData: values }).unwrap();
        message.success("FAQ updated successfully!");
      } else {
        await createFAQ(values).unwrap();
        message.success("FAQ added successfully!");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Save error:", error);
      message.error("Something went wrong.");
    }
  };

  const handleDelete = async () => {
    try {
      console.log("Deleting FAQ with ID:", deleteFaq?.id); // Debug log
      if (!deleteFaq?.id) {
        message.error("FAQ ID is missing");
        return;
      }
      await deleteFAQ(deleteFaq.id).unwrap();
      message.success("FAQ deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete FAQ.");
      setIsDeleteModalOpen(false);
    }
  };

  const getItems = () =>
    faqData?.data?.map((faq) => {
      console.log("FAQ item:", faq); // Debug log to check data structure
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

  return (
    <div className="h-full">
      <HeadFaq showModal={showAddModal} />

      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spin />
        </div>
      ) : (
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
      )}

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
        <p>Are you sure you want to delete this FAQ?</p>
        <div className="flex justify-center gap-4 mt-4">
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
