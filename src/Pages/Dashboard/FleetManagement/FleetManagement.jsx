import { useState, useEffect } from "react";
import { Table, Button, Spin, Alert, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AiOutlineEye } from "react-icons/ai";
import { LuDownload } from "react-icons/lu";
import { GrFormAdd } from "react-icons/gr";
import { FiEdit3 } from "react-icons/fi";
import GetPageName from "../../../components/common/GetPageName";
import CustomSearch from "../../../components/common/CustomSearch";
import VehicleModal from "./VehicleModal";
import VehicleInfoModal from "./VehicleInfoModal";
import {
  useDeleteFleetMutation,
  useGetFleetQuery,
} from "../../../redux/apiSlices/fleetManagement";
import { IoTrashBinOutline } from "react-icons/io5";
import DeleteModal from "../../../components/common/deleteModal";

function FleetManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState(null);

  // View modal states
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Delete modal states
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [deleteFleet, { isLoading: isDeleting }] = useDeleteFleetMutation();

  const {
    data: fleetData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFleetQuery();

  // Transform API data to match your table structure
  useEffect(() => {
    if (fleetData?.data?.result && Array.isArray(fleetData.data.result)) {
      const transformedData = fleetData.data.result.map((vehicle, index) => ({
        key: vehicle.id || index + 1,
        licensePlate: vehicle.licenseNumber || "N/A",
        carModel: vehicle.model || "Unknown Model",
        carType: vehicle.vehicleType || "Unknown Type",
        fuelType: vehicle.fuelType || "Unknown Fuel",
        dailyRate: vehicle.dailyRate ? `$${vehicle.dailyRate}` : "N/A",
        status: vehicle.status || "Available",
        lastMaintenanceDate: vehicle.lastMaintenanceDate || "N/A",
        originalData: vehicle,
      }));
      setData(transformedData);
    }
  }, [fleetData]);

  // Modal handlers for Add/Edit
  const handleAddNew = () => {
    setModalMode("add");
    setSelectedVehicleForEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setModalMode("edit");
    setSelectedVehicleForEdit(record.originalData);
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    setSelectedVehicleForEdit(null);
    refetch();
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedVehicleForEdit(null);
  };

  // Delete Confirmation for single vehicle from row
  const handleConfirmDelete = async () => {
    if (vehicleToDelete?.originalData?.id) {
      try {
        const res = await deleteFleet(vehicleToDelete.originalData.id).unwrap();
        refetch();
        if (res.success) {
          message.success("Fleet successfully deleted");
        } else {
          message.error("Failed to delete fleet");
        }
      } catch (err) {
        message.err(err);
        console.error("Failed to delete vehicle:", err);
      }
    }
    setIsDeleteModalVisible(false);
    setVehicleToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setVehicleToDelete(null);
  };

  // Delete multiple selected vehicles
  const handleDelete = async () => {
    try {
      // For each selected vehicle key, find its ID and delete
      await Promise.all(
        selectedRowKeys.map(async (key) => {
          const vehicle = data.find((item) => item.key === key);
          if (vehicle?.originalData?.id) {
            await deleteFleet(vehicle.originalData.id).unwrap();
          }
        })
      );
      setSelectedRowKeys([]);
      refetch();
    } catch (err) {
      console.error("Failed to delete selected vehicles:", err);
    }
  };

  // View modal handlers
  const handleViewVehicle = (record) => {
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
      numberOfLuggage: record.originalData?.noOfLuggages || "N/A",
      dailyRate: record.dailyRate,
      brand: record.originalData?.brand || "Unknown Brand",
      image: record.originalData?.image,
    });
    setVehicleModalVisible(true);
  };

  const handleSearch = (value) => setSearchQuery(value);

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
          switch (status.toUpperCase()) {
            case "AVAILABLE":
              return "bg-[#90BE6D]";
            case "UNDER MAINTENANCE":
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
            title="View Details"
          >
            <AiOutlineEye size={20} className="text-black" />
          </Button>

          <Button
            className="p-1 border-smart"
            onClick={() => handleEdit(record)}
            title="Edit Vehicle"
          >
            <FiEdit3 size={20} className="text-black" />
          </Button>

          <Button
            className="p-1 border-smart"
            onClick={() => {
              setVehicleToDelete(record);
              setIsDeleteModalVisible(true);
            }}
            title="Delete Vehicle"
          >
            <IoTrashBinOutline size={20} className="text-black" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

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
        showModal={handleAddNew}
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
        loading={isLoading || isDeleting}
      />

      <VehicleModal
        isModalOpen={isModalOpen}
        handleOk={handleModalOk}
        handleCancel={handleModalCancel}
        mode={modalMode}
        vehicleData={selectedVehicleForEdit}
      />

      <VehicleInfoModal
        visible={vehicleModalVisible}
        onCancel={() => setVehicleModalVisible(false)}
        vehicleData={selectedVehicle}
      />

      <DeleteModal
        name={vehicleToDelete?.licensePlate}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        visible={isDeleteModalVisible}
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
