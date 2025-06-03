import { useState, useEffect } from "react";
import { Table, Button, Spin, Alert } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import { LuDownload } from "react-icons/lu";
import { GrFormAdd } from "react-icons/gr";

import GetPageName from "../../../components/common/GetPageName";
import CustomSearch from "../../../components/common/CustomSearch";
import AddNewModal from "./AddNewModal";
import VehicleInfoModal from "./VehicleInfoModal";
import { useGetFleetQuery } from "../../../redux/apiSlices/fleetManagement";

function FleetManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { data: fleetData, isLoading, isError, error } = useGetFleetQuery();

  console.log(fleetData?.data?.result);
  // Transform API data to match your table structure
  useEffect(() => {
    if (fleetData?.data?.result && Array.isArray(fleetData.data.result)) {
      const transformedData = fleetData?.data.result.map((vehicle, index) => ({
        key: vehicle.id || index + 1,
        licensePlate: vehicle.licenseNumber || "N/A",
        carModel: vehicle.model || "Unknown Model",
        carType: vehicle.vehicleType || "Unknown Type",
        fuelType: vehicle.fuelType || "Unknown Fuel",
        dailyRate: vehicle.dailyRate ? `$${vehicle.dailyRate}` : "N/A",
        status: vehicle.status || "Available", // You may need to map this based on your API
        lastMaintenanceDate: vehicle.lastMaintenanceDate || "N/A",
        // Store original data for modal
        originalData: vehicle,
      }));
      setData(transformedData);
    }
  }, [fleetData]);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  const handleSearch = (value) => setSearchQuery(value);

  const handleViewVehicle = (record) => {
    console.log("sss", record);
    setSelectedVehicle({
      vehicleId:
        record.originalData?.id ||
        `#VHC-${record.key.toString().padStart(4, "0")}`,
      vehicleName: record.originalData?.name,
      vehicleType: record.carType,
      vehicleModel: record.originalData?.model || "Unknown",
      engineType: record.fuelType,
      licensePlate: record.licensePlate,
      engineNumber: record.originalData?.engineNumber || "N/A",
      fuelType: record.fuelType,
      transmissionType: record.originalData?.transmissionType || "Automatic",
      numberOfSeats: record.originalData?.noOfSeats || "N/A",
      numberOfDoors: record.originalData?.noOfDoors || "N/A",
      numberOfLuggage: record.originalData?.noOfSeats || "N/A",
      dailyRate: record.dailyRate,
      brand: record.originalData?.brand || "Unknown Brand",
      image: record.originalData?.image,
    });
    setVehicleModalVisible(true);
  };

  const filteredData = data.filter(
    ({
      licensePlate,
      carModel,
      carType,
      fuelType,
      dailyRate,
      lastMaintenanceDate,
    }) => {
      const query = searchQuery.toLowerCase();
      return (
        licensePlate.toLowerCase().includes(query) ||
        carModel.toLowerCase().includes(query) ||
        carType.toLowerCase().includes(query) ||
        fuelType.toLowerCase().includes(query) ||
        dailyRate.toLowerCase().includes(query) ||
        lastMaintenanceDate.toLowerCase().includes(query)
      );
    }
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleDelete = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: "License Plate",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Car Model",
      dataIndex: "carModel",
      key: "carModel",
    },
    {
      title: "Car Type",
      dataIndex: "carType",
      key: "carType",
    },
    {
      title: "Fuel Type",
      dataIndex: "fuelType",
      key: "fuelType",
    },
    {
      title: "Daily Rate",
      dataIndex: "dailyRate",
      key: "dailyRate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const getStatusColor = (status) => {
          switch (status) {
            case "AVAILABLE":
              return "bg-[#90BE6D]";
            case "Under Maintanence":
              return "bg-[#F2AF1E]";
            case "RENTED":
              return "bg-[#F37272]";
            default:
              return "bg-gray-400";
          }
        };
        return (
          <div className="flex justify-start">
            <span
              className={`text-xs font-light text-white px-2 py-0.5 rounded ${getStatusColor(
                text
              )}`}
            >
              {text}
            </span>
          </div>
        );
      },
    },
    {
      title: "Last Maintenance Date",
      dataIndex: "lastMaintenanceDate",
      key: "lastMaintenanceDate",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            className="p-1 border-smart"
            onClick={() => handleViewVehicle(record)}
          >
            <AiOutlineEye size={20} className="text-black" />
          </Button>
        </div>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-4">
        <Alert
          message="Error Loading Fleet Data"
          description={
            error?.message || "Failed to load vehicle data. Please try again."
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <FleetHeader
        onSearch={handleSearch}
        selectedRowKeys={selectedRowKeys}
        handleDelete={handleDelete}
        filteredData={filteredData}
        showModal={showModal}
      />

      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={filteredData}
        size="default"
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: false,
          showQuickJumper: true,
          position: ["bottomRight"],
        }}
        showSorterTooltip={{ target: "sorter-icon" }}
        loading={isLoading}
      />

      <AddNewModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />

      <VehicleInfoModal
        visible={vehicleModalVisible}
        onCancel={() => setVehicleModalVisible(false)}
        vehicleData={selectedVehicle}
      />
    </>
  );
}

export default FleetManagement;

function FleetHeader({
  onSearch,
  selectedRowKeys,
  handleDelete,
  filteredData,
  showModal,
}) {
  return (
    <div>
      <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
      <div className="flex justify-between items-center py-5">
        <Button
          icon={<GrFormAdd size={25} />}
          onClick={showModal}
          className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
        >
          Add Vehicle
        </Button>
        <div className="flex gap-3">
          <CustomSearch onSearch={onSearch} placeholder="Search..." />
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
            >
              Delete ({selectedRowKeys.length})
            </Button>
          )}
          <Button
            icon={<LuDownload />}
            className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
          >
            Export ({filteredData.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
