import React from "react";
import { Link } from "react-router-dom";
import { Spin, Tag, Button, ConfigProvider } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { MdOutlineMarkEmailRead, MdCancel } from "react-icons/md";
import moment from "moment";

import EmptyNotification from "../../assets/quiloco/EmptyNotification.png";
import {
  useNotificationQuery,
  useReadAllMutation,
  useReadMutation,
} from "../../redux/apiSlices/notificationSlice";

const NotificationPopover = ({ onNotificationRead }) => {
  const {
    data: notifications,
    refetch,
    isLoading: notificationLoading,
  } = useNotificationQuery();

  const [readNotification, { isLoading: updateLoading }] = useReadMutation();
  const [readAllNotifications, { isLoading: readAllLoading }] =
    useReadAllMutation();

  const displayedNotifications = notifications?.data?.result || [];

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

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    // Add navigation or other actions here if needed
  };

  const markAsRead = async (id) => {
    try {
      await readNotification(id);
      // Refresh the notifications list to show updated UI
      await refetch();
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const removeMessage = (id) => {
    // Implement delete functionality if needed
    console.log("Delete notification:", id);
  };

  const handleReadAll = async () => {
    try {
      await readAllNotifications();
      await refetch();
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: "#a11d26",
            defaultColor: "#ffffff",
            defaultHoverBg: "#a11d26",
            defaultHoverColor: "#ffffff",
            defaultHoverBorderColor: "#a11d26",
            defaultActiveBg: "#a11d26",
            defaultActiveColor: "#ffffff",
            defaultActiveBorderColor: "none",
          },
        },
      }}
    >
      <div className="w-72 max-h-96 flex flex-col bg-black">
        {notificationLoading ? (
          <div className="p-4 text-center text-white">
            <Spin size="small" />
          </div>
        ) : displayedNotifications?.length > 0 ? (
          <>
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
              <h3 className="text-white font-medium">Notifications</h3>
              {displayedNotifications.some((item) => !item.read) && (
                <Button
                  size="small"
                  onClick={handleReadAll}
                  loading={readAllLoading}
                  className="text-xs"
                >
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
              {displayedNotifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`w-full min-h-16 flex items-start justify-between gap-3 p-3 my-1 rounded-md cursor-pointer hover:bg-gray-800 ${
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
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-gray-300 text-xs whitespace-pre-line">
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
                <Button className="rounded-lg">See all</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col gap-1 items-center justify-center bg-black py-3 px-2">
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
              <Button className="w-32 rounded-lg mt-2">See details</Button>
            </Link>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default NotificationPopover;
