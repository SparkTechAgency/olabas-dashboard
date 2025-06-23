import { Modal, Typography, Button, Image } from "antd";
import { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getImageUrl } from "../../../utils/baseUrl";

const { Title, Text } = Typography;

const VehicleInfoModal = ({ visible, onCancel, vehicleData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get images array - handle both single image string and array of images
  const getImages = () => {
    if (!vehicleData?.image) return [];

    // If it's already an array, return it
    if (Array.isArray(vehicleData.image)) {
      return vehicleData.image;
    }

    // If it's a string, convert to array
    return [vehicleData.image];
  };

  const images = getImages();
  const imageCount = images.length;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const getImageUrls = (imagePath) => {
    return `${getImageUrl}${imagePath}`;
  };

  return (
    <Modal
      open={visible}
      onCancel={() => {
        setCurrentImageIndex(0); // Reset image index when closing
        onCancel();
      }}
      footer={null}
      width={900}
      centered
      destroyOnClose
      closeIcon={<span className="text-green-500 text-lg font-bold">×</span>}
      className="custom-vehicle-modal"
    >
      <Title level={4} className="mb-4 text-gray-800">
        Vehicle Info
      </Title>

      {vehicleData ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Vehicle Images Gallery */}
          <div className="lg:w-1/2">
            {imageCount > 0 ? (
              <div className="relative">
                {/* Image Count Badge */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm z-10">
                  {currentImageIndex + 1} / {imageCount}
                </div>

                {/* Main Image Container with Fixed Aspect Ratio */}
                <div className="relative pb-[56.25%] bg-gray-100 rounded-md overflow-hidden">
                  {/* Main Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={getImageUrls(images[currentImageIndex])}
                      alt={`Vehicle image ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                      preview={{
                        mask: <div className="text-white">Preview</div>,
                      }}
                    />
                  </div>

                  {/* Navigation arrows - only show if multiple images */}
                  {imageCount > 1 && (
                    <>
                      <Button
                        icon={<LeftOutlined />}
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 border-none text-white hover:bg-opacity-70"
                        shape="circle"
                      />
                      <Button
                        icon={<RightOutlined />}
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 border-none text-white hover:bg-opacity-70"
                        shape="circle"
                      />
                    </>
                  )}
                </div>

                {/* Thumbnail strip - only show if multiple images */}
                {imageCount > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto py-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative flex-shrink-0 cursor-pointer border-2 rounded ${
                          index === currentImageIndex
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        style={{ width: "80px", height: "60px" }}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={getImageUrls(image)}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Images count info */}
                <div className="mt-2 text-center">
                  <Text className="text-gray-600 text-sm">
                    {imageCount === 1
                      ? "1 Image Available"
                      : `${imageCount} Images Available`}
                  </Text>
                </div>
              </div>
            ) : (
              <div className="w-full h-80 bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-gray-400 text-4xl mb-2">📷</div>
                  <Text className="text-gray-500">No images available</Text>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="lg:w-1/2">
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Vehicle Details
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <InfoCard
                  label="Vehicle ID"
                  value={vehicleData.vehicleId}
                  icon="🚗"
                />
                <InfoCard
                  label="Vehicle Name"
                  value={vehicleData.vehicleName}
                  icon="📝"
                />
                <InfoCard
                  label="Vehicle Type"
                  value={vehicleData.vehicleType}
                  icon="🚙"
                />
                <InfoCard
                  label="Vehicle Model"
                  value={vehicleData.vehicleModel}
                  icon="🏷️"
                />
                <InfoCard label="Brand" value={vehicleData.brand} icon="🔖" />
                <InfoCard
                  label="License Plate"
                  value={vehicleData.licensePlate}
                  icon="🔢"
                />
                <InfoCard
                  label="Daily Rate"
                  value={vehicleData.dailyRate}
                  icon="💰"
                />

                <div className="border-t border-gray-200 pt-3 mt-4">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Technical Specifications
                  </h4>
                  <div className="space-y-3">
                    <InfoCard
                      label="Fuel Type"
                      value={vehicleData.fuelType}
                      icon="⛽"
                    />
                    <InfoCard
                      label="Engine Type"
                      value={vehicleData.engineType}
                      icon="🔧"
                    />
                    <InfoCard
                      label="Engine Number"
                      value={vehicleData.engineNumber}
                      icon="🔗"
                    />
                    <InfoCard
                      label="Transmission Type"
                      value={vehicleData.transmissionType}
                      icon="⚙️"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-4">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Capacity & Features
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <InfoCard
                      label="Seats"
                      value={vehicleData.numberOfSeats}
                      icon="💺"
                      compact
                    />
                    <InfoCard
                      label="Doors"
                      value={vehicleData.numberOfDoors}
                      icon="🚪"
                      compact
                    />
                    <InfoCard
                      label="Luggage"
                      value={vehicleData.numberOfLuggage}
                      icon="🧳"
                      compact
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Text>No vehicle data available.</Text>
        </div>
      )}
    </Modal>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="flex flex-col">
    <Text strong className="text-gray-800">
      {label}:
    </Text>
    <Text className="text-gray-700 ml-1">{value || "N/A"}</Text>
  </div>
);

export default VehicleInfoModal;
