import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, InputNumber, Switch, Tag } from "antd";
import { BiDollar } from "react-icons/bi";
import {
  initializeProtection,
  updateProtection,
  toggleProtectionInclude,
  calculateTotals,
} from "../../../redux/features/ReservationSlice"; // Update the import path
import { useGetAllProtectionsQuery } from "../../../redux/apiSlices/extra";
import { TbCurrencyNaira } from "react-icons/tb";

const StepFour = () => {
  const dispatch = useDispatch();
  const {
    data: protectionData,
    isLoading,
    isError,
  } = useGetAllProtectionsQuery();

  console.log("protectionData", protectionData?.data?.result);

  const protection = useSelector((state) => state.carRental.protection);
  const protectionInitialized = useSelector(
    (state) => state.carRental.protectionInitialized
  );
  const selectedProtectionIds = useSelector(
    (state) => state.carRental.selectedProtectionIds
  );

  // Initialize protection data from API when it's loaded and not already initialized
  useEffect(() => {
    if (protectionData?.data?.result && !protectionInitialized) {
      dispatch(initializeProtection(protectionData.data.result));
    }
  }, [protectionData, protectionInitialized, dispatch]);

  // Use Redux state if already initialized, otherwise show loading or fallback
  const transformedData = React.useMemo(() => {
    if (protectionInitialized && protection.length > 0) {
      return protection; // Use Redux state if already initialized
    }
    return []; // Return empty array if not initialized yet
  }, [protection, protectionInitialized]);

  // Calculate totals whenever protection data changes
  useEffect(() => {
    dispatch(calculateTotals());
  }, [protection, dispatch]);

  // Debug logs for tracking
  useEffect(() => {
    console.log("Selected Protection IDs:", selectedProtectionIds);
    console.log("Protection Initialized:", protectionInitialized);
    console.log("Protection Data:", protection);
  }, [selectedProtectionIds, protectionInitialized, protection]);

  const handleSwitchChange = (checked, index) => {
    dispatch(toggleProtectionInclude(index));
  };

  const handleQtyChange = (value, index) => {
    dispatch(
      updateProtection({
        index,
        field: "qty",
        value: value || 1,
      })
    );
  };

  const handlePriceChange = (value, index) => {
    dispatch(
      updateProtection({
        index,
        field: "price",
        value: value || 0,
      })
    );
  };

  const columns = [
    {
      title: "Include",
      dataIndex: "includeStatus",
      key: "includeStatus",
      render: (text, record, index) => (
        <Switch
          checked={record.includeStatus}
          onChange={(checked) => handleSwitchChange(checked, index)}
          checkedChildren="YES"
          unCheckedChildren="NO"
          className="custom-switch"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          {record.description && (
            <div className="text-sm text-gray-500">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      render: (text, record, index) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => handleQtyChange(value, index)}
          disabled={!record.includeStatus}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) => (
        <div className="flex items-center gap-4">
          {typeof record.price === "string" && record.price === "Included" ? (
            <span className="text-green-600 font-medium">Included</span>
          ) : (
            <InputNumber
              addonBefore={<TbCurrencyNaira />}
              min={0}
              value={record.price}
              onChange={(value) => handlePriceChange(value, index)}
              className="w-24"
              disabled={!record.includeStatus}
            />
          )}
        </div>
      ),
    },
    {
      title: "Billing",
      dataIndex: "isPerDay",
      key: "isPerDay",
      width: 120,
      align: "center",
      render: (isPerDay, record) => {
        if (isPerDay === true) {
          return (
            <Tag color="blue" className="text-xs">
              Per Day
            </Tag>
          );
        } else if (isPerDay === false) {
          return (
            <Tag color="orange" className="text-xs">
              One Time
            </Tag>
          );
        } else {
          return (
            <Tag color="gray" className="text-xs">
              Not Set
            </Tag>
          );
        }
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 120,
      align: "right",
      render: (text, record, index) => (
        <div className="text-right">
          <span className="font-semibold text-green-600">
            &#8358; {(text || 0).toFixed(2)}
          </span>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading protection services...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">Error loading protection services</div>
      </div>
    );
  }

  if (!protectionInitialized) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Initializing protection services...</div>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Protection Services</h3>
        <p className="text-gray-600">
          Select the protection services you want to include in your rental.
        </p>
        {selectedProtectionIds.length > 0 && (
          <div className="mt-2 text-sm text-blue-600">
            Selected: {selectedProtectionIds.length} protection service(s)
          </div>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={transformedData}
        pagination={false}
        rowKey={(record) => record._id || record.name}
        className="protection-table"
      />

      {transformedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No protection services available
        </div>
      )}
    </div>
  );
};

export default StepFour;
