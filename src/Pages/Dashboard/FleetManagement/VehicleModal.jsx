import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Upload,
  Popconfirm,
} from "antd";
import {
  useCreateFleetMutation,
  useUpdateFleetMutation,
  useDeleteFleetMutation,
} from "../../../redux/apiSlices/fleetManagement";
import { useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { getImageUrl } from "../../../utils/baseUrl";

function VehicleModal({
  isModalOpen,
  handleOk,
  handleCancel,
  mode = "add", // "add" or "edit"
  vehicleData = null, // data for editing
}) {
  const [form] = Form.useForm();
  const [createFleet] = useCreateFleetMutation();
  const [updateFleet] = useUpdateFleetMutation();
  const [deleteFleet] = useDeleteFleetMutation();

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

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && vehicleData && isModalOpen) {
      form.setFieldsValue({
        carType: vehicleData.vehicleType,
        name: vehicleData.name,
        model: vehicleData.model,
        brand: vehicleData.brand,
        transmissionType: vehicleData.transmissionType?.toLowerCase(),
        shortDescription: vehicleData.shortDescription,
        licensePlate: vehicleData.licenseNumber,
        vin: vehicleData.vin,
        fuelType: vehicleData.fuelType?.toLowerCase(),
        numberOfSeats: vehicleData.noOfSeats,
        numberOfDoors: vehicleData.noOfDoors,
        numberOfLuggage: vehicleData.noOfLuggages,
        dailyRate: vehicleData.dailyRate,
        status: vehicleData.status,
      });
    } else if (mode === "add") {
      form.resetFields();
    }
  }, [mode, vehicleData, isModalOpen, form]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      const vehicleType = values.carType;

      // Ensure dailyRate is a number
      const dailyRate =
        typeof values.dailyRate === "string"
          ? parseFloat(values.dailyRate)
          : values.dailyRate;

      const vehiclePayload = {
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

      formData.append("data", JSON.stringify(vehiclePayload));

      // Handle image for both add and edit modes
      const imageFile =
        values.vehicleImage?.[0]?.originFileObj || values.vehicleImage?.[0];

      // For add mode, image is required
      if (mode === "add" && !imageFile) {
        message.error("Please upload a vehicle image");
        return;
      }

      // For edit mode, image is optional (only if user wants to change it)
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Create a console-friendly representation
      const consoleData = {
        mode,
        data: vehiclePayload,
        image: imageFile
          ? {
              name: imageFile.name,
              size: imageFile.size,
              type: imageFile.type,
              lastModified: imageFile.lastModified,
            }
          : "No new image",
      };

      console.log("FormData being sent:", consoleData);

      let res;
      if (mode === "add") {
        res = await createFleet(formData).unwrap();
      } else {
        // For edit mode, include the vehicle ID
        // formData.append("id", vehicleData._id || vehicleData.id);
        res = await updateFleet({
          id: vehicleData._id,
          updatedData: formData,
        }).unwrap();
      }

      if (res.success) {
        message.success(
          mode === "add"
            ? "Fleet created successfully"
            : "Fleet updated successfully"
        );
        form.resetFields();
        handleOk();
      } else {
        message.error(
          mode === "add" ? "Failed to create fleet" : "Failed to update fleet"
        );
      }
    } catch (err) {
      console.error(
        `Error ${mode === "add" ? "creating" : "updating"} fleet:`,
        err
      );
      message.error(err?.data?.message || "Something went wrong");
    }
  };

  const modalTitle = mode === "add" ? "Add New Vehicle" : "Edit Vehicle";

  return (
    <Modal
      title={modalTitle}
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
            label={`Vehicle Image ${
              mode === "edit" ? "(Upload to change)" : ""
            }`}
            name="vehicleImage"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={
              mode === "add"
                ? [{ required: true, message: "Please upload a vehicle image" }]
                : [] // Not required for edit mode
            }
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
            {mode === "edit" && vehicleData?.image && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Current Image:
                </label>
                <img
                  src={`${getImageUrl()}${vehicleData.image}`}
                  alt="Current vehicle"
                  className="w-16 h-16 object-cover rounded border"
                />
              </div>
            )}
          </Form.Item>
          <div className=" flex gap-6 h-fit">
            <Form.Item
              label="Daily Rate"
              name="dailyRate"
              rules={[{ required: true }]}
            >
              <Input addonBefore="₦" placeholder="0" type="number" />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              initialValue="Available"
              rules={[{ required: true }]}
              className="w-1/2"
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between ">
          {/* Right side buttons */}
          <div className="flex gap-3 ml-auto">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button htmlType="submit" className="bg-smart text-white">
              {mode === "add" ? "Save" : "Update"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default VehicleModal;
