// import React, { useState } from "react";
// import { Button, Table } from "antd";
// import GetPageName from "../../../components/common/GetPageName";
// import App from "./Table";
// import { GrFormAdd } from "react-icons/gr";
// import DriverInformationModal from "./DriverInformationModal";

// // Main Page Component
// function DriverManagement() {
//   const handleSearch = () => {};
//   const handleDelete = () => {};

//   return (
//     <div className="sm:w-[85vw] h-40 driver-management-container ">
//       <Header
//         onSearch={handleSearch}
//         pagename="Transactions"
//         handleDelete={handleDelete}
//       />
//       <App />
//     </div>
//   );
// }

// export default DriverManagement;

// // Header Component
// const Header = ({ pagename }) => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const handleOk = () => {
//     setModalOpen(false);
//   };
//   const handleCancel = () => {
//     setModalOpen(false);
//   };

//   return (
//     <div className="flex flex-col justify-between items-start py-5">
//       <h1 className="text-[20px] font-medium">{GetPageName() || pagename}</h1>
//       <div className="w-full flex  items-center justify-between  mt-5">
//         <div className=" flex gap-3">
//           <button className="bg-[#ED5565] text-white hover:bg-[#ED5565]/80 text-xs px-2 h-7 rounded">
//             Booked
//           </button>
//           <button className="bg-[#F2AF1E] text-white hover:bg-[#F2AF1E]/80 text-xs px-2 h-7 rounded">
//             Completed
//           </button>
//         </div>
//         <Button
//           icon={<GrFormAdd size={25} />}
//           className="bg-smart hover:bg-smart text-white border-none h-8 flex items-center"
//           onClick={() => setModalOpen(true)}
//         >
//           Add Driver
//         </Button>

//         <DriverInformationModal
//           isModalOpen={modalOpen}
//           handleOk={handleOk}
//           handleCancel={handleCancel}
//         />
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { Button, Table } from "antd";
import GetPageName from "../../../components/common/GetPageName";
import App from "./Table";
import { GrFormAdd } from "react-icons/gr";
import DriverInformationModal from "./DriverInformationModal";

// Main Page Component
function DriverManagement() {
  const handleSearch = () => {};
  const handleDelete = () => {};

  return (
    <div className="sm:w-[85vw] h-40 driver-management-container ">
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
    console.log("Modal OK clicked"); // Debug log
    setModalOpen(false);
  };

  const handleCancel = () => {
    console.log("Modal Cancel clicked"); // Debug log
    setModalOpen(false);
  };

  // Alternative: Single function to close modal
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
          // Alternative prop names in case your modal expects different props:
          open={modalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};
