import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useSidebar } from "../../Context/SidebarContext";

const Main = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="h-screen w-screen flex bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-screen">
        <Header />
        <div className="flex-1 p-4  bg-slate-100 sm:overflow-clip h-screen overflow-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
