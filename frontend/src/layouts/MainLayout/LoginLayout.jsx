import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/NavBar/Navbar";


import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default MainLayout; 