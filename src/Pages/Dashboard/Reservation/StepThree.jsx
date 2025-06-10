// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Table, InputNumber, Switch } from "antd";
// import { BiDollar } from "react-icons/bi";
// import {
//   updateExtra,
//   toggleExtraInclude,
//   calculateTotals,
// } from "../../../redux/features/ReservationSlice";
// import { useGetExtraQuery } from "../../../redux/apiSlices/extra";

// const StepThree = () => {
//   const { data: extraData } = useGetExtraQuery();
//   console.log("extraDataF3", extraData?.data?.result);

//   const dispatch = useDispatch();
//   const { extras } = useSelector((state) => state.carRental);

//   const handleSwitchChange = (checked, index) => {
//     dispatch(toggleExtraInclude(index));
//   };

//   const handleQtyChange = (value, index) => {
//     dispatch(updateExtra({ index, field: "qty", value }));
//   };

//   const handlePriceChange = (value, index) => {
//     dispatch(updateExtra({ index, field: "price", value }));
//   };

//   // Calculate totals whenever extras change
//   useEffect(() => {
//     dispatch(calculateTotals());
//   }, [extras, dispatch]);

//   const columns = [
//     {
//       title: "Include",
//       dataIndex: "includeStatus",
//       key: "includeStatus",
//       render: (text, record, index) => (
//         <Switch
//           checked={record.includeStatus}
//           onChange={(checked) => handleSwitchChange(checked, index)}
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
//       render: (text, record, index) => (
//         <InputNumber
//           min={1}
//           value={record.qty}
//           onChange={(value) => handleQtyChange(value, index)}
//           disabled={!record.includeStatus}
//         />
//       ),
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       render: (text, record, index) => (
//         <div className="flex items-center gap-4">
//           {record.price === 0 ? (
//             <div className="flex items-center gap-2">
//               <span className="text-green-600 font-medium">Free</span>
//             </div>
//           ) : (
//             <InputNumber
//               addonBefore={<BiDollar />}
//               min={0}
//               value={record.price}
//               onChange={(value) => handlePriceChange(value, index)}
//               className="w-24"
//               disabled={!record.includeStatus}
//             />
//           )}
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
//         dataSource={extras}
//         pagination={false}
//         rowKey={(record, index) => index}
//       />
//     </div>
//   );
// };

// export default StepThree;

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, InputNumber, Switch, Spin, Alert } from "antd";
import { BiDollar } from "react-icons/bi";
import {
  initializeExtras,
  updateExtra,
  toggleExtraInclude,
  calculateTotals,
} from "../../../redux/features/ReservationSlice";
import { useGetExtraQuery } from "../../../redux/apiSlices/extra";

const StepThree = () => {
  const { data: extraData, isLoading, error } = useGetExtraQuery();
  const dispatch = useDispatch();
  const {
    extras,
    extrasInitialized,
    selectedExtraIds, // Access the selected IDs from Redux
  } = useSelector((state) => state.carRental);

  // Initialize extras from API data when component mounts or data changes
  useEffect(() => {
    if (extraData?.data?.result?.status === "ACTIVE" && !extrasInitialized) {
      dispatch(initializeExtras(extraData.data.result));
    }
  }, [extraData, extrasInitialized, dispatch]);

  const handleSwitchChange = (checked, index) => {
    dispatch(toggleExtraInclude(index));
  };

  const handleQtyChange = (value, index) => {
    dispatch(updateExtra({ index, field: "qty", value: value || 1 }));
  };

  const handlePriceChange = (value, index) => {
    dispatch(updateExtra({ index, field: "price", value: value || 0 }));
  };

  // Calculate totals whenever extras change
  useEffect(() => {
    dispatch(calculateTotals());
  }, [extras, dispatch]);

  // Debug: Log selected IDs whenever they change
  useEffect(() => {
    console.log("Selected Extra IDs:", selectedExtraIds);
  }, [selectedExtraIds]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin size="large" />
        <span className="ml-2">Loading extras...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert
        message="Error Loading Extras"
        description={`Failed to load extra services: ${
          error.message || "Unknown error"
        }`}
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  // Show message if no extras available
  if (!extras || extras.length === 0) {
    return (
      <Alert
        message="No Extra Services Available"
        description="There are currently no extra services available for selection."
        type="info"
        showIcon
        className="mb-4"
      />
    );
  }

  const columns = [
    {
      title: "Include",
      dataIndex: "includeStatus",
      key: "includeStatus",
      width: 100,
      align: "center",
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
      width: 200,
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record._id && (
            <div className="text-xs text-gray-400">ID: {record._id}</div>
          )}
        </div>
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <InputNumber
          min={1}
          max={10}
          value={record.qty}
          onChange={(value) => handleQtyChange(value, index)}
          disabled={!record.includeStatus}
          size="small"
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "center",
      render: (text, record, index) => (
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            {record.price === 0 ? (
              <div className="text-green-600 font-semibold px-2 py-1 bg-green-50 rounded">
                Free
              </div>
            ) : (
              <div className="flex items-center">
                <BiDollar className="text-gray-500" />
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  value={record.price}
                  onChange={(value) => handlePriceChange(value, index)}
                  className="w-20"
                  disabled={!record.includeStatus}
                  size="small"
                />
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            {record.description || "One Time"}
          </div>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 120,
      align: "right",
      render: (text, record) => {
        const total = record.includeStatus ? record.price * record.qty : 0;
        return (
          <span
            className={`font-semibold ${
              total > 0 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            ${total.toFixed(2)}
          </span>
        );
      },
    },
  ];

  // Calculate summary totals
  const selectedExtrasCount = extras.filter(
    (extra) => extra.includeStatus
  ).length;
  const totalExtrasAmount = extras.reduce(
    (sum, extra) => sum + (extra.includeStatus ? extra.price * extra.qty : 0),
    0
  );

  return (
    <div className="step-three-container">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Select Extra Services</h3>
        <p className="text-gray-600 text-sm">
          Choose additional services for your rental. Free services are marked
          in green.
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={extras}
        pagination={false}
        rowKey={(record) => record._id || record.name}
        size="middle"
        className="extras-table"
        scroll={{ x: 700 }}
      />

      {/* Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{selectedExtrasCount}</span> extra
            service(s) selected
          </div>
          <div className="text-lg font-semibold text-blue-600">
            Total Extras: ${totalExtrasAmount.toFixed(2)}
          </div>
        </div>

        {/* Debug Info - Selected IDs */}
        {selectedExtraIds.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <strong>Selected IDs:</strong> {selectedExtraIds.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepThree;
