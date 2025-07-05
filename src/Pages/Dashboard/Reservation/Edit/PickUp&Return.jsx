import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetAllLocationQuery } from "../../../../redux/apiSlices/LocationApi";
const { Title, Text } = Typography;
const { Option } = Select;

const PickUpAndReturn = () => {
  const [form] = Form.useForm();
  const [pickupDateTime, setPickupDateTime] = useState(null);
  const [returnDateTime, setReturnDateTime] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [returnLocation, setReturnLocation] = useState(null);

  const { data: locationData, isLoading } = useGetAllLocationQuery();
  const locations = locationData?.data?.result || [];

  // Set default values on component mount
  useEffect(() => {
    const now = dayjs();
    const defaultReturnTime = now.add(3, "hour");

    const defaultPickupDate = now.format("DD/MM/YYYY");
    const defaultPickupTime = now.format("HH:mm");
    const defaultReturnDate = defaultReturnTime.format("DD/MM/YYYY");
    const defaultReturnTimeFormatted = defaultReturnTime.format("HH:mm");

    setPickupDateTime(now);
    setReturnDateTime(defaultReturnTime);

    form.setFieldsValue({
      pickupDate: now,
      pickupTime: now,
      returnDate: defaultReturnTime,
      returnTime: defaultReturnTime,
    });
  }, [form]);

  // Disable past dates for pickup
  const disabledPickupDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Disable past dates for return, and dates before pickup
  const disabledReturnDate = (current) => {
    const minDate = pickupDateTime || dayjs();
    return current && current < minDate.startOf("day");
  };

  // Disable past times for pickup (only for today)
  const disabledPickupTime = () => {
    const pickupDate = form.getFieldValue("pickupDate");
    if (!pickupDate || !pickupDate.isSame(dayjs(), "day")) {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    const now = dayjs();
    const currentHour = now.hour();
    const currentMinute = now.minute();

    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < currentHour; i++) {
          hours.push(i);
        }
        return hours;
      },
      disabledMinutes: (selectedHour) => {
        if (selectedHour === currentHour) {
          const minutes = [];
          for (let i = 0; i <= currentMinute; i++) {
            minutes.push(i);
          }
          return minutes;
        }
        return [];
      },
    };
  };

  // Disable return times that don't meet minimum 3-hour requirement
  const disabledReturnTime = () => {
    if (!pickupDateTime) {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    const returnDate = form.getFieldValue("returnDate");
    if (!returnDate) {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    // If return date is same as pickup date, check time constraints
    if (returnDate.isSame(pickupDateTime, "day")) {
      const minReturnTime = pickupDateTime.add(3, "hour");
      const minHour = minReturnTime.hour();
      const minMinute = minReturnTime.minute();

      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < minHour; i++) {
            hours.push(i);
          }
          return hours;
        },
        disabledMinutes: (selectedHour) => {
          if (selectedHour === minHour) {
            const minutes = [];
            for (let i = 0; i < minMinute; i++) {
              minutes.push(i);
            }
            return minutes;
          } else if (selectedHour < minHour) {
            const minutes = [];
            for (let i = 0; i < 60; i++) {
              minutes.push(i);
            }
            return minutes;
          }
          return [];
        },
      };
    }

    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
    };
  };

  const handlePickupDateChange = (date) => {
    if (date) {
      const currentTime = form.getFieldValue("pickupTime") || dayjs();
      const combined = date
        .hour(currentTime.hour())
        .minute(currentTime.minute());
      setPickupDateTime(combined);

      // Auto-set return time to 3 hours later
      const autoReturnTime = combined.add(3, "hour");
      setReturnDateTime(autoReturnTime);

      form.setFieldsValue({
        returnDate: autoReturnTime,
        returnTime: autoReturnTime,
      });
    }
  };

  const handlePickupTimeChange = (time) => {
    if (time) {
      const currentDate = form.getFieldValue("pickupDate") || dayjs();
      const combined = currentDate.hour(time.hour()).minute(time.minute());
      setPickupDateTime(combined);

      // Auto-set return time to 3 hours later
      const autoReturnTime = combined.add(3, "hour");
      setReturnDateTime(autoReturnTime);

      form.setFieldsValue({
        returnDate: autoReturnTime,
        returnTime: autoReturnTime,
      });
    }
  };

  const handleReturnDateChange = (date) => {
    if (date) {
      const currentTime = form.getFieldValue("returnTime") || dayjs();
      const combined = date
        .hour(currentTime.hour())
        .minute(currentTime.minute());
      setReturnDateTime(combined);
    }
  };

  const handleReturnTimeChange = (time) => {
    if (time) {
      const currentDate = form.getFieldValue("returnDate") || dayjs();
      const combined = currentDate.hour(time.hour()).minute(time.minute());
      setReturnDateTime(combined);
    }
  };

  const handlePickupLocationChange = (locationId) => {
    setPickupLocation(locationId);
  };

  const handleReturnLocationChange = (locationId) => {
    setReturnLocation(locationId);
  };

  const onFinish = (values) => {
    console.log("Form Values:", values);
    console.log("Combined DateTime Values:", {
      pickupDateTime: pickupDateTime?.format("MM/DD/YYYY HH:mm"),
      returnDateTime: returnDateTime?.format("MM/DD/YYYY HH:mm"),
      pickupLocation,
      returnLocation,
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">PickUp and Return</h3>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          {/* Pick-up column */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Pick-up Date"
              name="pickupDate"
              rules={[{ required: true, message: "Choose a pick-up date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                suffixIcon={<CalendarOutlined />}
                disabledDate={disabledPickupDate}
                onChange={handlePickupDateChange}
                allowClear={false}
              />
            </Form.Item>

            <Form.Item
              label="Pick-up Time"
              name="pickupTime"
              rules={[{ required: true, message: "Choose a pick-up time" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                suffixIcon={<ClockCircleOutlined />}
                disabledTime={disabledPickupTime}
                onChange={handlePickupTimeChange}
                allowClear={false}
              />
            </Form.Item>

            <Form.Item
              label="Pick-up Location"
              name="pickupLocation"
              rules={[{ required: true, message: "Select a location" }]}
            >
              <Select
                placeholder="Select location"
                suffixIcon={<EnvironmentOutlined />}
                onChange={handlePickupLocationChange}
                loading={isLoading}
              >
                {locations.map((locationItem) => (
                  <Option key={locationItem._id} value={locationItem._id}>
                    {locationItem.location}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Return column */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Return Date"
              name="returnDate"
              rules={[{ required: true, message: "Choose a return date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                suffixIcon={<CalendarOutlined />}
                disabledDate={disabledReturnDate}
                onChange={handleReturnDateChange}
                allowClear={false}
              />
            </Form.Item>

            <Form.Item
              label="Return Time"
              name="returnTime"
              rules={[{ required: true, message: "Choose a return time" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                suffixIcon={<ClockCircleOutlined />}
                disabledTime={disabledReturnTime}
                onChange={handleReturnTimeChange}
                allowClear={false}
              />
            </Form.Item>

            <Form.Item
              label="Return Location"
              name="returnLocation"
              rules={[{ required: true, message: "Select a location" }]}
            >
              <Select
                placeholder="Select location"
                suffixIcon={<EnvironmentOutlined />}
                onChange={handleReturnLocationChange}
                loading={isLoading}
              >
                {locations.map((locationItem) => (
                  <Option key={locationItem._id} value={locationItem._id}>
                    {locationItem.location}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PickUpAndReturn;
