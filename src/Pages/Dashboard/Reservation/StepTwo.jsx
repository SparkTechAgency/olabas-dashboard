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

  // Get selected vehicle's daily rates
  const selectedVehicleData = vehicleData?.data?.result?.find(
    (v) => v._id === vehicle?.vehicleId
  );

  // Create dynamic data based on selected vehicle's daily rates
  const getDynamicData = () => {
    const baseData = [
      {
        key: "largePremium",
        carSize: "Large: Premium",
        vehicleType: "LARGE PREMIUM",
        defaultPrice: "$840.00",
      },
      {
        key: "largeStationWagon",
        carSize: "Large: Station wagon",
        vehicleType: "LARGE STATION WAGON",
        defaultPrice: "$840.00",
      },
      {
        key: "mediumLowEmission",
        carSize: "Medium: Low emission",
        vehicleType: "MEDIUM LOW EMISSION",
        defaultPrice: "$840.00",
      },
      {
        key: "smallEconomy",
        carSize: "Small: Economy",
        vehicleType: "SMALL ECONOMY",
        defaultPrice: "$840.00",
      },
      {
        key: "smallMini",
        carSize: "Small: Mini",
        vehicleType: "SMALL MINI",
        defaultPrice: "$840.00",
      },
    ];

    // If a vehicle is selected, update prices from its dailyRates
    if (selectedVehicleData?.dailyRates) {
      return baseData.map((item) => {
        const dailyRate = selectedVehicleData.dailyRates.find(
          (rate) => rate.vehicleType === item.vehicleType
        );
        return {
          ...item,
          price: dailyRate
            ? `$${dailyRate.rate.toFixed(2)}`
            : item.defaultPrice,
        };
      });
    }

    // Return default data if no vehicle selected
    return baseData.map((item) => ({
      ...item,
      price: item.defaultPrice,
    }));
  };

  const data = getDynamicData();

  // Function to validate required fields - IMPROVED VERSION
  const validateRequiredFields = () => {
    // Check both form field and Redux state
    const formVehicleValue = form.getFieldValue("vehicle");
    const reduxVehicleId = vehicle?.vehicleId;

    console.log("Validation check:", {
      formVehicleValue,
      reduxVehicleId,
      vehicleObject: vehicle,
    });

    const isValid = formVehicleValue && reduxVehicleId;
    const hasErrors = !isValid;

    setHasError(hasErrors);
    return isValid;
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
    console.log("Vehicle selection changed:", vehicleId);

    const selectedVehicle = vehicleData?.data?.result?.find(
      (v) => v._id === vehicleId
    );

    console.log("Selected vehicle object:", selectedVehicle);

    if (selectedVehicle) {
      const vehicleTypeMapping = {
        LARGE_STATION_WAGON: "Large: Station wagon",
        LARGE_PREMIUM: "Large: Premium",
        MEDIUM_LOW_EMISSION: "Medium: Low emission",
        SMALL_ECONOMY: "Small: Economy",
        SMALL_MINI: "Small: Mini",
      };

      const mappedCarSize = vehicleTypeMapping[selectedVehicle.vehicleType];

      // Get the rate for the current vehicle type from dailyRates
      const currentRate =
        selectedVehicle.dailyRates?.find(
          (rate) => rate.vehicleType === selectedVehicle.vehicleType
        )?.rate ||
        selectedVehicle.dailyRate ||
        vehiclePrice;

      // Update Redux state with complete vehicle object
      const vehicleData = {
        vehicleId: selectedVehicle._id,
        vehicleType: selectedVehicle.vehicleType,
        rate: currentRate,
      };

      console.log("Dispatching vehicle data:", vehicleData);
      dispatch(setVehicle(vehicleData));

      if (mappedCarSize) {
        dispatch(setSelectedCarSize(mappedCarSize));
        dispatch(setVehiclePrice(currentRate));
        dispatch(setVehicleRate(currentRate));
      }

      // Update form field value - this is important!
      form.setFieldsValue({ vehicle: vehicleId });

      console.log("Form field set to:", vehicleId);
    } else if (vehicleId === undefined || vehicleId === null) {
      // Clear vehicle if no selection or cleared
      console.log("Clearing vehicle selection");
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

    // Validate after change and clear error state if valid
    setTimeout(() => {
      const isValid = validateRequiredFields();
      console.log("Validation result after vehicle change:", isValid);

      // Clear isClicked if validation passes
      if (isValid && isClicked) {
        setIsClicked(false);
      }
    }, 100);
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

  // Set initial form values from Redux state
  useEffect(() => {
    console.log("Setting initial form values. Vehicle from Redux:", vehicle);
    if (vehicle?.vehicleId) {
      form.setFieldsValue({ vehicle: vehicle.vehicleId });
      console.log("Form initialized with vehicle:", vehicle.vehicleId);
    }
  }, [vehicle?.vehicleId, form]);

  // Validate when component mounts and when dependencies change
  useEffect(() => {
    console.log("Running validation effect. Vehicle state:", vehicle);

    // Only validate if the form has been interacted with
    if (vehicle?.vehicleId || form.getFieldValue("vehicle")) {
      setTimeout(() => {
        validateRequiredFields();
      }, 100);
    }
  }, [vehicle?.vehicleId]);

  // Handle the isClicked state properly - IMPROVED VERSION
  useEffect(() => {
    if (isClicked) {
      console.log("Next button clicked, running validation...");
      const isValid = validateRequiredFields();
      console.log("Final validation result:", isValid);

      // Don't reset isClicked here - let the parent component handle it
      // The parent will reset isClicked when validation passes or step changes
    }
  }, [isClicked]);

  // Debug current state
  useEffect(() => {
    console.log("Current Redux vehicle state:", vehicle);
    console.log("Current form vehicle field:", form.getFieldValue("vehicle"));
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
    <Form form={form} layout="vertical" initialValues={{ remember: true }}>
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
            value={vehicle?.vehicleId || undefined}
            onChange={handleVehicleChange}
            loading={isLoading}
            showSearch
            optionFilterProp="children"
            allowClear
            onClear={() => {
              console.log("Vehicle selection cleared");
              handleVehicleChange(undefined);
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
    </Form>
  );
};

export default StepTwo;
