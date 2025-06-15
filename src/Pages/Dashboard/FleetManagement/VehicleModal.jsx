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
} from "antd";
import {
  useCreateFleetMutation,
  useUpdateFleetMutation,
  useDeleteFleetMutation,
} from "../../../redux/apiSlices/fleetManagement";
import { useEffect, useState } from "react";
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

  // Store the actual file separately for better control
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const carType = [
    { label: "Large: Premium", value: "LARGE PREMIUM" },
    { label: "Large: Station wagon", value: "LARGE STATION WAGON" },
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

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isModalOpen) {
      setUploadedFile(null);
      setFileList([]);
    }
  }, [isModalOpen]);

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
      // Reset file states for edit mode
      setUploadedFile(null);
      setFileList([]);
    } else if (mode === "add") {
      form.resetFields();
      setUploadedFile(null);
      setFileList([]);
    }
  }, [mode, vehicleData, isModalOpen, form]);

  const onFinish = async (values) => {
    try {
      console.log("=== FORM SUBMISSION DEBUG ===");
      console.log("Form values:", values);
      console.log("Uploaded file state:", uploadedFile);
      console.log("File list state:", fileList);
      console.log("Mode:", mode);

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

      // Handle image upload
      if (mode === "add") {
        if (!uploadedFile) {
          message.error("Please upload a vehicle image");
          return;
        }
        console.log("Adding image for CREATE:", uploadedFile);
        formData.append("image", uploadedFile);
      } else if (mode === "edit") {
        if (uploadedFile) {
          console.log("Adding NEW image for UPDATE:", uploadedFile);
          formData.append("image", uploadedFile);
        } else {
          console.log("No new image uploaded for UPDATE, keeping existing");
        }
      }

      // Debug FormData contents
      console.log("=== FORMDATA DEBUG ===");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      let res;
      if (mode === "add") {
        console.log("Calling CREATE API...");
        res = await createFleet(formData).unwrap();
      } else {
        console.log("Calling UPDATE API...");
        res = await updateFleet({
          id: vehicleData._id,
          updatedData: formData,
        }).unwrap();
      }

      console.log("API Response:", res);

      if (res.success) {
        message.success(
          mode === "add"
            ? "Fleet created successfully"
            : "Fleet updated successfully"
        );
        form.resetFields();
        setUploadedFile(null);
        setFileList([]);
        handleOk();
      } else {
        message.error(
          mode === "add" ? "Failed to create fleet" : "Failed to update fleet"
        );
      }
    } catch (err) {
      console.error("API Error:", err);
      message.error(err?.data?.message || "Something went wrong");
    }
  };

  // Custom upload props
  const uploadProps = {
    name: "vehicleImage",
    listType: "picture",
    maxCount: 1,
    fileList: fileList,
    beforeUpload: (file) => {
      console.log("=== BEFORE UPLOAD DEBUG ===");
      console.log("File object:", file);
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });

      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      // Store the actual file
      setUploadedFile(file);
      console.log("File stored in state:", file);

      // Update file list for display
      const newFileList = [
        {
          uid: file.uid || Date.now().toString(),
          name: file.name,
          status: "done",
          originFileObj: file,
        },
      ];
      setFileList(newFileList);
      console.log("Updated file list:", newFileList);

      // Prevent automatic upload
      return false;
    },
    onChange: (info) => {
      console.log("=== UPLOAD CHANGE DEBUG ===");
      console.log("Upload info:", info);
      console.log("File list:", info.fileList);

      // Sync the fileList state
      setFileList(info.fileList);

      // If file is removed, clear the uploaded file
      if (info.fileList.length === 0) {
        setUploadedFile(null);
        console.log("File removed, cleared uploaded file state");
      }
    },
    onRemove: (file) => {
      console.log("=== FILE REMOVE DEBUG ===");
      console.log("Removing file:", file);
      setUploadedFile(null);
      setFileList([]);
      return true;
    },
    accept: "image/*",
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: true,
    },
  };

  const modalTitle = mode === "add" ? "Add New Vehicle" : "Edit Vehicle";

  return (
    <Modal
      title={modalTitle}
      open={isModalOpen}
      onCancel={() => {
        handleCancel();
        setUploadedFile(null);
        setFileList([]);
      }}
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
            rules={[{ required: true }, { type: "number", min: 1, max: 7 }]}
          >
            <InputNumber min={1} max={7} className="w-full" />
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
          <div>
            <label className="block text-sm font-medium mb-2">
              Vehicle Image {mode === "edit" ? "(Upload to change)" : ""}
              {mode === "add" && <span className="text-red-500"> *</span>}
            </label>

            <Upload {...uploadProps}>
              <Button>
                {mode === "edit" ? "Upload New Image" : "Choose File"}
              </Button>
            </Upload>

            {/* Show current image for edit mode */}
            {mode === "edit" && vehicleData?.image && !uploadedFile && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-2">
                  Current Image:
                </label>
                <img
                  src={`${getImageUrl}${vehicleData.image}`}
                  alt="Current vehicle"
                  className="w-20 h-20 object-cover rounded border"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a new image above to replace this one
                </p>
              </div>
            )}

            {/* Show upload status */}
            {uploadedFile && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">
                  ✓ New image ready: {uploadedFile.name}
                </p>
              </div>
            )}

            {/* Validation message for add mode */}
            {mode === "add" && !uploadedFile && (
              <p className="text-xs text-gray-500 mt-1">
                Please upload a vehicle image
              </p>
            )}
          </div>

          <div className="flex gap-6 h-fit">
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
          {/* Debug info */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-500">
              Debug:{" "}
              {uploadedFile
                ? `File ready: ${uploadedFile.name}`
                : "No file selected"}
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex gap-3 ml-auto">
            <Button
              onClick={() => {
                handleCancel();
                setUploadedFile(null);
                setFileList([]);
              }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              className="bg-smart text-white"
              disabled={mode === "add" && !uploadedFile}
            >
              {mode === "add" ? "Save" : "Update"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default VehicleModal;
