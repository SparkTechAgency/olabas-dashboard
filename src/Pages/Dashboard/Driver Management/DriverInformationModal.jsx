import { Button, DatePicker, Form, Input, Modal, Select, Upload } from "antd";
import React from "react";
import ButtonEDU from "../../../components/common/ButtonEDU";

function DriverInformationModal(isModalOpen, handleOk, handleCancel) {
  return (
    <Modal
      title="Driver Information"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={800}
      closable
    >
      <Form layout="vertical" className="mt-6">
        <Form.Item>
          <p className="text-xs font-semibold">Full Name</p>
          <Input placeholder="Enter Driver Name" />
        </Form.Item>
        <Form.Item>
          <p className="text-xs font-semibold">Date of Birth</p>
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select Date of Birth"
          />
        </Form.Item>
        <Form.Item
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <p className="text-xs font-semibold">Full Name</p>
          <div className="w-full h-8 border rounded-lg flex items-center justify-start">
            <Upload
              listType="text"
              className="flex items-center justify-center"
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button
                icon={""}
                className="h-6 px-1 mx-2 text-xs text-gray-700 flex items-center"
              >
                Click to Upload
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item>
          <p className="text-xs font-semibold">Phone Number</p>
          <Input placeholder="Enter Phone Number" />
        </Form.Item>
        <Form.Item>
          <p className="text-xs font-semibold">Email</p>
          <Input placeholder="Enter Email" />
        </Form.Item>

        <Form.Item>
          <p className="text-xs font-semibold">Address Details</p>
          <Input placeholder="Enter Address" />
        </Form.Item>
        <Form.Item>
          <p className="text-xs font-semibold">Driver License Number</p>
          <Input placeholder="Enter Driver License Number" />
        </Form.Item>
        <Form.Item>
          <div className="w-full flex justify-end items-center gap-4 py-1 ">
            <ButtonEDU actionType="cancel" onClick={handleCancel}>
              Cancel
            </ButtonEDU>
            <ButtonEDU actionType="save">Save</ButtonEDU>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default DriverInformationModal;
