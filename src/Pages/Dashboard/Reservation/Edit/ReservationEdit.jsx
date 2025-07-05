// ReservationEdit.jsx
import React from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Checkbox,
  Row,
  Col,
  Button,
  message,
} from "antd";
import moment from "moment";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import ExtraServices from "./ExtraServices";
import ProtectionServices from "./ProtectionServices";
import PickUpAndReturn from "./PickUp&Return";
import Details from "./Details";

const { Option } = Select;

const carSizes = [
  { value: "Large: Premium", price: "₦ 840.00" },
  { value: "Large: Station wagon", price: "₦ 840.00" },
  { value: "Medium: Low emission", price: "₦ 840.00" },
  { value: "Small: Economy", price: "₦ 840.00" },
  { value: "Small: Mini", price: "₦ 840.00" },
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
const extraServices = [
  {
    id: "685d9bc5402491ff70fcee77",
    label: "GWAGON TRAVEL FUELING",
    description: "GWAGON IS FUELED BY US",
    price: 100000,
    billing: "One Time",
    defaultChecked: false,
  },
  {
    id: "685d9b16402491ff70fcee75",
    label: "TRAVEL FEE – December rate",
    description:
      "Our operation is mostly based in Lagos Nigeria. If you will be traveling out of Lagos state let us know...",
    price: 150000,
    billing: "One Time",
    defaultChecked: true,
  },
];

export default function ReservationEdit() {
  const { id } = useParams(); // comes from /edit-reservation/:id

  const [form] = Form.useForm();

  /* ------------
     SUBMIT
  -------------*/
  const onFinish = (values) => {
    // Flatten date/time values
    const payload = {
      ...values,
      pickupDate: values.pickupDate.format("DD/MM/YYYY"),
      pickupTime: values.pickupTime.format("HH:mm"),
      returnDate: values.returnDate.format("DD/MM/YYYY"),
      returnTime: values.returnTime.format("HH:mm"),
    };

    console.log("Submitting reservation", payload);
    message.success("Reservation saved!");
  };

  /* ------------
     JSX
  -------------*/
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 max-h-[60vh] overflow-auto">
      <Form
        form={form}
        layout="vertical"
        className="border border-red-400"
        onFinish={onFinish}
        initialValues={{
          pickupDate: moment("05/07/2025", "DD/MM/YYYY"),
          pickupTime: moment("09:41", "HH:mm"),
          pickupLocation: "",
          returnDate: moment("05/07/2025", "DD/MM/YYYY"),
          returnTime: moment("12:41", "HH:mm"),
          returnLocation: "",
          carSize: "Large: Premium",
          vehicle: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          permanentAddress: "",
          presentAddress: "",
          country: "",
          stateDivision: "",
          postCode: "",
          extraServices: { gwagonTravel: false, travelFee: true },
          protectionServices: {
            extraProtection: true,
            theftProtection: true,
            collisionDamage: false,
            defaultProtection: false,
          },
        }}
      >
        {/* ──────────── 1. PICK‑UP / RETURN ──────────── */}
        <PickUpAndReturn />

        {/* ──────────── 2. VEHICLE / SIZE ──────────── */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Car Size"
                name="carSize"
                rules={[{ required: true, message: "Select a car size" }]}
              >
                <Select placeholder="Select size">
                  {carSizes.map((c) => (
                    <Option key={c.value} value={c.value}>
                      {c.value} ({c.price})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Specific Vehicle (optional)" name="vehicle">
                <Select placeholder="Select a vehicle">
                  <Option value="Toyota Corolla">Toyota Corolla</Option>
                  <Option value="Honda Civic">Honda Civic</Option>
                  <Option value="Mercedes-Benz G-Wagon">
                    Mercedes-Benz G-Wagon
                  </Option>
                  <Option value="BMW X5">BMW X5</Option>
                  <Option value="Tesla Model 3">Tesla Model 3</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* ──────────── 4. EXTRA SERVICES ──────────── */}
        <div className="bg-white shadow-sm rounded-lg  mb-8">
          <ExtraServices />
          <ProtectionServices />
        </div>
        {/* ──────────── 3. RENTER DETAILS ──────────── */}
        <Details />
        {/* ──────────── 5. SUBMIT ──────────── */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Reservation
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
