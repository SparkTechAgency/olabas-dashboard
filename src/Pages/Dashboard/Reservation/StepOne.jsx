import React, { useEffect } from "react";
import { Form, Select, DatePicker, TimePicker } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import {
  setPickupDateTime,
  setReturnDateTime,
  setPickupLocation,
  setReturnLocation,
  calculateTotals,
} from "../../../redux/features/ReservationSlice";
import { useGetAllLocationQuery } from "../../../redux/apiSlices/LocationApi";

const { Option } = Select;

const DateTimePicker = ({
  value,
  onChange,
  placeholder,
  isPickup,
  pickupTime,
}) => {
  // Parse the combined datetime string from Redux
  const dateTimeValue = value ? dayjs(value) : null;
  const date = dateTimeValue;
  const time = dateTimeValue;

  const handleDateChange = (newDate) => {
    if (newDate && time) {
      const combined = newDate.hour(time.hour()).minute(time.minute());
      onChange?.(combined.format("MM/DD/YYYY hh:mm a"));
    } else if (newDate && !time) {
      // If no time is set, set default time
      const defaultTime = isPickup ? dayjs() : dayjs().add(3, "hour");
      const combined = newDate
        .hour(defaultTime.hour())
        .minute(defaultTime.minute());
      onChange?.(combined.format("MM/DD/YYYY hh:mm a"));
    }
  };

  const handleTimeChange = (newTime) => {
    if (date && newTime) {
      const combined = date.hour(newTime.hour()).minute(newTime.minute());
      onChange?.(combined.format("MM/DD/YYYY hh:mm a"));
    }
  };

  // Disable past dates for pickup
  const disabledPickupDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Disable past dates for return, and dates before pickup
  const disabledReturnDate = (current) => {
    const minDate = pickupTime ? dayjs(pickupTime) : dayjs();
    return current && current < minDate.startOf("day");
  };

  // Disable past times for pickup (only for today)
  const disabledPickupTime = () => {
    if (!date || !date.isSame(dayjs(), "day")) {
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
    if (!pickupTime || !date) {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    const pickupDateTime = dayjs(pickupTime);

    // If return date is same as pickup date, check time constraints
    if (date.isSame(pickupDateTime, "day")) {
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

  return (
    <div className="flex gap-2">
      <DatePicker
        placeholder="Date"
        className="flex-1"
        format="DD/MM/YYYY"
        suffixIcon={<CalendarOutlined className="text-green-500" />}
        value={date}
        onChange={handleDateChange}
        disabledDate={isPickup ? disabledPickupDate : disabledReturnDate}
        allowClear={false}
      />
      <TimePicker
        placeholder="Time"
        className="flex-1"
        format="HH:mm"
        suffixIcon={<ClockCircleOutlined className="text-green-500" />}
        value={time}
        onChange={handleTimeChange}
        disabledTime={isPickup ? disabledPickupTime : disabledReturnTime}
        allowClear={false}
      />
    </div>
  );
};

const StepOne = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Get Redux state
  const { pickupDateTime, returnDateTime, pickupLocation, returnLocation } =
    useSelector((state) => state.carRental);

  const { data: locationData, isLoading } = useGetAllLocationQuery();
  const locations = locationData?.data?.result || [];

  // Initialize form with Redux values
  useEffect(() => {
    form.setFieldsValue({
      pickupTime: pickupDateTime,
      returnTime: returnDateTime,
      pickupLocation: pickupLocation,
      returnLocation: returnLocation,
    });
  }, [form, pickupDateTime, returnDateTime, pickupLocation, returnLocation]);

  // Set default values on component mount if not already set
  useEffect(() => {
    if (!pickupDateTime || !returnDateTime) {
      const now = dayjs();
      const defaultReturnTime = now.add(3, "hour");

      if (!pickupDateTime) {
        dispatch(setPickupDateTime(now.format("MM/DD/YYYY hh:mm a")));
      }
      if (!returnDateTime) {
        dispatch(
          setReturnDateTime(defaultReturnTime.format("MM/DD/YYYY hh:mm a"))
        );
      }
    }
  }, [dispatch, pickupDateTime, returnDateTime]);

  const handlePickupTimeChange = (time) => {
    if (time) {
      const formattedTime =
        typeof time === "string" ? time : time.format("MM/DD/YYYY hh:mm a");
      dispatch(setPickupDateTime(formattedTime));

      // Auto-set return time to 3 hours later
      const returnDateTime = (
        typeof time === "string" ? dayjs(time) : time
      ).add(3, "hour");
      dispatch(setReturnDateTime(returnDateTime.format("MM/DD/YYYY hh:mm a")));

      // Update form fields
      form.setFieldsValue({
        pickupTime: formattedTime,
        returnTime: returnDateTime.format("MM/DD/YYYY hh:mm a"),
      });
    }
  };

  const handleReturnTimeChange = (time) => {
    if (time) {
      const formattedTime =
        typeof time === "string" ? time : time.format("MM/DD/YYYY hh:mm a");
      dispatch(setReturnDateTime(formattedTime));
      form.setFieldsValue({
        returnTime: formattedTime,
      });
    }
  };

  const handlePickupLocationChange = (locationId) => {
    dispatch(setPickupLocation(locationId));
  };

  const handleReturnLocationChange = (locationId) => {
    dispatch(setReturnLocation(locationId));
  };

  // Recalculate totals when values change
  useEffect(() => {
    dispatch(calculateTotals());
  }, [
    dispatch,
    pickupDateTime,
    returnDateTime,
    pickupLocation,
    returnLocation,
  ]);

  return (
    <div className="w-full">
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("Step One Form Values:", values);
          console.log("Redux State:", {
            pickupDateTime,
            returnDateTime,
            pickupLocation,
            returnLocation,
          });
        }}
      >
        {/* Date & Time Pickers */}
        <div className="w-full flex justify-between gap-6">
          <Form.Item
            label="Pick-up Date & Time"
            name="pickupTime"
            className="w-1/2"
            rules={[
              {
                required: true,
                message: "Please select pickup date and time!",
              },
            ]}
          >
            <DateTimePicker
              value={pickupDateTime}
              onChange={handlePickupTimeChange}
              placeholder="Select pickup date & time"
              isPickup={true}
            />
          </Form.Item>

          <Form.Item
            label="Return Date & Time"
            name="returnTime"
            className="w-1/2"
            rules={[
              {
                required: true,
                message: "Please select return date and time!",
              },
            ]}
          >
            <DateTimePicker
              value={returnDateTime}
              onChange={handleReturnTimeChange}
              placeholder="Select return date & time"
              isPickup={false}
              pickupTime={pickupDateTime}
            />
          </Form.Item>
        </div>

        {/* Location Selects */}
        <div className="w-full flex justify-between gap-6">
          <Form.Item
            label="Pick-up Location"
            name="pickupLocation"
            className="w-1/2"
            rules={[
              { required: true, message: "Please select pickup location!" },
            ]}
          >
            <Select
              placeholder="Select pick-up location"
              className="h-10 w-full"
              loading={isLoading}
              value={pickupLocation}
              onChange={handlePickupLocationChange}
            >
              {locations.map((loc) => (
                <Option key={loc._id} value={loc._id}>
                  {loc.location}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Return Location"
            name="returnLocation"
            className="w-1/2"
            rules={[
              { required: true, message: "Please select return location!" },
            ]}
          >
            <Select
              placeholder="Select return location"
              className="h-10 w-full"
              loading={isLoading}
              value={returnLocation}
              onChange={handleReturnLocationChange}
            >
              {locations.map((loc) => (
                <Option key={loc._id} value={loc._id}>
                  {loc.location}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default StepOne;
