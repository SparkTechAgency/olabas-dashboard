import { Row, Col, Form, Input, Select } from "antd";
import React from "react";
const countries = [
  "Nigeria",
  "Ghana",
  "South Africa",
  "Kenya",
  "Egypt",
  "Morocco",
  "Other",
];

const nigeriaStates = [
  "Lagos",
  "Abuja",
  "Kano",
  "Rivers",
  "Oyo",
  "Kaduna",
  "Plateau",
  "Delta",
  "Edo",
  "Anambra",
  "Other",
];
function Details() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
      </div>
      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "First name required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Last name required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: "email", message: "Invalid email" },
              { required: true, message: "Email required" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Present Address"
            name="presentAddress"
            rules={[{ required: true, message: "Present address required" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Permanent Address"
            name="permanentAddress"
            rules={[{ required: true, message: "Permanent address required" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Select a country" }]}
          >
            <Select placeholder="Select country">
              {countries.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="State/Division" name="stateDivision">
            <Select placeholder="Select state">
              {nigeriaStates.map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Post Code" name="postCode">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}

export default Details;
