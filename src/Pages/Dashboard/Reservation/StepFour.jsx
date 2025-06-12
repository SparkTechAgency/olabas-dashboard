import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, InputNumber, Switch } from "antd";
import { BiDollar } from "react-icons/bi";
import {
  updateProtection,
  toggleProtectionInclude,
  calculateTotals,
} from "../../../redux/features/ReservationSlice"; // Update the import path

const StepFour = () => {
  const dispatch = useDispatch();
  const protection = useSelector((state) => state.carRental.protection);

  // Calculate totals whenever protection data changes
  useEffect(() => {
    dispatch(calculateTotals());
  }, [protection, dispatch]);

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
              addonBefore={<BiDollar />}
              min={0}
              value={record.price}
              onChange={(value) => handlePriceChange(value, index)}
              className="w-24"
              disabled={!record.includeStatus}
            />
          )}
          <p>One Time</p>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 120,
      align: "right",
      render: (text) => `$${(text || 0).toFixed(2)}`,
    },
  ];

  return (
    <div className="my-4">
      <Table
        columns={columns}
        dataSource={protection}
        pagination={false}
        rowKey={(record, index) => index}
      />
    </div>
  );
};

export default StepFour;
