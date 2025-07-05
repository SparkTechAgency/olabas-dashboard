import React, { useState, useEffect } from "react";
import { Form, Input, Select, Table, Radio, Row, Col } from "antd";
import { TbCurrencyNaira } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useGetAvailableFleetQuery } from "../../../../redux/apiSlices/fleetManagement";
import {
  updateField,
  updateVehicle,
} from "../../../../redux/features/EditReservationSlice";

const { Option } = Select;

function Vehicle() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Get state from Redux store
  const { vehicle, vehicleType, amount } = useSelector(
    (state) => state.editReservation
  );

  // Local state for UI interactions
  const [selectedCarSize, setSelectedCarSize] = useState(
    vehicleType || "Large: Premium"
  );
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehiclePrice, setVehiclePrice] = useState(amount || 840.0);

  const { data: vehicleData, isLoading } = useGetAvailableFleetQuery({
    page: null,
    limit: null,
  });
  const vehicleList = vehicleData?.data?.result || [];

  // Initialize component with Redux data
  useEffect(() => {
    if (vehicle && vehicleList.length > 0) {
      // Handle both cases: vehicle as ID string or vehicle as object
      const vehicleId =
        vehicle && typeof vehicle === "object" ? vehicle._id : vehicle;
      if (vehicleId) {
        const foundVehicle = vehicleList.find((v) => v._id === vehicleId);
        if (foundVehicle) {
          setSelectedVehicle(foundVehicle);
        }
      }
    }
    if (vehicleType) {
      setSelectedCarSize(vehicleType);
    }
    if (amount) {
      setVehiclePrice(amount);
    }
  }, [vehicle, vehicleType, amount, vehicleList]);

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

  const getRateForVehicleType = (vehicleType) => {
    if (!selectedVehicle?.dailyRates) return 840.0;
    const rateData = selectedVehicle.dailyRates.find(
      (rate) => rate.vehicleType === vehicleType
    );
    return rateData ? rateData.rate : 840.0;
  };

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

    if (selectedVehicle?.dailyRates) {
      return baseData.map((item) => ({
        ...item,
        price: getRateForVehicleType(item.vehicleType),
      }));
    }

    return baseData.map((item) => ({ ...item, price: item.defaultPrice }));
  };

  const data = getDynamicData();

  const getSelectedKey = () => {
    return (
      data.find((item) => item.carSize === selectedCarSize)?.key ||
      "largePremium"
    );
  };

  const getCurrentRate = () => {
    const selectedVehicleType = getVehicleTypeFromCarSize(selectedCarSize);
    if (selectedVehicle?.dailyRates) {
      return getRateForVehicleType(selectedVehicleType);
    }
    return vehiclePrice || 840.0;
  };

  const handleCarSizeChange = (e) => {
    const selectedSize = e.target.value;
    const selectedData = data.find((item) => item.key === selectedSize);
    if (!selectedData) return;

    setSelectedCarSize(selectedData.carSize);
    const selectedVehicleType = getVehicleTypeFromCarSize(selectedData.carSize);
    let newRate = selectedVehicle?.dailyRates
      ? getRateForVehicleType(selectedVehicleType)
      : selectedData.price;

    setVehiclePrice(newRate);

    // Update Redux store
    dispatch(
      updateVehicle({
        vehicleType: selectedData.carSize,
      })
    );
    dispatch(
      updateField({
        field: "amount",
        value: newRate,
      })
    );

    form.setFieldsValue({ carSize: selectedData.carSize });
  };

  const handleVehicleChange = (vehicleId) => {
    if (!vehicleId) {
      setSelectedVehicle(null);
      setVehiclePrice(840.0);

      // Update Redux store
      dispatch(
        updateVehicle({
          vehicle: null,
        })
      );
      dispatch(
        updateField({
          field: "amount",
          value: 840.0,
        })
      );

      form.setFieldsValue({ vehicle: undefined });
      return;
    }

    const selectedVehicleData = vehicleList.find((v) => v._id === vehicleId);
    if (selectedVehicleData) {
      setSelectedVehicle(selectedVehicleData);
      const selectedVehicleType = getVehicleTypeFromCarSize(selectedCarSize);
      const rateData = selectedVehicleData.dailyRates?.find(
        (rate) => rate.vehicleType === selectedVehicleType
      );
      const newRate = rateData ? rateData.rate : 840.0;
      setVehiclePrice(newRate);

      // Update Redux store
      dispatch(
        updateVehicle({
          vehicle: vehicleId,
        })
      );
      dispatch(
        updateField({
          field: "amount",
          value: newRate,
        })
      );

      form.setFieldsValue({ vehicle: vehicleId });
    }
  };

  const handlePriceChange = (value, record) => {
    if (getSelectedKey() === record.key) {
      const numericPrice = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
      setVehiclePrice(numericPrice);

      // Update Redux store
      dispatch(
        updateField({
          field: "amount",
          value: numericPrice,
        })
      );
    }
  };

  useEffect(() => {
    // Get the vehicle ID properly (handle both object and string cases)
    const vehicleId =
      selectedVehicle?._id ||
      (vehicle && typeof vehicle === "object" ? vehicle._id : vehicle);

    form.setFieldsValue({
      carSize: selectedCarSize,
      vehicle: vehicleId || undefined,
    });
  }, [selectedCarSize, selectedVehicle, form, vehicle]);

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
        const isSelected = getSelectedKey() === record.key;
        const displayRate = isSelected
          ? getCurrentRate()
          : selectedVehicle?.dailyRates
          ? getRateForVehicleType(record.vehicleType)
          : record.price;
        return (
          <Input
            value={`${displayRate.toFixed(2)}`}
            prefix={
              <TbCurrencyNaira
                size={18}
                className={`${isSelected ? "text-green-500" : ""}`}
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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <Form form={form} layout="vertical" initialValues={{ remember: true }}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Select Car Size & View Pricing
          </h3>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName="editable-row"
            bordered
            rowKey="key"
          />
        </div>

        <Row gutter={24}>
          <Col xs={24} md={24}>
            <Form.Item
              label="Choose Specific Vehicle"
              name="vehicle"
              rules={[{ required: true, message: "Please choose a vehicle!" }]}
            >
              <Select
                placeholder="-- Choose Vehicle --"
                className="w-full"
                value={
                  selectedVehicle?._id ||
                  (vehicle && typeof vehicle === "object"
                    ? vehicle._id
                    : vehicle) ||
                  undefined
                }
                onChange={handleVehicleChange}
                showSearch
                optionFilterProp="children"
                allowClear
                disabled={isLoading || !vehicleList.length}
                onClear={() => handleVehicleChange(undefined)}
              >
                {vehicleList.map((vehicleItem) => (
                  <Option key={vehicleItem._id} value={vehicleItem._id}>
                    {vehicleItem.name} - {vehicleItem.licenseNumber}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Debug info - remove in production */}
      <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
        <p>
          <strong>Redux State:</strong>
        </p>
        <p>
          Vehicle ID:{" "}
          {vehicle && typeof vehicle === "object"
            ? vehicle._id
            : vehicle || "None"}
        </p>
        <p>Vehicle Type: {vehicleType || "None"}</p>
        <p>Amount: {amount || "None"}</p>
      </div>
    </div>
  );
}

export default Vehicle;
