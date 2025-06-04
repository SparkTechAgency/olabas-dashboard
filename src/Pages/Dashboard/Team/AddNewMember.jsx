import React, { useState } from "react";
import { Form, Input, Modal, Upload, Button, Radio, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function AddNewMember({ isModalOpen, handleOk, handleCancel }) {
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState(null);

  const onFinish = (values) => {
    // Get uploaded image file URL
    const file = values.image?.[0];
    const imageUrl = file?.originFileObj
      ? URL.createObjectURL(file.originFileObj)
      : null;

    handleOk({
      ...values,
      image: imageUrl,
      status: "Active", // Default status on add
    });
    form.resetFields();
    setSelectedRole(null);
  };

  const onCancel = () => {
    form.resetFields();
    setSelectedRole(null);
    handleCancel();
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Add New Team Member</span>}
      open={isModalOpen}
      footer={null}
      onCancel={onCancel}
      width={600}
      closeIcon={<span className="text-xl text-green-500">×</span>}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} className="pt-2">
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Radio.Group
            onChange={(e) => setSelectedRole(e.target.value)}
            defaultValue="authority"
          >
            <Radio value="authority">Authority</Radio>
            <Radio value="member">Member</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Designation"
          name="designation"
          rules={[{ required: true, message: "Please enter designation" }]}
        >
          <Input placeholder="Enter designation" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload
            beforeUpload={() => false}
            accept="image/*"
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        {selectedRole === "authority" && (
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={3} placeholder="Enter authority description" />
          </Form.Item>
        )}

        <Form.Item>
          <Button
            htmlType="submit"
            className="w-full text-white bg-[#00C853] hover:bg-[#00b34a] border-none"
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
