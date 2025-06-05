// import React, { useState } from "react";
// import { Table, InputNumber, Switch } from "antd";
// import { BiDollar } from "react-icons/bi";

// const StepFour = () => {
//   const [dataSource, setDataSource] = useState([
//     {
//       key: "1",
//       name: "Default protection",
//       qty: 1,
//       price: 20,
//       total: 0,
//       include: false,
//     },
//     {
//       key: "2",
//       name: "Collision Damage Waiver",
//       qty: 1,
//       price: 0,
//       total: 0,
//       include: false,
//     },
//     {
//       key: "3",
//       name: "Theft Protection",
//       qty: 1,
//       price: "Included",
//       total: 0,
//       include: false,
//     },
//   ]);

//   const handleSwitchChange = (checked, key) => {
//     const updatedData = dataSource.map((item) => {
//       if (item.key === key) {
//         return {
//           ...item,
//           include: checked,
//           total: checked ? item.price * item.qty : 0,
//         };
//       }
//       return item;
//     });
//     setDataSource(updatedData);
//   };

//   const handleQtyChange = (value, key) => {
//     const updatedData = dataSource.map((item) => {
//       if (item.key === key) {
//         return {
//           ...item,
//           qty: value,
//           total: item.include ? item.price * value : 0,
//         };
//       }
//       return item;
//     });
//     setDataSource(updatedData);
//   };

//   const handlePriceChange = (value, key) => {
//     const updatedData = dataSource.map((item) => {
//       if (item.key === key) {
//         return {
//           ...item,
//           price: value,
//           total: item.include ? value * item.qty : 0,
//         };
//       }
//       return item;
//     });
//     setDataSource(updatedData);
//   };

//   const columns = [
//     {
//       title: "Include",
//       dataIndex: "include",
//       key: "include",
//       render: (text, record) => (
//         <Switch
//           checked={record.include}
//           onChange={(checked) => handleSwitchChange(checked, record.key)}
//           checkedChildren="YES"
//           unCheckedChildren="NO"
//           className="custom-switch"
//         />
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Qty",
//       dataIndex: "qty",
//       key: "qty",
//       render: (text, record) => (
//         <InputNumber
//           min={1}
//           value={record.qty}
//           onChange={(value) => handleQtyChange(value, record.key)}
//           disabled={!record.include} // <- disable individually based on include
//         />
//       ),
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       render: (text, record) => (
//         <div className="flex items-center gap-4">
//           <InputNumber
//             addonBefore={<BiDollar />}
//             min={0}
//             value={record.price}
//             onChange={(value) => handlePriceChange(value, record.key)}
//             className="w-24"
//             disabled={!record.include} // <- disable individually based on include
//           />
//           <p>One Time</p>
//         </div>
//       ),
//     },
//     {
//       title: "Total",
//       dataIndex: "total",
//       key: "total",
//       width: 120,
//       align: "right",
//       render: (text) => `$${(text || 0).toFixed(2)}`,
//     },
//   ];

//   return (
//     <div className="my-4">
//       <Table
//         columns={columns}
//         dataSource={dataSource}
//         pagination={false}
//         rowKey="key"
//       />
//     </div>
//   );
// };

// export default StepFour;

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, InputNumber, Switch } from "antd";
import { BiDollar } from "react-icons/bi";
import {
  updateProtection,
  toggleProtectionInclude,
  calculateTotals,
} from "../../../redux/features/ReservationSlice"; // Adjust the import path as needed

const StepFour = () => {
  const dispatch = useDispatch();
  const { protection } = useSelector((state) => state.carRental);

  const handleSwitchChange = (checked, index) => {
    dispatch(toggleProtectionInclude(index));
  };

  const handleQtyChange = (value, index) => {
    dispatch(updateProtection({ index, field: "qty", value }));
  };

  const handlePriceChange = (value, index) => {
    dispatch(updateProtection({ index, field: "price", value }));
  };

  // Calculate totals whenever protection changes
  useEffect(() => {
    dispatch(calculateTotals());
  }, [protection, dispatch]);

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
              <span className="text-green-600 font-medium">Included</span>
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
        dataSource={protection}
        pagination={false}
        rowKey={(record, index) => index}
      />
    </div>
  );
};

export default StepFour;
