import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, InputNumber, Switch } from "antd";
import { BiDollar } from "react-icons/bi";
import {
  updateExtra,
  toggleExtraInclude,
  calculateTotals,
} from "../../../redux/features/ReservationSlice";

const StepThree = () => {
  const dispatch = useDispatch();
  const { extras } = useSelector((state) => state.carRental);

  const handleSwitchChange = (checked, index) => {
    dispatch(toggleExtraInclude(index));
  };

  const handleQtyChange = (value, index) => {
    dispatch(updateExtra({ index, field: "qty", value }));
  };

  const handlePriceChange = (value, index) => {
    dispatch(updateExtra({ index, field: "price", value }));
  };

  // Calculate totals whenever extras change
  useEffect(() => {
    dispatch(calculateTotals());
  }, [extras, dispatch]);

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
          {record.price === 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">Free</span>
            </div>
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
        dataSource={extras}
        pagination={false}
        rowKey={(record, index) => index}
      />
    </div>
  );
};

export default StepThree;
