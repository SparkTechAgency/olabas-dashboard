import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Spin, Tag, Button, ConfigProvider } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { MdOutlineMarkEmailRead, MdCancel } from "react-icons/md";
import moment from "moment";

import EmptyNotification from "../../../assets/EmptyNotification.png";

const NotificationPopover = ({ onNotificationRead }) => {
  const [notifications, setNotifications] = useState([
    {
      _id: "1",
      title: "Order Confirmed",
      message: "Your order #12345 has been confirmed.",
      type: "ORDER",
      createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 min ago
      read: false,
    },
    {
      _id: "2",
      title: "Message from Admin",
      message: "Please verify your profile information.",
      type: "MESSAGE",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hrs ago
      read: true,
    },
  ]);

  const [loading, setLoading] = useState(false);

  const formatTime = (timestamp) =>
    timestamp ? moment(timestamp).fromNow() : "Just now";

  const getTypeColor = (type) => {
    switch (type) {
      case "ORDER":
        return "blue";
      default:
        return "green";
    }
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, read: true } : item))
    );
    if (onNotificationRead) onNotificationRead();
  };

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    if (onNotificationRead) onNotificationRead();
  };

  const removeMessage = (id) => {
    setNotifications((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="w-72 max-h-96 flex flex-col bg-white ">
      {loading ? (
        <div className="p-4 text-center text-white">
          <Spin size="small" />
        </div>
      ) : notifications.length > 0 ? (
        <>
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
            <h3 className="text-black font-medium">Notifications</h3>
            {notifications.some((item) => !item.read) && (
              <Button size="small" onClick={handleReadAll} className="text-xs">
                Mark all as read
              </Button>
            )}
          </div>
          <div
            className="overflow-y-auto px-2 py-1
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              dark:[&::-webkit-scrollbar-track]:bg-neutral-700
              dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            {notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => markAsRead(item._id)}
                className={`w-full min-h-16 flex items-start justify-between gap-3 p-3 my-1 rounded-md cursor-pointer hover:bg-slate-100 ${
                  !item.read ? "border border-quilocoD" : ""
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center mt-1">
                    {item.type === "ORDER" ? "🛒" : "✉️"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      {item.type && (
                        <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-black font-medium">{item.title}</p>
                    <p className="text-gray-400 text-xs whitespace-pre-line">
                      {item.message}
                    </p>
                    {item.read && (
                      <div className="flex items-center mt-1 text-xs text-green-800">
                        <CheckCircleOutlined className="mr-1" /> Read
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(item._id);
                    }}
                    className="text-gray-400 hover:text-white"
                    title="Mark as read"
                    disabled={item.read}
                  >
                    <MdOutlineMarkEmailRead size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMessage(item._id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                    title="Delete"
                  >
                    <MdCancel size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 p-2 flex justify-between items-center">
            <Link to="/notification">
              <Button className="rounded-lg bg-smart border-none text-white">
                See all
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col gap-1 items-center justify-center bg-white py-3 px-2">
          <img
            src={EmptyNotification}
            width={120}
            height={150}
            alt="No notifications"
          />
          <p className="font-medium text-base text-center text-white">
            There's no notifications
          </p>
          <p className="text-wrap text-center text-[12px] text-gray-400">
            Your notifications will appear here.
          </p>
          <Link to="/notification">
            <Button className="w-32 rounded-lg mt-2 bg-smart text-white border-none">
              See details
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
