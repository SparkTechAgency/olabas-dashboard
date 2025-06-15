import { useEffect } from "react";
import { Form, Input, Select, Table, Radio } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useGetAvailableFleetQuery } from "../../../redux/apiSlices/fleetManagement";
import {
  setSelectedCarSize,
  setVehicle,
  setVehiclePrice,
  setVehicleRate,
  calculateTotals,
} from "../../../redux/features/ReservationSlice";

const { Option } = Select;

const StepTwo = ({ setHasError, isClicked, setIsClicked }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Get data from Redux store
  const { selectedCarSize, vehicle, vehiclePrice } = useSelector(
    (state) => state.carRental
  );

  const { data: vehicleData, isLoading } = useGetAvailableFleetQuery({
    page: null,
    limit: null,
  });
  console.log("Vehicle Data:", vehicleData);

  const data = [
    {
      key: "largePremium",
      carSize: "Large: Premium",
      price: "$840.00",
    },
    {
      key: "largeStationWagon",
      carSize: "Large: Station wagon",
      price: "$840.00",
    },
    {
      key: "mediumLowEmission",
      carSize: "Medium: Low emission",
      price: "$840.00",
    },
    {
      key: "smallEconomy",
      carSize: "Small: Economy",
      price: "$840.00",
    },
    {
      key: "smallMini",
      carSize: "Small: Mini",
      price: "$840.00",
    },
  ];

  // Function to save vehicle data to Redux and calculate totals
  const saveVehicleToRedux = () => {
    if (vehicle?.vehicleId) {
      // Data is already in Redux state, just calculate totals
      dispatch(calculateTotals());
      console.log("Vehicle data updated in Redux:", vehicle);

      // Set isClicked to false after saving
      setIsClicked(false);
    } else {
      console.warn("No vehicle selected to save");
      setIsClicked(false);
    }
  };

  // Function to validate required fields
  const validateRequiredFields = () => {
    const vehicleValue = form.getFieldValue("vehicle");
    const hasErrors = !vehicleValue || !vehicle?.vehicleId;
    setHasError(hasErrors);
    return hasErrors;
  };

  const getSelectedKey = () => {
    return (
      data.find((item) => item.carSize === selectedCarSize)?.key ||
      "largePremium"
    );
  };

  const handleCarSizeChange = (e) => {
    const selectedSize = e.target.value;
    const selectedData = data.find((item) => item.key === selectedSize);

    // Update Redux state
    dispatch(setSelectedCarSize(selectedData.carSize));

    const numericPrice = parseFloat(selectedData.price.replace("$", "")) || 0;
    dispatch(setVehiclePrice(numericPrice));

    // Also update vehicle rate if vehicle is selected
    if (vehicle?.vehicleId) {
      dispatch(setVehicleRate(numericPrice));
    }

    // Recalculate totals
    dispatch(calculateTotals());
  };

  const handleVehicleChange = (vehicleId) => {
    const selectedVehicle = vehicleData?.data?.result?.find(
      (v) => v._id === vehicleId
    );

    if (selectedVehicle) {
      const vehicleTypeMapping = {
        LARGE_STATION_WAGON: "Large: Station wagon",
        LARGE_PREMIUM: "Large: Premium",
        MEDIUM_LOW_EMISSION: "Medium: Low emission",
        SMALL_ECONOMY: "Small: Economy",
        SMALL_MINI: "Small: Mini",
      };

      const mappedCarSize = vehicleTypeMapping[selectedVehicle.vehicleType];

      // Update Redux state with complete vehicle object
      dispatch(
        setVehicle({
          vehicleId: selectedVehicle._id,
          vehicleType: selectedVehicle.vehicleType,
          rate: selectedVehicle.dailyRate || vehiclePrice,
        })
      );

      if (mappedCarSize) {
        dispatch(setSelectedCarSize(mappedCarSize));
      }

      // Update form field value
      form.setFieldsValue({ vehicle: vehicleId });
    } else {
      // Clear vehicle if no selection
      dispatch(
        setVehicle({
          vehicleId: "",
          vehicleType: "",
          rate: 0,
        })
      );
      form.setFieldsValue({ vehicle: undefined });
    }

    // Recalculate totals
    dispatch(calculateTotals());

    // Validate after change
    setTimeout(validateRequiredFields, 0);
  };

  const handlePriceChange = (value, record) => {
    if (getSelectedKey() === record.key) {
      const numericPrice = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;

      // Update Redux state
      dispatch(setVehiclePrice(numericPrice));

      // Also update vehicle rate if vehicle is selected
      if (vehicle?.vehicleId) {
        dispatch(setVehicleRate(numericPrice));
      }

      // Recalculate totals
      dispatch(calculateTotals());
    }
  };

  // Save to Redux when isClicked is true
  useEffect(() => {
    if (isClicked) {
      saveVehicleToRedux();
    }
  }, [isClicked, vehicle, vehiclePrice]);

  // Validate on component mount and when vehicle data changes
  useEffect(() => {
    setTimeout(validateRequiredFields, 100);
  }, [vehicle, form]);

  // Set initial form values from Redux state
  useEffect(() => {
    if (vehicle?.vehicleId) {
      form.setFieldsValue({ vehicle: vehicle.vehicleId });
    }
  }, [vehicle?.vehicleId, form]);

  useEffect(() => {
    // Debugging log
    console.log("Current vehicle state from Redux:", vehicle);
  }, [vehicle]);

  const columns = [
    {
      title: "Car Size",
      dataIndex: "carSize",
      key: "carSize",
      render: (text, record) => (
        <div className="flex items-center space-x-4">
          <Radio
            className="custom-radio"
            value={record.key}
            checked={getSelectedKey() === record.key}
            onChange={handleCarSizeChange}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <Input
          value={
            getSelectedKey() === record.key
              ? `$${(vehicle?.rate || vehiclePrice || 0).toFixed(2)}`
              : text
          }
          className="w-full"
          disabled={getSelectedKey() !== record.key}
          onChange={(e) => handlePriceChange(e.target.value, record)}
        />
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ remember: true }}
      onFieldsChange={validateRequiredFields}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName="editable-row"
        bordered
        rowKey="key"
      />

      <div className="mb-4 mt-4">
        <Form.Item
          label="Choose vehicle"
          name="vehicle"
          rules={[{ required: true, message: "Please choose a vehicle!" }]}
        >
          <Select
            placeholder="-- Choose --"
            className="w-full"
            value={vehicle?.vehicleId}
            onChange={handleVehicleChange}
            loading={isLoading}
            showSearch
            optionFilterProp="children"
            allowClear
            onClear={() => {
              dispatch(
                setVehicle({
                  vehicleId: "",
                  vehicleType: "",
                  rate: 0,
                })
              );
              form.setFieldsValue({ vehicle: undefined });
              dispatch(calculateTotals());
              setTimeout(validateRequiredFields, 0);
            }}
          >
            {vehicleData?.data?.result?.map((vehicleItem) => (
              <Option key={vehicleItem._id} value={vehicleItem._id}>
                {vehicleItem.name} - {vehicleItem.licenseNumber}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      {/* Debug info - remove in production */}
      {/* <div className="mt-4 p-4 bg-gray-100 rounded">
        <h4>Current Vehicle State (from Redux):</h4>
        <p>
          <strong>Vehicle ID:</strong> {vehicle?.vehicleId || "None"}
        </p>
        <p>
          <strong>Vehicle Type:</strong> {vehicle?.vehicleType || "None"}
        </p>
        <p>
          <strong>Rate:</strong> {vehicle?.rate || vehiclePrice || 0}
        </p>
        <p>
          <strong>Selected Car Size:</strong> {selectedCarSize || "None"}
        </p>
      </div> */}
    </Form>
  );
};

export default StepTwo;
