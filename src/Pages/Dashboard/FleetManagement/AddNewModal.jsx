import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
} from "antd";
import React from "react";

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
  const location = [
    { value: "jack", label: "Jack" },
    { value: "lucy", label: "Lucy" },
    { value: "Yiminghe", label: "yiminghe" },
    { value: "disabled", label: "Disabled", disabled: true },
  ];

  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form layout="vertical">
        <div>
          <div>
            <p className="text-xs font-semibold">Car Type</p>
            <p>
              Assign this particular vehicle to one or multiple vehicle types.
            </p>
          </div>
          <div className="border-b">
            <Form.Item className="w-full h-14 flex justify-between my-2">
              <Checkbox.Group
                options={carType}
                defaultValue={["largePremium"]}
                onChange={onChange}
                className="w-[90%] h-14 flex items-center justify-start flex-wrap gap-2"
              />
            </Form.Item>
          </div>
        </div>
        <div className="w-full flex justify-between items-center gap-4 py-1 border-b">
          <Form.Item
            label={<p className="text-xs font-semibold">Make</p>}
            name="make"
            className="w-full"
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label={<p className="text-xs font-semibold">Model</p>}
            name="mode"
            className="w-full"
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label={<p className="text-xs font-semibold">Color</p>}
            name="color"
            className="w-full"
          >
            <Input></Input>
          </Form.Item>
        </div>
        <div className="w-full flex justify-between items-center gap-4 py-1  border-b">
          <Form.Item
            label={<p className="text-xs font-semibold">License Plate</p>}
            name="licensePlate"
            className="w-full"
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label={<p className="text-xs font-semibold">VIN</p>}
            name="vin"
            className="w-full"
          >
            <Input></Input>
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item
            className="w-auto h-14 flex justify-between my-2 "
            label={<p className="text-xs font-semibold">Fuel Type</p>}
            name="fuelType"
          >
            <Radio.Group
              options={fuelType}
              onChange={onChange}
              optionType="default"
              className="w-full flex items-center justify-start flex-wrap gap-2"
            />
          </Form.Item>
          <div className=" w-28 mt-3 ">
            <p className="text-xs font-semibold">Tank Size</p>
            <Input className="" addonAfter={<p>gallons</p>} />
          </div>
        </div>
        <div className="py-2">
          <div className="w-full flex justify-between items-center gap-4  ">
            <Form.Item
              label={<p className="text-xs font-semibold">Locatioin</p>}
              name="dailyRate"
              className="w-full"
            >
              <Select
                defaultValue="lucy"
                className="w-full"
                // onChange={handleChange}
                options={location}
              />
            </Form.Item>
            <Form.Item
              label={<p className="text-xs font-semibold">Odometer Reading</p>}
              name="vin"
              className="w-full"
            >
              <Input addonAfter={<p>mile</p>}></Input>
            </Form.Item>
          </div>
          <p className="-mt-3">
            Manually select current vehicle location so that you can easily
            track where each vehicle is at the moment.
          </p>
        </div>
        <div className="w-full flex justify-between items-center gap-4 ">
          <Form.Item
            label={<p className="text-xs font-semibold">Manufacture Year</p>}
          >
            <InputNumber
              size="middle"
              min={1}
              max={100000}
              defaultValue={3}
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            label={<p className="text-xs font-semibold">Date purchased</p>}
          >
            <DatePicker></DatePicker>
          </Form.Item>
          <Form.Item
            label={<p className="text-xs font-semibold">Mileage purchased</p>}
          >
            <Input addonAfter={<p>mile</p>} />
          </Form.Item>
        </div>
        <div className="flex gap-4 justify-start">
          <Button>Cancel</Button>
          <Button className="bg-smart text-white">Save</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddNewModal;
