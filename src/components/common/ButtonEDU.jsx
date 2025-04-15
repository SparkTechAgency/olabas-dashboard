import React from "react";

const ButtonEDU = ({ actionType, onClick, children }) => {
  const getButtonStyles = () => {
    switch (actionType) {
      case "add":
        return "bg-[#04bf61] bg-smart text-white text-xs w-28 h-8 rounded-md border border-none transition-all duration-300 hover:bg-[04bf61]/80 hover:text-white";
      case "update":
        return "bg-[#04bf61] text-white text-xs w-28 h-8 rounded-md border border-none  transition-all duration-300 hover:bg-[04bf61]/80 hover:text-white";
      case "save":
        return "bg-[#04bf61] text-white text-xs w-28 h-8 rounded-md borderborder-none  transition-all duration-300 hover:bg-[04bf61]/80 hover:text-white";
      case "edit":
        return "bg-[#04bf61] text-white text-xs w-28 h-8 rounded-md border border-[#04bf61] transition-all duration-300 hover:bg-[04bf61]/80 hover:text-white";
      case "delete":
        return "bg-red-600 text-white text-xs w-28 h-8 rounded-md border border-red-600 transition-all duration-300 hover:bg-[04bf61]/80 hover:text-white hover:bg-red-600/80";
      case "cancel":
        return "bg-gray-300 text-black text-xs w-28 h-8 rounded-md border border-gray-400 transition-all duration-300 hover:bg-[04bf61]/80 hover:text-gray-600";
      default:
        return "bg-[#04bf61] text-white text-xs w-28 h-8 rounded-md border border-[#04bf61] transition-all duration-300 hover:bg-[04bf61]/80 hover:text-white";
    }
  };

  return (
    <button
      className={`${getButtonStyles()} flex items-center justify-center font-semibold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonEDU;
