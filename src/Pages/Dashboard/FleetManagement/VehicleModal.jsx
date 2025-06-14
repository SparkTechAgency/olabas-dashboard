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
import { useEffect } from "react";
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
        // Don't set vehicleImage to avoid confusion with new uploads
        vehicleImage: [],
      });
    } else if (mode === "add") {
      form.resetFields();
    }
  }, [mode, vehicleData, isModalOpen, form]);

  // Improved file handling function
  const getImageFile = (fileList) => {
    console.log("getImageFile called with:", fileList);

    if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
      console.log("No fileList or empty fileList");
      return null;
    }

    // Get the most recent file (last in array)
    const file = fileList[fileList.length - 1];
    console.log("Processing file:", file);

    // For newly uploaded files, prioritize originFileObj
    if (file?.originFileObj instanceof File) {
      console.log("Found originFileObj:", file.originFileObj);
      return file.originFileObj;
    }
    // Direct File instance
    else if (file instanceof File) {
      console.log("Found direct File instance:", file);
      return file;
    }
    // Alternative structure
    else if (file?.file instanceof File) {
      console.log("Found file.file:", file.file);
      return file.file;
    }
    // Check if it's a file object with status (newly uploaded)
    else if (file?.status === "done" && file?.originFileObj) {
      console.log("Found done status file:", file.originFileObj);
      return file.originFileObj;
    }

    console.log("No valid file found");
    return null;
  };

  const onFinish = async (values) => {
    try {
      console.log("Form values:", values);

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

      // Improved image handling for edit mode
      const imageFile = getImageFile(values.vehicleImage);

      console.log("Raw vehicleImage from form:", values.vehicleImage);
      console.log("Extracted imageFile:", imageFile);
      console.log("Mode:", mode);
      console.log("Has existing image:", vehicleData?.image);

      // For add mode, image is required
      if (mode === "add" && !imageFile) {
        message.error("Please upload a vehicle image");
        return;
      }

      // For edit mode, append image only if a new one is uploaded
      if (imageFile && imageFile instanceof File) {
        console.log("Appending NEW image to FormData:", {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type,
          lastModified: imageFile.lastModified,
        });
        formData.append("image", imageFile);
      } else if (mode === "edit") {
        console.log("No new image uploaded, keeping existing image");
      }

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      let res;
      if (mode === "add") {
        res = await createFleet(formData).unwrap();
      } else {
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

  // Custom normalization for file upload
  const normFile = (e) => {
    console.log("Upload event triggered:", e);

    if (Array.isArray(e)) {
      console.log("Event is array:", e);
      return e;
    }

    const fileList = e?.fileList || [];
    console.log("Normalized fileList:", fileList);

    // Filter out files that don't have proper file objects
    const validFiles = fileList.filter((file) => {
      const isValid =
        file?.originFileObj instanceof File ||
        file instanceof File ||
        file?.file instanceof File;
      console.log("File validation:", file, "Valid:", isValid);
      return isValid;
    });

    console.log("Valid files after filtering:", validFiles);
    return validFiles;
  };

  // Custom beforeUpload function for better control
  const beforeUpload = (file) => {
    console.log("beforeUpload called with file:", file);

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

    // Return false to prevent automatic upload
    return false;
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
            getValueFromEvent={normFile}
            rules={
              mode === "add"
                ? [{ required: true, message: "Please upload a vehicle image" }]
                : [] // Not required for edit mode
            }
          >
            <Upload
              name="vehicleImage"
              listType="picture"
              maxCount={1}
              beforeUpload={beforeUpload}
              accept="image/*"
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: true,
              }}
              onChange={(info) => {
                console.log("Upload onChange:", info);
              }}
            >
              <Button>
                {mode === "edit" ? "Upload New Image" : "Choose File"}
              </Button>
            </Upload>
            {mode === "edit" && vehicleData?.image && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-2">
                  Current Image:
                </label>
                <img
                  src={`${getImageUrl}${vehicleData.image}`}
                  alt="Current vehicle"
                  className="w-16 h-16 object-cover rounded border"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a new image above to replace this one
                </p>
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
