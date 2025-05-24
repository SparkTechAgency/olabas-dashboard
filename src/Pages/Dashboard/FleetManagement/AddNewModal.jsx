import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";

function AddNewModal({ isModalOpen, handleOk, handleCancel }) {
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  const carType = [
    { label: "Large: Premium", value: "largePremium" },
    { label: "Large: Station wagon", value: "largeStationWagon" },
    { label: "Medium: Low emission", value: "mediumLowEmission" },
    { label: "Small: Economy", value: "smallEconomy" },
    { label: "Small: Mini", value: "smallMini" },
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

  return (
    <Modal
      title="Add New Vehicle"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={null}
      width={1000}
    >
      <Form layout="vertical">
        {/* Car Type Section */}
        <div className="mb-6">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Car type
              </span>
            }
            name="carType"
          >
            <Checkbox.Group
              options={carType}
              defaultValue={["largePremium"]}
              onChange={onChange}
              className="grid grid-cols-3 gap-2"
            />
          </Form.Item>
        </div>

        {/* Name, Model, Transmission Type Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">Name</span>
            }
            name="name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">Model</span>
            }
            name="model"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Transmission Type
              </span>
            }
            name="transmissionType"
          >
            <Select
              placeholder="Select transmission"
              options={transmissionOptions}
            />
          </Form.Item>
        </div>

        {/* Short Description */}
        <div className="mb-4">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Short Description
              </span>
            }
            name="shortDescription"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>

        {/* License Plate and VIN Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                License Plate
              </span>
            }
            name="licensePlate"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">VIN</span>
            }
            name="vin"
          >
            <Input />
          </Form.Item>
        </div>

        {/* Fuel Type Section */}
        <div className="mb-4">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Fuel type
              </span>
            }
            name="fuelType"
          >
            <Radio.Group
              options={fuelType}
              onChange={onChange}
              className="grid grid-cols-4 gap-2"
            />
          </Form.Item>
        </div>

        {/* Number of Seats, Doors, Luggage Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Number of Seats
              </span>
            }
            name="numberOfSeats"
          >
            <InputNumber
              min={1}
              max={50}
              className="w-full"
              controls={{
                upIcon: "▲",
                downIcon: "▼",
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Number of Door
              </span>
            }
            name="numberOfDoors"
          >
            <InputNumber
              min={1}
              max={10}
              className="w-full"
              controls={{
                upIcon: "▲",
                downIcon: "▼",
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Number of Luggage
              </span>
            }
            name="numberOfLuggage"
          >
            <InputNumber
              min={0}
              max={20}
              className="w-full"
              controls={{
                upIcon: "▲",
                downIcon: "▼",
              }}
            />
          </Form.Item>
        </div>

        {/* Vehicle Image and Daily Rate Row */}
        <div className="grid grid-cols-2 gap-4 ">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Vehicle Image
              </span>
            }
            name="vehicleImage"
          >
            <Upload
              name="vehicleImage"
              listType="text"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button>Choose File</Button>
              <span className="ml-2 text-gray-500">No file chosen</span>
            </Upload>
          </Form.Item>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Daily Rate
              </span>
            }
            name="dailyRate"
          >
            <Input addonBefore="₦" placeholder="0" />
          </Form.Item>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button className="bg-smart text-white" onClick={handleOk}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddNewModal;
