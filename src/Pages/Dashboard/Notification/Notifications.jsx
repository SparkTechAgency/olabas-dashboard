import React, { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import moment from "moment";
import {
  useNotificationQuery,
  useReadOneMutation,
  useReadAllMutation,
} from "../../../redux/apiSlices/notificationApi";
// import Loading from "../../components/common/Loading";

const Notifications = () => {
  const [combinedNotifications, setCombinedNotifications] = useState([]);

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useNotificationQuery();
  console.log("notifications", notifications);

  const [markOneAsRead, { isLoading: isMarkingOne }] = useReadOneMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useReadAllMutation();

  // Update combinedNotifications when API data is received
  useEffect(() => {
    if (notifications?.data?.result && notifications.data.result.length > 0) {
      setCombinedNotifications(notifications.data.result);
    }
  }, [notifications]);

  const formatTime = (timestamp) =>
    timestamp ? moment(timestamp).fromNow() : "Just now";

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();

      // Update local state immediately for better UX
      setCombinedNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      // Refetch to get updated data from server
      refetch();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      // You can add toast notification here if you have one
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markOneAsRead(notificationId).unwrap();

      // Update local state immediately for better UX
      setCombinedNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, read: true } : item
        )
      );

      // Refetch to get updated data from server
      refetch();
    } catch (error) {
      console.error("Failed to mark as read:", error);
      // You can add toast notification here if you have one
    }
  };

  if (isLoading) {
    return (
      <div className="px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400">Error loading notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3 text-white">
        <h2 className="text-[22px] text-smart">All Notifications</h2>
        <button
          className="bg-smart h-10 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleMarkAllAsRead}
          disabled={isMarkingAll}
        >
          {isMarkingAll ? "Marking..." : "Mark All as Read"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {combinedNotifications && combinedNotifications.length > 0 ? (
          combinedNotifications.map((notification) => (
            <div
              key={notification._id}
              className="border-b pb-2 border-gray-500 flex items-center gap-3"
            >
              <FaRegBell
                size={50}
                className={`text-smart bg-[#00000033] p-2 rounded-md ${
                  !notification.read ? "animate-bounce" : ""
                }`}
              />
              <div className="text-black">
                <p>
                  {notification.text ||
                    notification.message ||
                    "New Notification"}
                </p>
                <p className="text-gray-400 text-sm">
                  {formatTime(notification.createdAt || notification.updatedAt)}
                </p>
              </div>
              {!notification.read && (
                <button
                  className="text-blue-500 text-sm ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleMarkAsRead(notification._id)}
                  disabled={isMarkingOne}
                >
                  {isMarkingOne ? "Marking..." : "Mark as Read"}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
