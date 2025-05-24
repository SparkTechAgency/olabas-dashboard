import React from "react";
import { Form, Input, Modal, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function AddNewMember({ isModalOpen, handleOk, handleCancel }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form values:", values);
    handleOk(); // call parent callback
    form.resetFields();
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Add Team Member</span>}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      width={400}
      closeIcon={<span className="text-xl text-green-500">×</span>}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} className="pt-2">
        <Form.Item
          label={
            <span>
              Name<span className="text-red-500">*</span>
            </span>
          }
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Designation<span className="text-red-500">*</span>
            </span>
          }
          name="designation"
          rules={[{ required: true, message: "Please enter designation" }]}
        >
          <Input placeholder="Enter designation" />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Image<span className="text-red-500">*</span>
            </span>
          }
          name="image"
          valuePropName="file"
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-[#00C853] hover:bg-[#00b34a] border-none"
            size="large"
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddNewMember;
