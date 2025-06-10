// import React from "react";
// import { Form, Input, Button, DatePicker } from "antd";
// import moment from "moment";
// import { SlCalender } from "react-icons/sl";
// const StepOne = () => {
//   return (
//     <Form
//       layout="vertical"
//       initialValues={{ remember: true }}
//       className="w-full"
//     >
//       {/* Pick-up Date & Time */}
//       <div className="w-full flex justify-between gap-6  ">
//         <Form.Item
//           label="Date & Time (Pick-up)"
//           name="pickupTime"
//           rules={[
//             {
//               required: true,
//               message: "Please select pick-up date and time!",
//             },
//           ]}
//           className="w-1/2"
//         >
//           <DatePicker
//             showTime
//             format="MM/DD/YYYY hh:mm a"
//             defaultValue={moment("2025-03-30 00:00", "YYYY-MM-DD hh:mm")}
//             className="w-full h-8"
//           />
//         </Form.Item>

//         {/* Return Date & Time */}

//         <Form.Item
//           label="Date & Time (Return)"
//           name="returnTime"
//           rules={[
//             {
//               required: true,
//               message: "Please select return date and time!",
//             },
//           ]}
//           className="w-1/2"
//         >
//           <DatePicker
//             showTime
//             format="MM/DD/YYYY hh:mm a"
//             defaultValue={moment("2025-03-30 02:00", "YYYY-MM-DD hh:mm")}
//             className="w-full h-8"
//           />
//         </Form.Item>
//       </div>

//       <div className="w-full flex justify-between gap-6  ">
//         {/* Pick-up Location */}

//         <Form.Item
//           label="Pick-up Location"
//           name="pickupLocation"
//           rules={[
//             { required: true, message: "Please input the pick-up location!" },
//           ]}
//           className="w-1/2"
//         >
//           <Input
//             placeholder="Hogarth Road, London"
//             className="h-8"
//             // addonBefore={<SlCalender />}
//           />
//         </Form.Item>

//         {/* Return Location */}

//         <Form.Item
//           label="Return Location"
//           name="returnLocation"
//           rules={[
//             { required: true, message: "Please input the return location!" },
//           ]}
//           className="w-1/2"
//         >
//           <Input placeholder="Market St., Oxford" className="w-full h-8" />
//         </Form.Item>
//       </div>
//     </Form>
//   );
// };

// export default StepOne;

import React from "react";
import { Form, Input, DatePicker, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  setPickupDateTime,
  setReturnDateTime,
  setPickupLocation,
  setReturnLocation,
} from "../../../redux/features/ReservationSlice";

const { Option } = Select;

const StepOne = () => {
  const dispatch = useDispatch();

  // Get current values from Redux store
  const { pickupDateTime, returnDateTime, pickupLocation, returnLocation } =
    useSelector((state) => state.carRental);

  // Convert string to moment object for DatePicker
  const getDateValue = (dateString) => {
    return dateString ? moment(dateString) : null;
  };

  // Handle date/time changes - store as ISO string
  const handlePickupDateChange = (date) => {
    if (date) {
      dispatch(setPickupDateTime(date.toISOString()));
    } else {
      dispatch(setPickupDateTime(""));
    }
  };

  const handleReturnDateChange = (date) => {
    if (date) {
      dispatch(setReturnDateTime(date.toISOString()));
    } else {
      dispatch(setReturnDateTime(""));
    }
  };

  // Handle location changes - store location ID
  const handlePickupLocationChange = (value) => {
    dispatch(setPickupLocation(value));
  };

  const handleReturnLocationChange = (value) => {
    dispatch(setReturnLocation(value));
  };

  // Mock location data - replace with actual API data
  const locations = [
    { id: "6836f98ad89cc068ae80cbe5", name: "Hogarth Road, London" },
    { id: "6836f98ad89cc068ae80cbe6", name: "Market St., Oxford" },
    { id: "6836f98ad89cc068ae80cbe7", name: "Dhaka Airport" },
    { id: "6836f98ad89cc068ae80cbe8", name: "City Center, Dhaka" },
  ];

  return (
    <Form
      layout="vertical"
      initialValues={{
        pickupTime: getDateValue(pickupDateTime),
        returnTime: getDateValue(returnDateTime),
        pickupLocation: pickupLocation,
        returnLocation: returnLocation,
      }}
      className="w-full"
    >
      {/* Pick-up Date & Time */}
      <div className="w-full flex justify-between gap-6">
        <Form.Item
          label="Date & Time (Pick-up)"
          name="pickupTime"
          rules={[
            {
              required: true,
              message: "Please select pick-up date and time!",
            },
          ]}
          className="w-1/2"
        >
          <DatePicker
            showTime
            format="MM/DD/YYYY hh:mm a"
            value={getDateValue(pickupDateTime)}
            onChange={handlePickupDateChange}
            className="w-full h-8"
            showNow={false}
          />
        </Form.Item>

        {/* Return Date & Time */}
        <Form.Item
          label="Date & Time (Return)"
          name="returnTime"
          rules={[
            {
              required: true,
              message: "Please select return date and time!",
            },
          ]}
          className="w-1/2"
        >
          <DatePicker
            showTime
            format="MM/DD/YYYY hh:mm a"
            value={getDateValue(returnDateTime)}
            onChange={handleReturnDateChange}
            className="w-full h-8"
            showNow={false}
          />
        </Form.Item>
      </div>

      <div className="w-full flex justify-between gap-6">
        {/* Pick-up Location */}
        <Form.Item
          label="Pick-up Location"
          name="pickupLocation"
          rules={[
            { required: true, message: "Please select the pick-up location!" },
          ]}
          className="w-1/2"
        >
          <Select
            placeholder="Select pick-up location"
            value={pickupLocation}
            onChange={handlePickupLocationChange}
            className="h-8"
          >
            {locations.map((location) => (
              <Option key={location.id} value={location.id}>
                {location.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Return Location */}
        <Form.Item
          label="Return Location"
          name="returnLocation"
          rules={[
            { required: true, message: "Please select the return location!" },
          ]}
          className="w-1/2"
        >
          <Select
            placeholder="Select return location"
            value={returnLocation}
            onChange={handleReturnLocationChange}
            className="h-8"
          >
            {locations.map((location) => (
              <Option key={location.id} value={location.id}>
                {location.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
};

export default StepOne;
