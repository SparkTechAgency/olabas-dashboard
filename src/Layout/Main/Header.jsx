import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Avatar, ConfigProvider, Flex, Popover, message } from "antd";
import { CgMenu } from "react-icons/cg";
import { io } from "socket.io-client";
import NotificationPopover from "../../Pages/Dashboard/Notification/NotificationPopover";
import { RiSettings5Line, RiShutDownLine } from "react-icons/ri";
import { useSidebar } from "../../Context/SidebarContext";
import { useProfileQuery } from "../../redux/apiSlices/authApi";
import { getImageUrl } from "../../utils/baseUrl";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

// Decode JWT outside component
let decodedToken = null;
const tokenStr = localStorage.getItem("accessToken");
const token = tokenStr || null;

if (token) {
  try {
    decodedToken = jwtDecode(token);
    console.log("🔓 Decoded JWT:", decodedToken);
  } catch (error) {
    console.error("❌ Failed to decode token:", error.message);
  }
}

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { data: userprofile } = useProfileQuery();
  const dispatch = useDispatch();

  // Notification state
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  // Socket.IO connection and notification handling
  useEffect(() => {
    const connectSocket = async () => {
      try {
        if (socketRef.current) {
          console.log("🔄 Disconnecting previous socket connection");
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        console.log("🔌 Attempting to connect to socket server...");
        // socketRef.current = io("ws://10.0.60.110:5000", {
        socketRef.current = io("https://pravab3001.binarybards.online", {
          auth: { token },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          randomizationFactor: 0.5,
        });

        socketRef.current.on("connect", () => {
          console.log("✅ Socket connected:", socketRef.current.id);
          setSocketConnected(true);
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
          setSocketConnected(false);
          if (reason === "io server disconnect") {
            setTimeout(() => {
              console.log("🔄 Attempting reconnection after server disconnect");
              socketRef.current.connect();
            }, 1000);
          }
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("❌ Socket connection error:", error.message);
          setSocketConnected(false);
          setTimeout(() => {
            console.log("🔄 Attempting reconnection after error");
            socketRef.current.connect();
          }, 2000);
        });

        // Set up notification channel
        let notificationChannel;
        const event = decodedToken?.id;
        if (event) {
          notificationChannel = `get-notification::${event}`;
        } else {
          console.error("❌ Cannot determine notification channel role");
          return;
        }

        console.log("📡 Setting up listener on channel:", notificationChannel);

        // Listen for notifications
        socketRef.current.on(notificationChannel, (data) => {
          console.log("📬 Received Notification Data:", data);

          let notification = data;

          if (typeof data === "string") {
            try {
              notification = JSON.parse(data);
            } catch (err) {
              console.error("⚠️ Failed to parse notification:", err);
              notification = {
                message: data,
                timestamp: new Date().toISOString(),
              };
            }
          }

          setNotifications((prev) => {
            const newNotifications = [notification, ...prev];
            console.log("📬 Updated notifications list:", newNotifications);
            return newNotifications;
          });

          setUnreadCount((prev) => {
            const newCount = prev + 1;
            console.log("📬 Updated unread count:", newCount);
            return newCount;
          });

          message.info("New notification received");
        });

        console.log(
          `👂 Listening for notifications on: ${notificationChannel}`
        );
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        message.error("Failed to connect to notification service");
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketConnected(false);
      }
    };
  }, []);

  // Handle notification read
  const handleNotificationRead = () => {
    console.log("📖 Marking all notifications as read");
    const readNotifications = notifications.map((n) => ({
      ...n,
      isRead: true,
    }));
    setNotifications(readNotifications);
    setUnreadCount(0);
  };

  console.log(userprofile?.data?.image);

  (() => {
    // Dispatch action to set profile data in Redux store
    if (userprofile?.data) {
      dispatch({
        type: "profile/setProfile",
        payload: {
          name: userprofile.data?.name,
          email: userprofile.data?.email,
          phone: userprofile.data?.phone,
          role: userprofile.data?.role,
          image: userprofile.data?.image,
        },
      });
    }
  })();

  const userMenuContent = (
    <div>
      <div className="mr-4 flex gap-2.5 font-semibold hover:text-black cursor-pointer">
        {userprofile?.data?.name}
      </div>
      <p>{userprofile?.data?.role}</p>
      <Link
        to="/settings"
        className="flex items-center gap-2 py-1 mt-1  text-black hover:text-smart"
      >
        <RiSettings5Line className="text-gray-400 animate-spin " />
        <span>Setting</span>
      </Link>
      <Link
        to="/auth/login"
        className="flex items-center gap-2 py-1  text-black hover:text-smart"
        onClick={() => localStorage.removeItem("accessToken")}
      >
        <RiShutDownLine className="text-red-500 animate-pulse" />
        <span>Log Out</span>
      </Link>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: "16px",
          colorPrimaryBorderHover: "red",
        },
        components: {
          Dropdown: {
            paddingBlock: "5px",
          },
        },
      }}
    >
      <Flex
        align="center"
        justify="between"
        className="w-100% min-h-[85px] px-4 py-2 shadow-sm overflow-auto text-slate-700 bg-white"
      >
        <div>
          <CgMenu
            size={25}
            onClick={toggleSidebar}
            className="cursor-pointer text-smart"
          />
        </div>

        <Flex align="center" gap={30} justify="flex-end" className="w-full">
          <Popover
            content={
              <NotificationPopover
                notifications={notifications}
                onRead={handleNotificationRead}
              />
            }
            trigger="click"
            arrow={false}
            placement="bottom"
            onOpenChange={(visible) => {
              if (visible) {
                console.log("🔔 Opening notification popover");
                handleNotificationRead();
              }
            }}
          >
            <div className="w-12 h-12 bg-[#ccf6c8] flex items-center justify-center rounded-md relative cursor-pointer">
              <FaRegBell size={30} className="text-smart" />
              {unreadCount > 0 && (
                <Badge
                  count={unreadCount}
                  overflowCount={5}
                  size="small"
                  color="red"
                  className="absolute top-2 right-3 "
                />
              )}
            </div>
          </Popover>

          <Popover
            content={userMenuContent}
            trigger="click"
            arrow={false}
            placement="bottomLeft"
          >
            <Avatar
              shape="circle"
              size={44}
              className="rounded-full cursor-pointer ring-2 ring-offset-2 ring-green-700"
              src={
                userprofile?.data?.image?.startsWith("http")
                  ? userprofile.data.image
                  : `${getImageUrl}${userprofile?.data?.image}`
              }
            />
          </Popover>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default Header;
