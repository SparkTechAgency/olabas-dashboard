import React, { useState } from "react";
import { Popover, Button } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { HiDotsVertical } from "react-icons/hi";
import { FaBan } from "react-icons/fa";

const PopOverED = ({ onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      content={
        <div className="flex items-center gap-2">
          <Button
            icon={<EditFilled />}
            type="text"
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
          />
          <Button
            icon={<DeleteFilled />}
            type="text"
            danger
            onClick={() => {
              setIsOpen(false); // Close the popover after banning
            }}
          />
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

export default PopOverED;
