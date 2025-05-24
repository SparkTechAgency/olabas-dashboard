// import React from "react";
// import { Modal, Descriptions, Typography } from "antd";

// const { Title } = Typography;

// const VehicleInfoModal = ({ visible, onCancel, vehicleData }) => {
//   return (
//     <Modal
//       title={<Title level={4}>Vehicle Information</Title>}
//       visible={visible}
//       onCancel={onCancel}
//       footer={null}
//       width={800}
//       centered
//     >
//       <Descriptions
//         bordered
//         column={{
//           xxl: 2,
//           xl: 2,
//           lg: 2,
//           md: 2,
//           sm: 1,
//           xs: 1,
//         }}
//       >
//         <Descriptions.Item label="Vehicle ID">
//           {vehicleData.vehicleId}
//         </Descriptions.Item>
//         <Descriptions.Item label="Vehicle Name">
//           {vehicleData.vehicleName}
//         </Descriptions.Item>
//         <Descriptions.Item label="Vehicle Type">
//           {vehicleData.vehicleType}
//         </Descriptions.Item>
//         <Descriptions.Item label="Vehicle Model">
//           {vehicleData.vehicleModel}
//         </Descriptions.Item>
//         <Descriptions.Item label="Engine Type">
//           {vehicleData.engineType}
//         </Descriptions.Item>
//         <Descriptions.Item label="License Plate">
//           {vehicleData.licensePlate}
//         </Descriptions.Item>
//         <Descriptions.Item label="Engine Number">
//           {vehicleData.engineNumber}
//         </Descriptions.Item>
//         <Descriptions.Item label="Fuel Type">
//           {vehicleData.fuelType}
//         </Descriptions.Item>
//         <Descriptions.Item label="Transmission Type">
//           {vehicleData.transmissionType}
//         </Descriptions.Item>
//         <Descriptions.Item label="Number of Seats">
//           {vehicleData.numberOfSeats}
//         </Descriptions.Item>
//         <Descriptions.Item label="Number of Doors">
//           {vehicleData.numberOfDoors}
//         </Descriptions.Item>
//         <Descriptions.Item label="Number of Luggage">
//           {vehicleData.numberOfLuggage}
//         </Descriptions.Item>
//         <Descriptions.Item label="Daily Rate">
//           {vehicleData.dailyRate}
//         </Descriptions.Item>
//       </Descriptions>
//     </Modal>
//   );
// };

// export default VehicleInfoModal;

import React from "react";
import { Modal, Typography } from "antd";

const { Title, Text } = Typography;

const VehicleInfoModal = ({ visible, onCancel, vehicleData }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
      destroyOnClose
      closeIcon={<span className="text-green-500 text-lg font-bold">×</span>}
      className="custom-vehicle-modal"
    >
      <Title level={4} className="mb-4 text-gray-800">
        Vehicle Info
      </Title>

      {vehicleData ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Vehicle Image */}
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1616627984619-9a15f603c82b" // Replace with actual image URL
              alt="Vehicle"
              className="rounded-md object-cover w-full h-full"
            />
          </div>

          {/* Vehicle Info */}
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-[15px]">
            <Info label="Vehicle ID" value={vehicleData.vehicleId} />
            <Info label="Fuel Type" value={vehicleData.fuelType} />
            <Info label="Vehicle Name" value={vehicleData.vehicleName} />
            <Info
              label="Transmission Type"
              value={vehicleData.transmissionType}
            />
            <Info label="Vehicle Type" value={vehicleData.vehicleType} />
            <Info label="Number of Seats" value={vehicleData.numberOfSeats} />
            <Info label="Vehicle Model" value={vehicleData.vehicleModel} />
            <Info label="Number of doors" value={vehicleData.numberOfDoors} />
            <Info label="Engine Type" value={vehicleData.engineType} />
            <Info
              label="Number of Luggage"
              value={vehicleData.numberOfLuggage}
            />
            <Info label="License Plate" value={vehicleData.licensePlate} />
            <Info label="Daily Rate" value={vehicleData.dailyRate} />
            <Info label="Engine Number" value={vehicleData.engineNumber} />
          </div>
        </div>
      ) : (
        <Text>No vehicle data available.</Text>
      )}
    </Modal>
  );
};

const Info = ({ label, value }) => (
  <div>
    <Text strong>{label}:</Text> <Text className="text-gray-700">{value}</Text>
  </div>
);

export default VehicleInfoModal;
