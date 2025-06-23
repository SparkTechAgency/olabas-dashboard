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
import { useEffect, useState } from "react";
import { getImageUrl } from "../../../utils/baseUrl";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

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

  // Store multiple files for better control
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  // New state for managing existing images in edit mode
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

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
      setUploadedFiles([]);
      setFileList([]);
      setErrorMessages([]);
      setSubmitLoading(false);
      setExistingImages([]);
      setImagesToDelete([]);
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

      // Handle existing images - assuming vehicleData.images is an array
      // If it's a single image string, convert it to array
      if (vehicleData.image) {
        const imageArray = Array.isArray(vehicleData.image)
          ? vehicleData.image
          : [vehicleData.image];
        setExistingImages(
          imageArray.map((img, index) => ({
            id: `existing_${index}`,
            url: img,
            isExisting: true,
          }))
        );
      }

      // Reset file states for edit mode
      setUploadedFiles([]);
      setFileList([]);
      setImagesToDelete([]);
    } else if (mode === "add") {
      form.resetFields();
      setUploadedFiles([]);
      setFileList([]);
      setExistingImages([]);
      setImagesToDelete([]);
    }
  }, [mode, vehicleData, isModalOpen, form]);

  // Helper function to parse and format error messages
  const parseErrorMessages = (error) => {
    console.log("Parsing error:", error);

    // Clear previous errors
    setErrorMessages([]);

    // Check if it's a validation error with errorMessages array
    if (error?.data?.errorMessages && Array.isArray(error.data.errorMessages)) {
      const formattedErrors = error.data.errorMessages.map((err) => {
        if (err.path && err.message) {
          return `${err.path}: ${err.message}`;
        }
        return err.message || JSON.stringify(err);
      });
      setErrorMessages(formattedErrors);
      return formattedErrors;
    }

    // Check if there's a stack message (like the one in your screenshot)
    if (error?.data?.stack) {
      // Extract the meaningful part of the stack message
      const stackMessage = error.data.stack;
      const match = stackMessage.match(
        /ValidationError: Vehicle validation failed: (.+?) at/
      );
      if (match) {
        const errorPart = match[1];
        // Split by field names and clean up
        const fieldErrors = errorPart
          .split(/(?=\w+:)/)
          .map((err) => err.trim())
          .filter(Boolean);
        setErrorMessages(fieldErrors);
        return fieldErrors;
      }
      setErrorMessages([stackMessage]);
      return [stackMessage];
    }

    // Fallback to generic message
    const fallbackMessage =
      error?.data?.message || error?.message || "Something went wrong";
    setErrorMessages([fallbackMessage]);
    return [fallbackMessage];
  };

  // Function to handle individual image deletion
  const handleDeleteExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    const imageToDelete = existingImages.find((img) => img.id === imageId);
    if (imageToDelete) {
      setImagesToDelete((prev) => [...prev, imageToDelete.url]);
    }
  };

  // Function to handle individual new image replacement
  const handleReplaceImage = (index, file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    const isLt15M = file.size / 1024 / 1024 < 15;
    if (!isLt15M) {
      message.error("Image must be smaller than 15MB!");
      return;
    }

    // Replace the file at specific index
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = file;
      return newFiles;
    });

    setFileList((prev) => {
      const newList = [...prev];
      newList[index] = {
        uid: file.uid || `${Date.now()}-${Math.random()}`,
        name: file.name,
        status: "done",
        originFileObj: file,
      };
      return newList;
    });
  };

  // Function to add new image
  const handleAddNewImage = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt15M = file.size / 1024 / 1024 < 15;
    if (!isLt15M) {
      message.error("Image must be smaller than 15MB!");
      return false;
    }

    const totalImages = existingImages.length + uploadedFiles.length;
    if (totalImages >= 10) {
      message.error("Maximum 10 images allowed!");
      return false;
    }

    setUploadedFiles((prev) => [...prev, file]);
    setFileList((prev) => [
      ...prev,
      {
        uid: file.uid || `${Date.now()}-${Math.random()}`,
        name: file.name,
        status: "done",
        originFileObj: file,
      },
    ]);

    return false; // Prevent automatic upload
  };

  // Function to remove new uploaded image
  const handleRemoveNewImage = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setFileList((prev) => prev.filter((_, i) => i !== index));
  };

  // const onFinish = async (values) => {
  //   try {
  //     setSubmitLoading(true);
  //     setErrorMessages([]); // Clear previous errors

  //     console.log("=== FORM SUBMISSION DEBUG ===");
  //     console.log("Form values:", values);
  //     console.log("Uploaded files state:", uploadedFiles);
  //     console.log("Existing images:", existingImages);
  //     console.log("Images to delete:", imagesToDelete);
  //     console.log("Mode:", mode);

  //     const formData = new FormData();
  //     const vehicleType = values.carType;

  //     // Ensure dailyRate is a number
  //     const dailyRate =
  //       typeof values.dailyRate === "string"
  //         ? parseFloat(values.dailyRate)
  //         : values.dailyRate;

  //     const vehiclePayload = {
  //       vehicleType: vehicleType,
  //       name: values.name,
  //       model: values.model,
  //       brand: values.brand,
  //       transmissionType: values.transmissionType.toUpperCase(),
  //       shortDescription: values.shortDescription,
  //       licenseNumber: values.licensePlate,
  //       vin: values.vin,
  //       fuelType: values.fuelType.toUpperCase(),
  //       noOfSeats: values.numberOfSeats,
  //       noOfDoors: values.numberOfDoors,
  //       noOfLuggages: values.numberOfLuggage,
  //       dailyRate: dailyRate,
  //       status: values.status.toUpperCase(),
  //     };

  //     // Add images to delete for edit mode
  //     if (mode === "edit" && imagesToDelete.length > 0) {
  //       vehiclePayload.imagesToDelete = imagesToDelete;
  //     }

  //     formData.append("data", JSON.stringify(vehiclePayload));

  //     // Handle multiple image uploads
  //     if (mode === "add") {
  //       if (uploadedFiles.length === 0) {
  //         message.error("Please upload at least one vehicle image");
  //         return;
  //       }
  //       console.log("Adding images for CREATE:", uploadedFiles);
  //       uploadedFiles.forEach((file, index) => {
  //         formData.append("image", file);
  //       });
  //     } else if (mode === "edit") {
  //       if (uploadedFiles.length > 0) {
  //         console.log("Adding NEW images for UPDATE:", uploadedFiles);
  //         uploadedFiles.forEach((file, index) => {
  //           formData.append("image", file);
  //         });
  //       }

  //       // Check if we have at least one image remaining
  //       const totalRemainingImages =
  //         existingImages.length + uploadedFiles.length;
  //       if (totalRemainingImages === 0) {
  //         message.error("Please keep at least one vehicle image");
  //         return;
  //       }
  //     }

  //     // Debug FormData contents
  //     console.log("=== FORMDATA DEBUG ===");
  //     for (let [key, value] of formData.entries()) {
  //       if (value instanceof File) {
  //         console.log(`${key}:`, {
  //           name: value.name,
  //           size: value.size,
  //           type: value.type,
  //           lastModified: value.lastModified,
  //         });
  //       } else {
  //         console.log(`${key}:`, value);
  //       }
  //     }

  //     let res;
  //     if (mode === "add") {
  //       console.log("Calling CREATE API...");
  //       res = await createFleet(formData).unwrap();
  //     } else {
  //       console.log("Calling UPDATE API...");
  //       res = await updateFleet({
  //         id: vehicleData._id,
  //         updatedData: formData,
  //       }).unwrap();
  //     }

  //     console.log("API Response:", res);

  //     if (res.success) {
  //       message.success(
  //         mode === "add"
  //           ? "Fleet created successfully"
  //           : "Fleet updated successfully"
  //       );
  //       form.resetFields();
  //       setUploadedFiles([]);
  //       setFileList([]);
  //       setExistingImages([]);
  //       setImagesToDelete([]);
  //       setErrorMessages([]);
  //       handleOk();
  //     } else {
  //       const errorMsg =
  //         res.message ||
  //         (mode === "add"
  //           ? "Failed to create fleet"
  //           : "Failed to update fleet");
  //       message.error(errorMsg);
  //       if (res.errorMessages) {
  //         setErrorMessages(res.errorMessages.map((err) => err.message || err));
  //       }
  //     }
  //   } catch (err) {
  //     console.error("API Error:", err);

  //     // Parse and display detailed error messages
  //     const errorMessages = parseErrorMessages(err);

  //     // Show the first error as a toast message
  //     if (errorMessages.length > 0) {
  //       message.error(errorMessages[0]);
  //     } else {
  //       message.error("Something went wrong");
  //     }
  //   } finally {
  //     setSubmitLoading(false);
  //   }
  // };

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      setErrorMessages([]);

      console.log("=== FORM SUBMISSION DEBUG ===");
      console.log("Form values:", values);
      console.log("Uploaded files state:", uploadedFiles);
      console.log("Existing images:", existingImages);
      console.log("Images to delete:", imagesToDelete);
      console.log("Mode:", mode);

      const formData = new FormData();
      const vehicleType = values.carType;

      // Ensure dailyRate is a number
      const dailyRate =
        typeof values.dailyRate === "string"
          ? parseFloat(values.dailyRate)
          : values.dailyRate;

      // Get URLs of remaining existing images (those not marked for deletion)
      const remainingExistingImages = existingImages
        .filter((img) => !imagesToDelete.includes(img.url))
        .map((img) => img.url);

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
        // Include remaining existing images
        image: remainingExistingImages,
      };

      // Add images to delete for edit mode
      if (mode === "edit" && imagesToDelete.length > 0) {
        vehiclePayload.imagesToDelete = imagesToDelete;
      }

      formData.append("data", JSON.stringify(vehiclePayload));

      // Handle multiple image uploads
      if (mode === "add") {
        if (uploadedFiles.length === 0) {
          message.error("Please upload at least one vehicle image");
          return;
        }
        console.log("Adding images for CREATE:", uploadedFiles);
        uploadedFiles.forEach((file) => {
          formData.append("image", file);
        });
      } else if (mode === "edit") {
        if (uploadedFiles.length > 0) {
          console.log("Adding NEW images for UPDATE:", uploadedFiles);
          uploadedFiles.forEach((file) => {
            formData.append("image", file);
          });
        }

        // Check if we have at least one image remaining
        const totalRemainingImages =
          remainingExistingImages.length + uploadedFiles.length;
        if (totalRemainingImages === 0) {
          message.error("Please keep at least one vehicle image");
          return;
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
        setUploadedFiles([]);
        setFileList([]);
        setExistingImages([]);
        setImagesToDelete([]);
        setErrorMessages([]);
        handleOk();
      } else {
        const errorMsg =
          res.message ||
          (mode === "add"
            ? "Failed to create fleet"
            : "Failed to update fleet");
        message.error(errorMsg);
        if (res.errorMessages) {
          setErrorMessages(res.errorMessages.map((err) => err.message || err));
        }
      }
    } catch (err) {
      console.error("API Error:", err);

      // Parse and display detailed error messages
      const errorMessages = parseErrorMessages(err);

      // Show the first error as a toast message
      if (errorMessages.length > 0) {
        message.error(errorMessages[0]);
      } else {
        message.error("Something went wrong");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const modalTitle = mode === "add" ? "Add New Vehicle" : "Edit Vehicle";

  return (
    <Modal
      title={modalTitle}
      open={isModalOpen}
      onCancel={() => {
        handleCancel();
        setUploadedFiles([]);
        setFileList([]);
        setExistingImages([]);
        setImagesToDelete([]);
        setErrorMessages([]);
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
            rules={[
              { required: true, message: "Please enter number of seats" },
              {
                type: "number",
                min: 1,
                max: 7,
                message: "Number of seats must be between 1 and 7",
              },
            ]}
          >
            <InputNumber
              min={1}
              max={40}
              className="w-full"
              controls={false}
              placeholder="1-7"
            />
          </Form.Item>
          <Form.Item
            label="Number of Door"
            name="numberOfDoors"
            rules={[
              { required: true, message: "Please enter number of doors" },
              {
                type: "number",
                min: 1,
                max: 10,
                message: "Number of doors must be between 1 and 10",
              },
            ]}
          >
            <InputNumber
              min={1}
              max={10}
              className="w-full"
              controls={false}
              placeholder="2-4"
            />
          </Form.Item>
          <Form.Item
            label="Number of Luggage"
            name="numberOfLuggage"
            rules={[
              {
                required: true,
                message: "Please enter number of luggage spaces",
              },
              {
                type: "number",
                min: 0,
                max: 20,
                message: "Number of luggage spaces must be between 0 and 20",
              },
            ]}
          >
            <InputNumber
              min={0}
              max={20}
              className="w-full"
              placeholder="0-5"
              controls={false}
            />
          </Form.Item>
        </div>

        {/* Vehicle Images and Daily Rate */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Vehicle Images (Max 10)
              {mode === "add" && <span className="text-red-500"> *</span>}
            </label>

            {/* Images Container */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {/* Existing Images + New Images */}
              <div
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "thin" }}
              >
                {/* Show existing images in edit mode */}
                {mode === "edit" &&
                  existingImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="flex-shrink-0 relative group"
                    >
                      <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <img
                          src={`${getImageUrl}${image.url}`}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Popconfirm
                        title="Delete this image?"
                        description="Are you sure you want to delete this image?"
                        onConfirm={() => handleDeleteExistingImage(image.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          size="small"
                          type="primary"
                          danger
                          icon={<DeleteOutlined />}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            minWidth: "24px",
                            height: "24px",
                            padding: "0",
                          }}
                        />
                      </Popconfirm>
                      <p className="text-xs text-center mt-1 text-gray-600">
                        Current {index + 1}
                      </p>
                    </div>
                  ))}

                {/* Show new uploaded images */}
                {uploadedFiles.map((file, index) => (
                  <div
                    key={`new_${index}`}
                    className="flex-shrink-0 relative group"
                  >
                    <div className="w-20 h-20 border border-green-300 rounded-lg overflow-hidden bg-white">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ minWidth: "24px", height: "24px", padding: "0" }}
                    />
                    <p className="text-xs text-center mt-1 text-green-600">
                      New {index + 1}
                    </p>
                  </div>
                ))}

                {/* Add new image button */}
                {existingImages.length + uploadedFiles.length < 10 && (
                  <div className="flex-shrink-0">
                    <Upload
                      accept="image/*"
                      beforeUpload={handleAddNewImage}
                      showUploadList={false}
                      maxCount={10}
                      multiple={true}
                    >
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors">
                        <PlusOutlined className="text-gray-400 text-lg" />
                      </div>
                    </Upload>
                    <p className="text-xs text-center mt-1 text-gray-500">
                      Add Image
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Summary */}
              <div className="mt-3 text-xs text-gray-600">
                <p>
                  Total Images: {existingImages.length + uploadedFiles.length}
                  /10
                  {mode === "edit" && (
                    <>
                      {" "}
                      ({existingImages.length} existing, {uploadedFiles.length}{" "}
                      new)
                    </>
                  )}
                </p>
                <p className="text-gray-500">
                  Click + to add images • Max 15MB each • JPG, PNG, GIF
                  supported
                </p>
              </div>

              {/* Validation message for add mode */}
              {mode === "add" && uploadedFiles.length === 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  ⚠️ Please upload at least one vehicle image
                </div>
              )}

              {/* Success message when files are ready */}
              {uploadedFiles.length > 0 && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                  ✓ {uploadedFiles.length} new image(s) ready to upload
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 h-fit">
            <Form.Item
              label="Daily Rate"
              name="dailyRate"
              rules={[
                { required: true, message: "Please enter daily rate" },
                {
                  type: "number",
                  min: 0,
                  message: "Daily rate must be a positive number",
                },
              ]}
            >
              <InputNumber
                addonBefore="₦"
                placeholder="0"
                controls={false}
                min={0}
              />
            </Form.Item>
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between">
          {/* Debug info */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-500">
              Debug: Total Images:{" "}
              {existingImages.length + uploadedFiles.length}
              {mode === "edit" && ` (${imagesToDelete.length} to delete)`}
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex gap-3 ml-auto">
            <Button
              onClick={() => {
                handleCancel();
                setUploadedFiles([]);
                setFileList([]);
                setExistingImages([]);
                setImagesToDelete([]);
                setErrorMessages([]);
              }}
              disabled={submitLoading}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              className="bg-smart text-white"
              disabled={
                (mode === "add" && uploadedFiles.length === 0) ||
                (mode === "edit" &&
                  existingImages.length + uploadedFiles.length === 0) ||
                submitLoading
              }
              loading={submitLoading}
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
