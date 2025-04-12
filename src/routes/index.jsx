import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home/Home";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy/PrivacyPolicy.jsx";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";

import TermsAndCondition from "../Pages/Dashboard/TermsAndCondition/TermsAndCondition";
import Transaction from "../Pages/Dashboard/Transaction/Transaction.jsx";
import Setting from "../Pages/Dashboard/Setting/Setting.jsx";
import Contact from "../Pages/Dashboard/Contact/Contact.jsx";
import Report from "../Pages/Dashboard/Report/Report.jsx";
import User from "../Pages/Dashboard/Reservation/Reservation.jsx";

import Category from "../Pages/Dashboard/Category/Category.jsx";
import Announcement from "../Pages/Dashboard/Announcement/Announcement.jsx";
import Logo from "../Pages/Dashboard/Logo/LogoList.jsx";
import CategoryManagement from "../Pages/Dashboard/Category Management/CategoryManagement.jsx";
import Notifications from "../Pages/Dashboard/Notification/Notifications.jsx";
import CategoryFAQ from "../Pages/Dashboard/FAQ/CategoryFAQ.jsx";
import Reservation from "../Pages/Dashboard/Reservation/Reservation.jsx";
import ClientMangement from "../Pages/Dashboard/Client management/ClientMangement.jsx";
import FleetManagement from "../Pages/Dashboard/FleetManagement/FleetManagement.jsx";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/transaction",
        element: <Transaction />,
      },

      {
        path: "/reported-issues",
        element: <Report />,
      },

      {
        path: "/reservation",
        element: <Reservation />,
      },
      {
        path: "/client-management",
        element: <ClientMangement />,
      },
      {
        path: "/fleet-management",
        element: <FleetManagement />,
      },
      {
        path: "/announcement",
        element: <Announcement />,
      },
      {
        path: "/category-subcategory-management",
        element: <CategoryManagement />,
      },
      {
        path: "/faq",
        element: <CategoryFAQ />,
      },

      {
        path: "/logo",
        element: <Logo />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/category-list",
        element: <Category />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndCondition />,
      },

      {
        path: "/notification",
        element: <Notifications />,
      },

      {
        path: "/settings",
        element: <Setting />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
