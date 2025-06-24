import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, InputNumber, Switch, Spin, Alert, Tag } from "antd";
import { BiDollar } from "react-icons/bi";
import {
  initializeExtras,
  updateExtra,
  toggleExtraInclude,
  calculateTotals,
  setSelectedExtraIds,
} from "../../../redux/features/ReservationSlice"; // Adjust path as needed
import { useGetExtraQuery } from "../../../redux/apiSlices/extra";

const StepThree = ({ isClicked, setIsClicked }) => {
  const {
    data: extraData,
    isLoading,
    error,
  } = useGetExtraQuery({ page: null, limit: null });
  console.log("Extra Data:", extraData); // Debug: Log the fetched extra data

  const dispatch = useDispatch();
  const {
    extras,
    extrasInitialized,
    selectedExtraIds, // Access the selected IDs from Redux
  } = useSelector((state) => state.carRental);

  // Function to save extra services to Redux
  const saveExtraServicesToRedux = () => {
    // Filter only the selected extras and create the array of IDs
    const selectedIds = extras
      .filter((extra) => extra.includeStatus)
      .map((extra) => extra._id)
      .filter(Boolean); // Remove any undefined/null IDs

    // Update the selectedExtraIds in Redux
    dispatch(setSelectedExtraIds(selectedIds));

    // Recalculate totals
    dispatch(calculateTotals());

    console.log("Extra services data saved to Redux:", {
      selectedExtraIds: selectedIds,
      selectedExtras: extras.filter((extra) => extra.includeStatus),
    });

    // Set isClicked to false after saving
    setIsClicked(false);
  };

  // Initialize extras from API data when component mounts or data changes
  useEffect(() => {
    if (extraData?.data?.result && !extrasInitialized) {
      // Check if the data has the expected structure
      if (Array.isArray(extraData.data.result)) {
        dispatch(initializeExtras(extraData.data.result));
      } else if (
        extraData.data.result.status === "ACTIVE" &&
        Array.isArray(extraData.data.result.items)
      ) {
        // If the API returns an object with items array
        dispatch(initializeExtras(extraData.data.result.items));
      } else {
        console.warn(
          "Unexpected API response structure:",
          extraData.data.result
        );
      }
    }
  }, [extraData, extrasInitialized, dispatch]);

  const handleSwitchChange = (checked, index) => {
    dispatch(toggleExtraInclude(index));
    // Recalculate totals after toggle
    dispatch(calculateTotals());
  };

  const handleQtyChange = (value, index) => {
    dispatch(updateExtra({ index, field: "qty", value: value || 1 }));
    // Recalculate totals after quantity change
    dispatch(calculateTotals());
  };

  const handlePriceChange = (value, index) => {
    dispatch(updateExtra({ index, field: "price", value: value || 0 }));
    // Recalculate totals after price change
    dispatch(calculateTotals());
  };

  // Debug: Log selected IDs whenever they change
  useEffect(() => {
    console.log("Selected Extra IDs from Redux:", selectedExtraIds);
  }, [selectedExtraIds]);

  // Save to Redux when isClicked is true
  useEffect(() => {
    console.log("Current extras in Redux:", extras);
    if (isClicked && extras && extras.length > 0) {
      saveExtraServicesToRedux();
    } else if (isClicked) {
      // Handle case where no extras are available but save was requested
      console.log("No extras available to save");
      setIsClicked(false);
    }
  }, [isClicked, extras]);

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
          {record.description && (
            <div className="text-xs text-gray-500 mt-1">
              {record.description}
            </div>
          )}
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
      render: (text, record) => {
        const total = record.includeStatus ? record.price * record.qty : 0;
        return (
          <div className="text-right">
            <span
              className={`font-semibold ${
                total > 0 ? "text-green-600" : "text-gray-400"
              }`}
            >
              ${total.toFixed(2)}
            </span>
            {record.includeStatus && record.isPerDay && (
              <div className="text-xs text-gray-500 mt-1">per day</div>
            )}
          </div>
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
          in green. Per-day charges will be calculated based on your rental
          duration.
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={extras}
        pagination={false}
        rowKey={(record) => record._id || record.name}
        size="middle"
        className="extras-table"
        scroll={{ x: 800 }}
      />

      {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{selectedExtrasCount}</span> extra
            service(s) selected
          </div>
          <div className="text-lg font-semibold text-green-600">
            Total Extras: ${totalExtrasAmount.toFixed(2)}
          </div>
        </div>

       
        {selectedExtrasCount > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex flex-wrap gap-4">
              {extras.filter((extra) => extra.includeStatus && extra.isPerDay)
                .length > 0 && (
                <span>
                  <strong>Per Day:</strong>{" "}
                  {
                    extras.filter(
                      (extra) => extra.includeStatus && extra.isPerDay
                    ).length
                  }{" "}
                  service(s)
                </span>
              )}
              {extras.filter((extra) => extra.includeStatus && !extra.isPerDay)
                .length > 0 && (
                <span>
                  <strong>One Time:</strong>{" "}
                  {
                    extras.filter(
                      (extra) => extra.includeStatus && !extra.isPerDay
                    ).length
                  }{" "}
                  service(s)
                </span>
              )}
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default StepThree;
