import React, { useState } from "react";
import { Popover, Button } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { HiDotsVertical } from "react-icons/hi";
import { FaBan } from "react-icons/fa";
import GetPageName from "./GetPageName";

const FaqPopover = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pageName = GetPageName();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  switch (pageName) {
    case "Service Provider List":
      return (
        <Popover
          content={
            <div className="flex flex-row items-center gap-2">
              <Button icon={<EditFilled />} type="text" onClick={showModal} />
              <Button
                icon={<FaBan />}
                type="text"
                danger
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
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

    case "Faq":
      return (
        <Popover
          content={
            <div className="flex flex-row items-center gap-2">
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
                  onDelete();
                  setIsOpen(false);
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
  }
};

export default FaqPopover;
