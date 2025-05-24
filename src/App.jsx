import React from "react";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { SidebarProvider } from "../src/Context/SidebarContext";
function App() {
  return (
    <SidebarProvider>
      <React.Fragment>
        <RouterProvider router={router} />
      </React.Fragment>
    </SidebarProvider>
  );
}
export default App;
