import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Avatar, ConfigProvider, Flex, Popover } from "antd";

import { CgMenu } from "react-icons/cg";
import NotificationPopover from "../../Pages/Dashboard/Notification/NotificationPopover";
import { RiSettings5Line, RiShutDownLine } from "react-icons/ri";
import { useSidebar } from "../../Context/SidebarContext";
import { useProfileQuery } from "../../redux/apiSlices/authApi";
import { getImageUrl } from "../../utils/baseUrl";

const Header = () => {
  const { toggleSidebar } = useSidebar();

  const { data: userprofile } = useProfileQuery();

  console.log(userprofile?.data?.image);

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
            content={<NotificationPopover />}
            trigger="click"
            arrow={false}
            placement="bottom"
          >
            <div className="w-12 h-12 bg-[#cfd4ff] flex items-center justify-center rounded-md relative cursor-pointer">
              <FaRegBell size={30} className="text-smart" />
              <Badge
                count={2}
                overflowCount={5}
                size="small"
                color="red"
                className="absolute top-2 right-3 "
              />
            </div>
          </Popover>

          <Popover
            content={userMenuContent}
            trigger="click"
            arrow={false}
            placement="bottomLeft"
          >
            <Avatar
              shape="square"
              size={60}
              className="rounded cursor-pointer"
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
