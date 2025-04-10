import React, { useState } from "react";
import { Popover, Button, message } from "antd";
import { EditFilled } from "@ant-design/icons";
import { HiDotsVertical } from "react-icons/hi";
import { FaBan } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";

const PopOver = ({ onEdit, onBan }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      content={
        <div className="flex items-center gap-2">
          <Button
            className="bg-sky-400/50 hover:bg-sky-400 p-2 "
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
          >
            <FiEdit2 size={15} />
          </Button>
          <Button
            className="bg-red-400/50 hover:bg-red-400 p-2 "
            onClick={() => {
              onBan();
              setIsOpen(false); // Close the popover after banning
            }}
          >
            <FaBan />
          </Button>
        </div>
      }
      trigger="hover"
      placement="bottom"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <HiDotsVertical size={20} className="cursor-pointer" />
    </Popover>
  );
};

export default PopOver;
