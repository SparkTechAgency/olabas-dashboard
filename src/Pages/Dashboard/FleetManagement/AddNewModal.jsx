// import {
//   Button,
//   Checkbox,
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Modal,
//   Radio,
//   Select,
//   Upload,
// } from "antd";
// import { useCreateFleetMutation } from "../../../redux/apiSlices/fleetManagement";
// import { useEffect } from "react";

// function AddNewModal({ isModalOpen, handleOk, handleCancel }) {
//   const [form] = Form.useForm();
//   const [createFleet] = useCreateFleetMutation();

//   const carType = [
//     { label: "Large: Premium", value: "LARGE PREMIUM" },
//     { label: "Large: Station wagon", value: "LARGE_STATION WAGON" },
//     { label: "Medium: Low emission", value: "MEDIUM LOW EMISSION" },
//     { label: "Small: Economy", value: "SMALL ECONOMY" },
//     { label: "Small: Mini", value: "SMALL MINI" },
//   ];

//   const fuelType = [
//     { label: "Diesel", value: "diesel" },
//     { label: "Petrol", value: "petrol" },
//     { label: "Electric", value: "electric" },
//     { label: "Hybrid", value: "hybrid" },
//   ];

//   const transmissionOptions = [
//     { value: "automatic", label: "Automatic" },
//     { value: "manual", label: "Manual" },
//   ];

//   const onFinish = async (values) => {
//     try {
//       const formData = new FormData();

//       const vehicleType = values.carType;

//       // Fix 2: Ensure dailyRate is a number
//       const dailyRate =
//         typeof values.dailyRate === "string"
//           ? parseFloat(values.dailyRate)
//           : values.dailyRate;

//       const vehicleData = {
//         vehicleType: vehicleType,
//         name: values.name,
//         model: values.model,
//         brand: values.brand,
//         transmissionType: values.transmissionType.toUpperCase(),
//         shortDescription: values.shortDescription,
//         licenseNumber: values.licensePlate,
//         vin: values.vin,
//         fuelType: values.fuelType.toUpperCase(),
//         noOfSeats: values.numberOfSeats,
//         noOfDoors: values.numberOfDoors,
//         noOfLuggages: values.numberOfLuggage,
//         dailyRate: dailyRate,
//         status: values.status,
//       };

//       formData.append("data", JSON.stringify(vehicleData));

//       const imageFile = values.vehicleImage?.fileList?.[0]?.originFileObj;
//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       // Create a console-friendly representation
//       const consoleData = {
//         data: vehicleData,
//         image: imageFile
//           ? {
//               name: imageFile.name,
//               size: imageFile.size,
//               type: imageFile.type,
//               lastModified: imageFile.lastModified,
//             }
//           : null,
//       };

//       console.log("FormData being sent:", consoleData);

//       const res = await createFleet(formData).unwrap();

//       if (res.success) {
//         message.success("Fleet created successfully");
//         form.resetFields();
//         handleOk();
//       } else {
//         message.error("Failed to create fleet");
//       }
//     } catch (err) {
//       message.error(err?.data?.message || "Something went wrong");
//     }
//   };
//   return (
//     <Modal
//       title="Add New Vehicle"
//       open={isModalOpen}
//       onCancel={handleCancel}
//       centered
//       footer={null}
//       width={1000}
//     >
//       <Form form={form} layout="vertical" onFinish={onFinish}>
//         {/* Car Type Section */}
//         <Form.Item
//           label="Car type"
//           name="carType"
//           rules={[{ required: true, message: "Please select a car type" }]}
//         >
//           <Radio.Group options={carType} className="grid grid-cols-3 gap-2" />
//         </Form.Item>

//         {/* Name, Model, Transmission Type Row */}
//         <div className="grid grid-cols-3 gap-4 mb-4">
//           <Form.Item label="Name" name="name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item label="Model" name="model" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Transmission Type"
//             name="transmissionType"
//             rules={[{ required: true }]}
//           >
//             <Select
//               placeholder="Select transmission"
//               options={transmissionOptions}
//             />
//           </Form.Item>
//         </div>

//         {/* Short Description */}
//         <Form.Item label="Short Description" name="shortDescription">
//           <Input.TextArea rows={3} />
//         </Form.Item>

//         {/* License Plate and VIN Row */}
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <Form.Item
//             label="License Plate"
//             name="licensePlate"
//             rules={[{ required: true }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item label="VIN" name="vin" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//         </div>

//         {/* Fuel Type */}
//         <Form.Item
//           label="Fuel type"
//           name="fuelType"
//           rules={[{ required: true, message: "Please select a fuel type" }]}
//         >
//           <Radio.Group options={fuelType} className="grid grid-cols-4 gap-2" />
//         </Form.Item>

//         {/* Number of Seats, Doors, Luggage */}
//         <div className="grid grid-cols-3 gap-4 mb-4">
//           <Form.Item
//             label="Number of Seats"
//             name="numberOfSeats"
//             rules={[{ required: true }]}
//           >
//             <InputNumber min={1} max={50} className="w-full" />
//           </Form.Item>
//           <Form.Item
//             label="Number of Door"
//             name="numberOfDoors"
//             rules={[{ required: true }]}
//           >
//             <InputNumber min={1} max={10} className="w-full" />
//           </Form.Item>
//           <Form.Item
//             label="Number of Luggage"
//             name="numberOfLuggage"
//             rules={[{ required: true }]}
//           >
//             <InputNumber min={0} max={20} className="w-full" />
//           </Form.Item>
//         </div>

//         {/* Vehicle Image and Daily Rate */}
//         <div className="grid grid-cols-2 gap-4">
//           <Form.Item
//             label="Vehicle Image"
//             name="vehicleImage"
//             valuePropName="fileList"
//             getValueFromEvent={(e) => e && e.fileList}
//             rules={[
//               { required: true, message: "Please upload a vehicle image" },
//             ]}
//           >
//             <Upload
//               name="vehicleImage"
//               listType="text"
//               maxCount={1}
//               beforeUpload={() => false}
//             >
//               <Button>Choose File</Button>
//             </Upload>
//           </Form.Item>
//           <Form.Item
//             label="Daily Rate"
//             name="dailyRate"
//             rules={[{ required: true }]}
//           >
//             <Input addonBefore="₦" placeholder="0" type="number" />
//           </Form.Item>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 justify-end mt-6">
//           <Button onClick={handleCancel}>Cancel</Button>
//           <Button htmlType="submit" className="bg-smart text-white">
//             Save
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// }

// export default AddNewModal;

import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";
import { useCreateFleetMutation } from "../../../redux/apiSlices/fleetManagement";
import { useEffect } from "react";

function AddNewModal({ isModalOpen, handleOk, handleCancel }) {
  const [form] = Form.useForm();
  const [createFleet] = useCreateFleetMutation();

  const carType = [
    { label: "Large: Premium", value: "LARGE PREMIUM" },
    { label: "Large: Station wagon", value: "LARGE_STATION WAGON" },
    { label: "Medium: Low emission", value: "MEDIUM LOW EMISSION" },
    { label: "Small: Economy", value: "SMALL ECONOMY" },
    { label: "Small: Mini", value: "SMALL MINI" },
  ];

  const fuelType = [
    { label: "Diesel", value: "diesel" },
    { label: "Petrol", value: "petrol" },
    { label: "Electric", value: "electric" },
    { label: "Hybrid", value: "hybrid" },
  ];

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
  ];

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      const vehicleType = values.carType;

      // Fix 2: Ensure dailyRate is a number
      const dailyRate =
        typeof values.dailyRate === "string"
          ? parseFloat(values.dailyRate)
          : values.dailyRate;

      const vehicleData = {
        vehicleType: vehicleType,
        name: values.name,
        model: values.model,
        brand: values.brand,
        transmissionType: values.transmissionType.toUpperCase(),
        shortDescription: values.shortDescription,
        licenseNumber: values.licensePlate,
        vin: values.vin,
        fuelType: values.fuelType.toUpperCase(),
        noOfSeats: values.numberOfSeats,
        noOfDoors: values.numberOfDoors,
        noOfLuggages: values.numberOfLuggage,
        dailyRate: dailyRate,
        status: values.status.toUpperCase(),
      };

      formData.append("data", JSON.stringify(vehicleData));

      // Fix: Properly extract the image file
      const imageFile =
        values.vehicleImage?.[0]?.originFileObj || values.vehicleImage?.[0];

      if (!imageFile) {
        message.error("Please upload a vehicle image");
        return;
      }

      formData.append("image", imageFile);

      // Create a console-friendly representation
      const consoleData = {
        data: vehicleData,
        image: imageFile
          ? {
              name: imageFile.name,
              size: imageFile.size,
              type: imageFile.type,
              lastModified: imageFile.lastModified,
            }
          : null,
      };

      console.log("FormData being sent:", consoleData);

      const res = await createFleet(formData).unwrap();

      if (res.success) {
        message.success("Fleet created successfully");
        form.resetFields();
        handleOk();
      } else {
        message.error("Failed to create fleet");
      }
    } catch (err) {
      console.error("Error creating fleet:", err);
      message.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      title="Add New Vehicle"
      open={isModalOpen}
      onCancel={handleCancel}
      centered
      footer={null}
      width={1000}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Car Type Section */}
        <Form.Item
          label="Car type"
          name="carType"
          rules={[{ required: true, message: "Please select a car type" }]}
        >
          <Radio.Group options={carType} className="grid grid-cols-3 gap-2" />
        </Form.Item>

        {/* Name, Model, Brand, Transmission Type Row */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Model" name="model" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Brand" name="brand" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Transmission Type"
            name="transmissionType"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select transmission"
              options={transmissionOptions}
            />
          </Form.Item>
        </div>

        {/* Short Description */}
        <Form.Item label="Short Description" name="shortDescription">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* License Plate and VIN Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Form.Item
            label="License Plate"
            name="licensePlate"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="VIN" name="vin" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </div>

        {/* Fuel Type */}
        <Form.Item
          label="Fuel type"
          name="fuelType"
          rules={[{ required: true, message: "Please select a fuel type" }]}
        >
          <Radio.Group options={fuelType} className="grid grid-cols-4 gap-2" />
        </Form.Item>

        {/* Number of Seats, Doors, Luggage */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Form.Item
            label="Number of Seats"
            name="numberOfSeats"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={50} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Number of Door"
            name="numberOfDoors"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Number of Luggage"
            name="numberOfLuggage"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={20} className="w-full" />
          </Form.Item>
        </div>

        {/* Vehicle Image and Daily Rate */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Vehicle Image"
            name="vehicleImage"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[
              { required: true, message: "Please upload a vehicle image" },
            ]}
          >
            <Upload
              name="vehicleImage"
              listType="text"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button>Choose File</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Daily Rate"
            name="dailyRate"
            rules={[{ required: true }]}
          >
            <Input addonBefore="₦" placeholder="0" type="number" />
          </Form.Item>
        </div>

        {/* Status Field - Add this if it's required by your backend */}
        <Form.Item
          label="Status"
          name="status"
          initialValue="Available"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select status"
            options={[
              { value: "Available", label: "Available" },
              { value: "Rented", label: "Rented" },
              { value: "Maintenance", label: "Maintenance" },
            ]}
          />
        </Form.Item>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button htmlType="submit" className="bg-smart text-white">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddNewModal;
