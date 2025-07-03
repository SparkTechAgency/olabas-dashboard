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
import { TbCurrencyNaira } from "react-icons/tb";
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

  // Helper function to get rate for a specific vehicle type from selected vehicle
  const getRateForVehicleType = (vehicleType) => {
    if (!selectedVehicleData?.dailyRates) {
      console.log("No dailyRates found, using default rate");
      return 840.0; // default fallback
    }

    const rateData = selectedVehicleData.dailyRates.find(
      (rate) => rate.vehicleType === vehicleType
    );

    console.log("Rate lookup:", {
      vehicleType,
      rateData,
      foundRate: rateData?.rate,
    });
    return rateData ? rateData.rate : 840.0;
  };

  // Helper function to convert car size to vehicle type
  const getVehicleTypeFromCarSize = (carSize) => {
    const mapping = {
      "Large: Premium": "LARGE PREMIUM",
      "Large: Station wagon": "LARGE STATION WAGON",
      "Medium: Low emission": "MEDIUM LOW EMISSION",
      "Small: Economy": "SMALL ECONOMY",
      "Small: Mini": "SMALL MINI",
    };
    return mapping[carSize] || "LARGE PREMIUM";
  };

  // Create dynamic data based on selected vehicle's daily rates
  const getDynamicData = () => {
    const baseData = [
      {
        key: "largePremium",
        carSize: "Large: Premium",
        vehicleType: "LARGE PREMIUM",
        defaultPrice: 840.0,
      },
      {
        key: "largeStationWagon",
        carSize: "Large: Station wagon",
        vehicleType: "LARGE STATION WAGON",
        defaultPrice: 840.0,
      },
      {
        key: "mediumLowEmission",
        carSize: "Medium: Low emission",
        vehicleType: "MEDIUM LOW EMISSION",
        defaultPrice: 840.0,
      },
      {
        key: "smallEconomy",
        carSize: "Small: Economy",
        vehicleType: "SMALL ECONOMY",
        defaultPrice: 840.0,
      },
      {
        key: "smallMini",
        carSize: "Small: Mini",
        vehicleType: "SMALL MINI",
        defaultPrice: 840.0,
      },
    ];

    // If a vehicle is selected, update prices from its dailyRates
    if (selectedVehicleData?.dailyRates) {
      return baseData.map((item) => {
        const rate = getRateForVehicleType(item.vehicleType);
        return {
          ...item,
          price: rate,
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

  // Function to validate required fields
  const validateRequiredFields = () => {
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

  // Get the current rate for the selected car size
  const getCurrentRate = () => {
    const selectedVehicleType = getVehicleTypeFromCarSize(selectedCarSize);

    if (selectedVehicleData?.dailyRates) {
      const rate = getRateForVehicleType(selectedVehicleType);
      console.log("getCurrentRate - from vehicle dailyRates:", rate);
      return rate;
    }

    // Fallback to the stored rate or default
    const fallbackRate = vehicle?.rate || vehiclePrice || 840.0;
    console.log("getCurrentRate - fallback:", fallbackRate);
    return fallbackRate;
  };

  const handleCarSizeChange = (e) => {
    const selectedSize = e.target.value;
    const selectedData = data.find((item) => item.key === selectedSize);

    if (!selectedData) return;

    console.log("Car size changed to:", selectedData.carSize);

    // Update Redux state
    dispatch(setSelectedCarSize(selectedData.carSize));

    // Get the rate for this car size from the selected vehicle
    const selectedVehicleType = getVehicleTypeFromCarSize(selectedData.carSize);
    let newRate;

    if (selectedVehicleData?.dailyRates) {
      newRate = getRateForVehicleType(selectedVehicleType);
      console.log("Using rate from selected vehicle dailyRates:", newRate);
    } else {
      newRate = selectedData.price;
      console.log("Using default rate:", newRate);
    }

    console.log("New rate for car size:", newRate);

    // Update all rate-related Redux state
    dispatch(setVehiclePrice(newRate));
    dispatch(setVehicleRate(newRate));

    // Update vehicle object if vehicle is selected
    if (vehicle?.vehicleId) {
      dispatch(
        setVehicle({
          vehicleId: vehicle.vehicleId,
          vehicleType: vehicle.vehicleType,
          rate: newRate,
        })
      );
    }

    // Recalculate totals
    dispatch(calculateTotals());
  };

  const handleVehicleChange = (vehicleId) => {
    console.log("Vehicle selection changed:", vehicleId);

    if (!vehicleId) {
      // Clear vehicle if no selection or cleared
      console.log("Clearing vehicle selection");
      dispatch(
        setVehicle({
          vehicleId: "",
          vehicleType: "",
          rate: 840.0,
        })
      );
      dispatch(setVehiclePrice(840.0));
      dispatch(setVehicleRate(840.0));
      form.setFieldsValue({ vehicle: undefined });
      dispatch(calculateTotals());

      setTimeout(() => {
        validateRequiredFields();
      }, 100);
      return;
    }

    const selectedVehicle = vehicleData?.data?.result?.find(
      (v) => v._id === vehicleId
    );

    console.log("Selected vehicle object:", selectedVehicle);

    if (selectedVehicle) {
      // Get the rate for the currently selected car size from the new vehicle's rates
      const selectedVehicleType = getVehicleTypeFromCarSize(selectedCarSize);
      let newRate;

      if (selectedVehicle.dailyRates && selectedVehicle.dailyRates.length > 0) {
        const rateData = selectedVehicle.dailyRates.find(
          (rate) => rate.vehicleType === selectedVehicleType
        );
        newRate = rateData ? rateData.rate : 840.0;
        console.log("Rate found in vehicle dailyRates:", newRate);
      } else {
        newRate = 840.0; // Default fallback
        console.log("No dailyRates found, using default:", newRate);
      }

      console.log(
        "Final rate for selected car size from new vehicle:",
        newRate
      );

      // Update Redux state with complete vehicle object
      const vehicleData = {
        vehicleId: selectedVehicle._id,
        vehicleType: selectedVehicle.vehicleType,
        rate: newRate,
      };

      console.log("Dispatching vehicle data:", vehicleData);

      // Update all Redux state at once
      dispatch(setVehicle(vehicleData));
      dispatch(setVehiclePrice(newRate));
      dispatch(setVehicleRate(newRate));

      // Update form field value
      form.setFieldsValue({ vehicle: vehicleId });
      console.log("Form field set to:", vehicleId);
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

      console.log("Manual price change:", numericPrice);

      // Update Redux state
      dispatch(setVehiclePrice(numericPrice));
      dispatch(setVehicleRate(numericPrice));

      // Also update vehicle rate if vehicle is selected
      if (vehicle?.vehicleId) {
        dispatch(
          setVehicle({
            vehicleId: vehicle.vehicleId,
            vehicleType: vehicle.vehicleType,
            rate: numericPrice,
          })
        );
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

  // Update rates when vehicle data changes or car size changes
  useEffect(() => {
    if (selectedVehicleData && selectedVehicleData.dailyRates) {
      const selectedVehicleType = getVehicleTypeFromCarSize(selectedCarSize);
      const correctRate = getRateForVehicleType(selectedVehicleType);

      console.log("Effect - Vehicle data changed, updating rate:", {
        selectedCarSize,
        selectedVehicleType,
        correctRate,
        currentRate: vehicle?.rate,
      });

      // Only update if the rate is different to avoid unnecessary updates
      if (vehicle?.rate !== correctRate) {
        dispatch(setVehiclePrice(correctRate));
        dispatch(setVehicleRate(correctRate));

        if (vehicle?.vehicleId) {
          dispatch(
            setVehicle({
              vehicleId: vehicle.vehicleId,
              vehicleType: vehicle.vehicleType,
              rate: correctRate,
            })
          );
        }

        dispatch(calculateTotals());
      }
    }
  }, [selectedVehicleData, selectedCarSize, dispatch]);

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

  // Handle the isClicked state properly
  useEffect(() => {
    if (isClicked) {
      console.log("Next button clicked, running validation...");
      const isValid = validateRequiredFields();
      console.log("Final validation result:", isValid);
    }
  }, [isClicked]);

  // Debug current state
  useEffect(() => {
    console.log("=== DEBUG STATE ===");
    console.log("Current Redux vehicle state:", vehicle);
    console.log("Current form vehicle field:", form.getFieldValue("vehicle"));
    console.log("Current selected car size:", selectedCarSize);
    console.log("Current rate for selected car size:", getCurrentRate());
    console.log("Selected vehicle data:", selectedVehicleData);
    if (selectedVehicleData?.dailyRates) {
      console.log("Available daily rates:", selectedVehicleData.dailyRates);
    }
    console.log("==================");
  }, [vehicle, selectedCarSize, selectedVehicleData]);

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
      render: (text, record) => {
        // Show the rate for this specific car size from the selected vehicle
        const isSelected = getSelectedKey() === record.key;
        let displayRate;

        if (isSelected) {
          displayRate = getCurrentRate();
        } else {
          // For non-selected rows, show the rate from the vehicle's dailyRates if available
          if (selectedVehicleData?.dailyRates) {
            displayRate = getRateForVehicleType(record.vehicleType);
          } else {
            displayRate = record.price;
          }
        }

        return (
          <Input
            value={`${displayRate.toFixed(2)}`}
            prefix={
              <TbCurrencyNaira
                size={18}
                className={`${isSelected ? "text-green-500" : null}`}
              />
            }
            className="w-full"
            disabled={!isSelected}
            onChange={(e) => handlePriceChange(e.target.value, record)}
          />
        );
      },
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
