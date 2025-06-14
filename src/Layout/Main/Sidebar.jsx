import { FaQuoteRight, FaUserNurse } from "react-icons/fa6";
import { CgTemplate } from "react-icons/cg";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { SiAntdesign } from "react-icons/si";
import { TiThList } from "react-icons/ti";
import { RxDashboard, RxLapTimer } from "react-icons/rx";
import { PiMapPinAreaBold, PiWallet } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import {
  RiContactsBook3Line,
  RiTeamFill,
  RiUserSettingsFill,
} from "react-icons/ri";
import {
  MdCategory,
  MdOutlineDateRange,
  MdOutlineReportProblem,
} from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import logo from "../../assets/logo.png";
import { BiSolidCarMechanic } from "react-icons/bi";
import { FaTh, FaUserTie } from "react-icons/fa";
const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <RxDashboard size={24} />,
      label: <Link to="/">Overview</Link>,
    },

    {
      key: "/reservation",
      icon: <MdOutlineDateRange size={23} />,
      label: isCollapsed ? (
        <Link to="/reservation">Reservation</Link>
      ) : (
        <Link to="/reservation">Reservation</Link>
      ),
    },
    {
      key: "/client-management",
      icon: <FaUserTie size={23} />,
      label: isCollapsed ? (
        <Link to="/client-management">Client Management</Link>
      ) : (
        <Link to="/client-management">Client Management</Link>
      ),
    },
    // {
    //   key: "/driver-management",
    //   icon: <FaUserNurse size={23} />,
    //   label: isCollapsed ? (
    //     <Link to="/driver-management">Driver Management</Link>
    //   ) : (
    //     <Link to="/driver-management">Driver Management</Link>
    //   ),
    // },
    {
      key: "subMenuSetting-3",
      icon: <FaUserNurse size={`${isCollapsed ? 25 : 25}`} />,
      label: "Driver Management",
      children: [
        {
          key: "/driver-management",
          icon: <RiUserSettingsFill size={23} />,
          label: isCollapsed ? (
            <Link to="/driver-management">Driver Management</Link>
          ) : (
            <Link to="/driver-management">Driver Management</Link>
          ),
        },
        {
          key: "/driver-schedule",
          icon: <RxLapTimer size={23} />,
          label: isCollapsed ? (
            <Link to="/driver-schedule">Driver Schedule</Link>
          ) : (
            <Link to="/driver-schedule">Driver Schedule</Link>
          ),
        },
      ],
    },
    {
      key: "/fleet-management",
      icon: <BiSolidCarMechanic size={23} />,
      label: isCollapsed ? (
        <Link to="/fleet-management">Fleet Management</Link>
      ) : (
        <Link to="/fleet-management">Fleet Management</Link>
      ),
    },

    {
      key: "/transaction",
      icon: <PiWallet size={25} />,
      label: isCollapsed ? (
        <Link to="/transaction">Transaction</Link>
      ) : (
        <Link to="/transaction">Transaction</Link>
      ),
    },
    {
      key: "/location",
      icon: <PiMapPinAreaBold size={25} />,
      label: isCollapsed ? (
        <Link to="/location">Location</Link>
      ) : (
        <Link to="/location">Location</Link>
      ),
    },
    {
      key: "/team",
      icon: <RiTeamFill size={25} />,
      label: isCollapsed ? (
        <Link to="/team">Team</Link>
      ) : (
        <Link to="/team">Team</Link>
      ),
    },
    {
      key: "/extra",
      icon: <FaTh size={25} />,
      label: isCollapsed ? (
        <Link to="/extra">Extra</Link>
      ) : (
        <Link to="/extra">Extra</Link>
      ),
    },
    {
      key: "/contact-list",
      icon: <TiThList size={25} />,
      label: isCollapsed ? (
        <Link to="/contact-list">Contact List</Link>
      ) : (
        <Link to="/contact-list">Contact List</Link>
      ),
    },
    // {
    //   key: "/reported-issues",
    //   icon: <MdOutlineReportProblem size={25} />,
    //   label: isCollapsed ? (
    //     <Link to="/reported-issues">Report</Link>
    //   ) : (
    //     <Link to="/reported-issues">Report</Link>
    //   ),
    // },

    {
      key: "subMenuSetting",
      icon: <CgTemplate size={`${isCollapsed ? 25 : 25}`} />,
      label: "Cms",
      children: [
        {
          key: "/privacy-policy",

          icon: <MdOutlinePrivacyTip size={24} />,
          label: (
            <Link to="/privacy-policy" className="text-white hover:text-white">
              Privacy Policy
            </Link>
          ),
        },
        {
          key: "/terms-and-conditions",
          icon: <IoDocumentTextOutline size={24} />,
          label: (
            <Link
              to="/terms-and-conditions"
              className="text-white hover:text-white"
            >
              Terms And Condition
            </Link>
          ),
        },
        {
          key: "/faq",
          icon: <FaQuoteRight size={24} />,
          label: (
            <Link to="/faq" className="text-white hover:text-white">
              FAQ
            </Link>
          ),
        },
        // {
        //   key: "/announcement",
        //   icon: <GrAnnounce size={25} />,
        //   label: isCollapsed ? (
        //     <Link to="/announcement">Announcement</Link>
        //   ) : (
        //     <Link to="/announcement">Announcement</Link>
        //   ),
        // },
        // {
        //   key: "/category-list",
        //   icon: <TbCategory2 size={24} />,
        //   label: (
        //     <Link to="/category-list" className="text-white hover:text-white">
        //       Category
        //     </Link>
        //   ),
        // },
        // {
        //   key: "/logo",
        //   icon: <SiAntdesign size={24} />,
        //   label: (
        //     <Link to="/logo" className="text-white hover:text-white">
        //       Logo
        //     </Link>
        //   ),
        // },
        {
          key: "/contact",
          icon: <RiContactsBook3Line size={24} />,
          label: (
            <Link to="/contact" className="text-white hover:text-white">
              Contact Us
            </Link>
          ),
        },
      ],
    },

    {
      key: "/logout",
      icon: <FiLogOut size={24} />,
      label: isCollapsed ? null : (
        <Link
          to="/auth/login"
          onClick={handleLogout}
          className="text-white hover:text-white"
        >
          Logout
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );

    if (selectedItem) {
      setSelectedKey(path);

      if (selectedItem.children) {
        setOpenKeys([selectedItem.key]);
      } else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) {
          setOpenKeys([parentItem.key]);
        }
      }
    }
  }, [path]);

  return (
    <div
      className={`bg-quilocoP h-full shadow-md transition-all duration-300  max-h-100  ${
        isCollapsed ? "w-[80px]" : "w-[280px]"
      }`}
    >
      <Link
        to="/"
        className="flex items-center justify-center py-4 text-white bg-white sticky z-50 mb-10"
      >
        <div className="w-full flex items-center justify-center bg-quilocoP px-4 py-3 -mt-1.5 gap-3 rounded-lg">
          <TbLayoutDashboardFilled size={40} className="text-smart" />

          {!isCollapsed ? (
            <p className="text-2xl text-smart font-semibold ">Dashboard</p>
          ) : (
            // <img src={logo} />
            // <img src={logo} className="mt-3" />
            <p className="text-2xl text-smart font-semibold "></p>
          )}
          {/* <img src={"qilocoLogo"} /> */}
        </div>
      </Link>
      <div
        className=" h-[80%]  overflow-y-auto
  [&::-webkit-scrollbar]:w-0
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
"
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          inlineCollapsed={isCollapsed}
          className="text-white  bg-white my-auto "
        />
      </div>
    </div>
  );
};

export default Sidebar;
