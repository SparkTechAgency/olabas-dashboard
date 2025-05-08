import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Radio, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function AddNewExtraModal({
  isModalOpen,
  handleOk,
  handleCancel,
  onSubmit,
  editingRecord,
}) {
  const [form] = Form.useForm();

  // Load data into form for editing
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue(editingRecord);
    } else {
      form.resetFields();
    }
  }, [editingRecord, form]);

  const handleFinish = (values) => {
    onSubmit({
      ...editingRecord,
      ...values,
      key: editingRecord?.key || Date.now(), // For new entries
    });
    form.resetFields();
    handleOk();
  };

  return (
    <Modal
      title={editingRecord ? "Edit Extra" : "Add Extra"}
      open={isModalOpen}
      onCancel={() => {
        handleCancel();
        form.resetFields();
      }}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input placeholder="Enter Name" />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price!" }]}
        >
          <InputNumber
            prefix="$"
            style={{ width: "100%" }}
            placeholder="Enter Price"
          />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Radio.Group>
            <Radio value="Active">Active</Radio>
            <Radio value="Inactive">Inactive</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Image"
          name="image"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e && e.fileList;
          }}
        >
          <Upload
            listType="picture"
            beforeUpload={(file) => {
              file.preview = URL.createObjectURL(file);
              return false; // Prevent automatic upload
            }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please input the type!" }]}
        >
          <Input.TextArea placeholder="Enter Type" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-smart">
            {editingRecord ? "Update" : "Add"} Extra
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddNewExtraModal;
