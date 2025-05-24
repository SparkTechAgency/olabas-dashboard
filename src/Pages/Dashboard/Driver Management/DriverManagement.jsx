import { useState } from "react";
import { Button } from "antd";
import GetPageName from "../../../components/common/GetPageName";
import App from "./Table";
import { GrFormAdd } from "react-icons/gr";
import DriverInformationModal from "./DriverInformationModal";
import { useSidebar } from "../../../Context/SidebarContext";

function DriverManagement() {
  const handleSearch = () => {};
  const handleDelete = () => {};
  const { isCollapsed } = useSidebar();
  console.log(isCollapsed);
  return (
    <div
      className={`h-40 driver-management-container transition-all duration-300 ${
        isCollapsed
          ? "w-full sm:w-[94vw] md:w-[94vw] lg:w-[94vw]"
          : "w-full sm:w-[100vw] md:w-[90vw] lg:w-[85vw]"
      }`}
    >
      <Header
        onSearch={handleSearch}
        pagename="Transactions"
        handleDelete={handleDelete}
      />
      <App />
    </div>
  );
}

export default DriverManagement;

// Header Component
const Header = ({ pagename }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOk = () => {
    console.log("Modal OK clicked");
    setModalOpen(false);
  };

  const handleCancel = () => {
    console.log("Modal Cancel clicked");
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-between items-start py-5">
      <h1 className="text-[20px] font-medium">{GetPageName() || pagename}</h1>
      <div className="w-full flex  items-center justify-between  mt-5">
        <div className=" flex gap-3">
          <button className="bg-[#ED5565] text-white hover:bg-[#ED5565]/80 text-xs px-2 h-7 rounded">
            Booked
          </button>
          <button className="bg-[#F2AF1E] text-white hover:bg-[#F2AF1E]/80 text-xs px-2 h-7 rounded">
            Completed
          </button>
        </div>
        <Button
          icon={<GrFormAdd size={25} />}
          className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
          onClick={() => {
            console.log("Add Driver clicked"); // Debug log
            setModalOpen(true);
          }}
        >
          Add Driver
        </Button>

        <DriverInformationModal
          isModalOpen={modalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          open={modalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};
