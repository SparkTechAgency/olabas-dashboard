import { useState } from "react";
import { Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import { LuDownload } from "react-icons/lu";
import { GrFormAdd } from "react-icons/gr";

import GetPageName from "../../../components/common/GetPageName";
import CustomSearch from "../../../components/common/CustomSearch";
import AddNewModal from "./AddNewModal";
import VehicleInfoModal from "./VehicleInfoModal";

// ✅ Initial vehicle data
const initialData = [
  {
    key: 1,
    licensePlate: "AB1 888C",
    carModel: "Toyota Camry",
    carType: "Sedan",
    fuelType: "Gasoline",
    dailyRate: "$50",
    status: "Available",
    lastMaintenanceDate: "2025-02-01",
  },
  {
    key: 2,
    licensePlate: "XY2 123Z",
    carModel: "Honda Accord",
    carType: "Sedan",
    fuelType: "Hybrid",
    dailyRate: "$60",
    status: "Available",
    lastMaintenanceDate: "2025-01-15",
  },
  {
    key: 3,
    licensePlate: "CD3 456E",
    carModel: "Ford Explorer",
    carType: "SUV",
    fuelType: "Diesel",
    dailyRate: "$80",
    status: "Rented",
    lastMaintenanceDate: "2025-03-05",
  },
  {
    key: 4,
    licensePlate: "EF4 789G",
    carModel: "Chevrolet Tahoe",
    carType: "SUV",
    fuelType: "Gasoline",
    dailyRate: "$90",
    status: "Under Maintanence",
    lastMaintenanceDate: "2025-02-20",
  },
  {
    key: 5,
    licensePlate: "GH5 012I",
    carModel: "Tesla Model 3",
    carType: "Sedan",
    fuelType: "Electric",
    dailyRate: "$100",
    status: "Rented",
    lastMaintenanceDate: "2025-03-10",
  },
];

function FleetManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  const handleSearch = (value) => setSearchQuery(value);

  const handleViewVehicle = (record) => {
    setSelectedVehicle({
      vehicleId: `#VHC-${record.key.toString().padStart(4, "0")}`,
      vehicleName: record.carModel,
      vehicleType: record.carType,
      vehicleModel: "2022",
      engineType: record.fuelType,
      licensePlate: record.licensePlate,
      engineNumber: "ABC123456",
      fuelType: record.fuelType,
      transmissionType: "Automatic",
      numberOfSeats: "5",
      numberOfDoors: "4",
      numberOfLuggage: "2",
      dailyRate: record.dailyRate,
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
            case "Available":
              return "bg-[#90BE6D]";
            case "Under Maintanence":
              return "bg-[#F2AF1E]";
            case "Rented":
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
