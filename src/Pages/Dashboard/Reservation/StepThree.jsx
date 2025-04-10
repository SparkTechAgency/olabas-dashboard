// import React, { useState } from "react";
// import { Table, InputNumber, Switch } from "antd";
// import { BiDollar } from "react-icons/bi";
// const StepThree = () => {
//   const [dataSource, setDataSource] = useState([
//     {
//       key: "1",
//       name: "Extra driver",
//       qty: 1,
//       price: 20,
//       total: 0,
//       include: false,
//     },
//     {
//       key: "2",
//       name: "Child seat",
//       qty: 1,
//       price: 0,
//       total: 0,
//       include: false,
//     },
//     {
//       key: "3",
//       name: "GPS Navigation",
//       qty: 1,
//       price: 50,
//       total: 0,
//       include: false,
//     },
//     {
//       key: "4",
//       name: "Refuel Service",
//       qty: 1,
//       price: 25,
//       total: 0,
//       include: false,
//     },
//   ]);

//   const [isdisabled, setIsDisabled] = useState(false);

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
//     setIsDisabled(true);
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
//           disabled={!isdisabled}
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
//             disabled={!isdisabled}
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
//         // bordered
//       />
//     </div>
//   );
// };

// export default StepThree;

import React, { useState } from "react";
import { Table, InputNumber, Switch } from "antd";
import { BiDollar } from "react-icons/bi";

const StepThree = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      name: "Extra driver",
      qty: 1,
      price: 20,
      total: 0,
      include: false,
    },
    {
      key: "2",
      name: "Child seat",
      qty: 1,
      price: 0,
      total: 0,
      include: false,
    },
    {
      key: "3",
      name: "GPS Navigation",
      qty: 1,
      price: 50,
      total: 0,
      include: false,
    },
    {
      key: "4",
      name: "Refuel Service",
      qty: 1,
      price: 25,
      total: 0,
      include: false,
    },
  ]);

  const handleSwitchChange = (checked, key) => {
    const updatedData = dataSource.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          include: checked,
          total: checked ? item.price * item.qty : 0,
        };
      }
      return item;
    });
    setDataSource(updatedData);
  };

  const handleQtyChange = (value, key) => {
    const updatedData = dataSource.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          qty: value,
          total: item.include ? item.price * value : 0,
        };
      }
      return item;
    });
    setDataSource(updatedData);
  };

  const handlePriceChange = (value, key) => {
    const updatedData = dataSource.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          price: value,
          total: item.include ? value * item.qty : 0,
        };
      }
      return item;
    });
    setDataSource(updatedData);
  };

  const columns = [
    {
      title: "Include",
      dataIndex: "include",
      key: "include",
      render: (text, record) => (
        <Switch
          checked={record.include}
          onChange={(checked) => handleSwitchChange(checked, record.key)}
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
      render: (text, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => handleQtyChange(value, record.key)}
          disabled={!record.include} // <- disable individually based on include
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <div className="flex items-center gap-4">
          <InputNumber
            addonBefore={<BiDollar />}
            min={0}
            value={record.price}
            onChange={(value) => handlePriceChange(value, record.key)}
            className="w-24"
            disabled={!record.include} // <- disable individually based on include
          />
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
        dataSource={dataSource}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
};

export default StepThree;
