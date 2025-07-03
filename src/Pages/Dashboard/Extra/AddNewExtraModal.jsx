// import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Radio, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FaMoneyBillAlt } from "react-icons/fa";
import { useEffect } from "react";

function AddNewExtraModal({
  isModalOpen,
  handleOk,
  handleCancel,
  onSubmit,
  editingRecord,
}) {
  const [form] = Form.useForm();

  console.log("editing", editingRecord);

  // Load data into form for editing
  useEffect(() => {
    if (editingRecord) {
      // When editing, we need to extract the numeric value from the cost string (e.g., "$25" -> 25)
      const formValues = {
        ...editingRecord,
        cost: editingRecord.cost
          ? parseFloat(editingRecord.cost.replace("$", ""))
          : undefined,
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [editingRecord, form]);

  const handleFinish = (values) => {
    console.log("Submitted values:", values); // check cost here
    onSubmit({
      ...editingRecord,
      ...values,
      key: editingRecord?.key || Date.now(),
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
        <div className="flex gap-10">
          <Form.Item
            label="Base Cost"
            name="baseCost"
            rules={[{ required: true, message: "Please enter the base cost!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter Base Cost"
              formatter={(value) => (value ? `${value}` : "")} // no $ added
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")} // strips $ if pasted
              prefix={<FaMoneyBillAlt style={{ color: "#17a34a" }} />}
            />
          </Form.Item>
          <Form.Item
            label="VAT"
            name="vat"
            rules={[{ required: true, message: "Please enter the VAT!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter VAT"
              formatter={(value) => (value ? `${value}` : "")} // no $ added
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")} // strips $ if pasted
              prefix={<FaMoneyBillAlt style={{ color: "#17a34a" }} />}
            />
          </Form.Item>
        </div>

        <div className="w-full border flex gap-40">
          {" "}
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
            label="Service Duration"
            name="serviceDuration"
            rules={[
              { required: true, message: "Please select Service Duration!" },
            ]}
          >
            <Radio.Group>
              <Radio value={false}>One Time</Radio>
              <Radio value={true}>Per Day</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

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
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea placeholder="Enter Description" />
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
