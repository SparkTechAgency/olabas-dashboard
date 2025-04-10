import React, { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import moment from "moment";
// import Loading from "../../components/common/Loading";

const Notifications = () => {
  const [combinedNotifications, setCombinedNotifications] = useState([
    {
      _id: "1",
      message: "Your task has been marked as completed.",
      createdAt: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      read: false,
    },
    {
      _id: "2",
      message: "New comment on your post.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true,
    },
    {
      _id: "3",
      message: "Reminder: Team meeting at 3 PM.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
    },
  ]);

  const formatTime = (timestamp) =>
    timestamp ? moment(timestamp).fromNow() : "Just now";

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3 text-white">
        <h2 className="text-[22px] text-smart">All Notifications</h2>
        <button
          className="bg-smart h-10 px-4 rounded-md"
          onClick={() => {
            setCombinedNotifications((prev) =>
              prev.map((notification) => ({ ...notification, read: true }))
            );
          }}
        >
          Mark All as Read
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
                <p>{notification.message || "New Notification"}</p>
                <p className="text-gray-400 text-sm">
                  {formatTime(notification.createdAt)}
                </p>
              </div>
              {!notification.read && (
                <button
                  className="text-blue-500 text-sm ml-auto"
                  onClick={() => {
                    setCombinedNotifications((prev) =>
                      prev.map((item) =>
                        item._id === notification._id
                          ? { ...item, read: true }
                          : item
                      )
                    );
                  }}
                >
                  Mark as Read
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
